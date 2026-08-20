import Datastore from '@seald-io/nedb';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { User } from './user.interface';
import { requiredEnv } from '../helpers/requiredEnv';

let db: Datastore<User> | null = null;
let currentPath: string | null = null;

export async function openDb(
    databasePath: string,
    shouldInitializeUsers = false,
): Promise<Datastore<User>> {
    const directory = path.dirname(databasePath);

    await fs.mkdir(directory, { recursive: true });

    db = new Datastore<User>({
        filename: databasePath,
        autoload: true,
    });

    currentPath = databasePath;

    await ensureUserIndexes();

    if (shouldInitializeUsers) {
        await initializeUsers();
    }

    return db;
}

export function changeUserLink(telegramUserId: string, link: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        getDb().update(
            { telegramUserId },
            { $set: { link } },
            { returnUpdatedDocs: true },
            (error, _numAffected, affectedDocument) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(affectedDocument ?? null);
            },
        );
    });
}

export function findUserByTelegramId(telegramUserId: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        getDb().findOne({ telegramUserId }, (error, user) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(user ?? null);
        });
    });
}

export function findUserByUsername(username: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        getDb().findOne({ username }, (error, user) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(user ?? null);
        });
    });
}

async function initializeUsers(): Promise<void> {
    const initialUsers: User[] = [
        {
            telegramUserId: requiredEnv('INITIAL_USER_1_TELEGRAM_ID'),
            username: requiredEnv('INITIAL_USER_1_USERNAME'),
            link: requiredEnv('INITIAL_USER_1_LINK'),
        },
        {
            telegramUserId: requiredEnv('INITIAL_USER_2_TELEGRAM_ID'),
            username: requiredEnv('INITIAL_USER_2_USERNAME'),
            link: requiredEnv('INITIAL_USER_2_LINK'),
        },
    ];

    await removeAllUsers();
    await new Promise<void>((resolve, reject) => {
        getDb().insert(initialUsers, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

    console.log('Database users reset');
}

function removeAllUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
        getDb().remove({}, { multi: true }, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

function getDb(): Datastore<User> {
    if (!db) {
        throw new Error('Database has not been initialized');
    }

    return db;
}

function ensureIndex(fieldName: 'telegramUserId' | 'username'): Promise<void> {
    return new Promise((resolve, reject) => {
        getDb().ensureIndex(
            {
                fieldName,
                unique: true,
            },
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            },
        );
    });
}

function ensureUserIndexes(): Promise<void> {
    return Promise.all([ensureIndex('telegramUserId'), ensureIndex('username')]).then(
        () => undefined,
    );
}
