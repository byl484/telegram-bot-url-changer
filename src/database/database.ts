import Datastore from '@seald-io/nedb';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { User } from './user.interface';
import { requiredEnv } from '../helpers/requiredEnv';

const INITIAL_USERS: User[] = [
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

let db: Datastore<User> | null = null;
let currentPath: string | null = null;

export async function initDb(filename: string): Promise<Datastore<User>> {
    const directory = path.dirname(filename);

    await fs.mkdir(directory, { recursive: true });

    db = new Datastore<User>({
        filename,
        autoload: true,
    });

    currentPath = filename;

    await ensureUserIndex();
    await initializeUsers();

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

function ensureUserIndex(): Promise<void> {
    return new Promise((resolve, reject) => {
        getDb().ensureIndex(
            {
                fieldName: 'telegramUserId',
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

async function initializeUsers(): Promise<void> {
    const users = await findUsers();

    if (users.length !== INITIAL_USERS.length) {
        await removeAllUsers();

        await new Promise<void>((resolve, reject) => {
            getDb().insert(INITIAL_USERS, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        console.log('Database users reset');
    }
}

function findUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        getDb().find({}, (error: Error, users: User[]) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(users);
        });
    });
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

export function getDb(): Datastore<User> {
    if (!db) {
        throw new Error('Database has not been initialized');
    }

    return db;
}

export function getDbPath(): string | null {
    return currentPath;
}
