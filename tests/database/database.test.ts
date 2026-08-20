import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    openDb,
    changeUserLink,
    findUserByTelegramId,
    findUserByUsername,
} from '../../src/database/database';

describe('database', () => {
    let tempDirectory: string;
    let databasePath: string;

    beforeEach(async () => {
        tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'tg-bot-test-'));
        databasePath = path.join(tempDirectory, 'test.db');
    });

    afterEach(async () => {
        vi.unstubAllEnvs();
        await fs.rm(tempDirectory, { recursive: true, force: true });
    });

    it('opens the database', async () => {
        const db = await openDb(databasePath);

        expect(db).toBeDefined();
    });

    it('creates the database directory', async () => {
        const nestedPath = path.join(tempDirectory, 'nested', 'data.db');

        await openDb(nestedPath);

        const stats = await fs.stat(path.dirname(nestedPath));

        expect(stats.isDirectory()).toBe(true);
    });

    it('returns null when the user does not exist', async () => {
        await openDb(databasePath);

        const user = await findUserByTelegramId('123');

        expect(user).toBeNull();
    });

    it('finds a user by Telegram ID', async () => {
        const db = await openDb(databasePath);

        await new Promise<void>((resolve, reject) => {
            db.insert(
                {
                    telegramUserId: '123',
                    username: 'anders',
                    link: 'https://example.com',
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

        const user = await findUserByTelegramId('123');

        expect(user).toMatchObject({
            telegramUserId: '123',
            username: 'anders',
            link: 'https://example.com',
        });
    });

    it('finds a user by username', async () => {
        const db = await openDb(databasePath);

        await new Promise<void>((resolve, reject) => {
            db.insert(
                {
                    telegramUserId: '123',
                    username: 'anders',
                    link: 'https://example.com',
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

        const user = await findUserByUsername('anders');

        expect(user).toMatchObject({
            telegramUserId: '123',
            username: 'anders',
            link: 'https://example.com',
        });
    });

    it('changes a user link', async () => {
        const db = await openDb(databasePath);

        await new Promise<void>((resolve, reject) => {
            db.insert(
                {
                    telegramUserId: '123',
                    username: 'anders',
                    link: 'https://old.example.com',
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

        const updatedUser = await changeUserLink('123', 'https://new.example.com');

        expect(updatedUser).toMatchObject({
            telegramUserId: '123',
            username: 'anders',
            link: 'https://new.example.com',
        });
    });

    it('returns null when changing a nonexistent user', async () => {
        await openDb(databasePath);

        const user = await changeUserLink('does-not-exist', 'https://example.com');

        expect(user).toBeNull();
    });

    it('rejects duplicate Telegram user IDs', async () => {
        const db = await openDb(databasePath);

        const insert = (telegramUserId: string, username: string) =>
            new Promise<void>((resolve, reject) => {
                db.insert(
                    {
                        telegramUserId,
                        username,
                        link: 'https://example.com',
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

        await insert('123', 'anders');

        await expect(insert('123', 'another-user')).rejects.toBeDefined();
    });

    it('rejects duplicate usernames', async () => {
        const db = await openDb(databasePath);

        const insert = (telegramUserId: string, username: string) =>
            new Promise<void>((resolve, reject) => {
                db.insert(
                    {
                        telegramUserId,
                        username,
                        link: 'https://example.com',
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

        await insert('123', 'anders');

        await expect(insert('456', 'anders')).rejects.toBeDefined();
    });

    it('initializes users from environment variables', async () => {
        vi.stubEnv('INITIAL_USER_1_TELEGRAM_ID', '111');
        vi.stubEnv('INITIAL_USER_1_USERNAME', 'anders');
        vi.stubEnv('INITIAL_USER_1_LINK', 'https://anders.example.com');

        vi.stubEnv('INITIAL_USER_2_TELEGRAM_ID', '222');
        vi.stubEnv('INITIAL_USER_2_USERNAME', 'another');
        vi.stubEnv('INITIAL_USER_2_LINK', 'https://another.example.com');

        await openDb(databasePath, true);

        const user1 = await findUserByTelegramId('111');
        const user2 = await findUserByUsername('another');

        expect(user1).toMatchObject({
            telegramUserId: '111',
            username: 'anders',
            link: 'https://anders.example.com',
        });

        expect(user2).toMatchObject({
            telegramUserId: '222',
            username: 'another',
            link: 'https://another.example.com',
        });
    });
});
