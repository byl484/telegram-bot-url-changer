import 'dotenv/config';
import { startBot } from './bot/bot';
import { startServer } from './server/server';
import { openDb } from './database/database';
import { requiredEnv } from './helpers/requiredEnv';

async function main(): Promise<void> {
    const shouldInitializeUsers = process.argv.includes('--init');

    await openDb(requiredEnv('DATABASE_PATH'), shouldInitializeUsers);

    const port = Number(requiredEnv('SERVER_PORT'));

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('SERVER_PORT must be a valid port number');
    }

    await Promise.all([startBot(), startServer(port)]);
}

main().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
