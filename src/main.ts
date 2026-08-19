import 'dotenv/config';
import { startBot } from './bot/bot';
import { startServer } from './server/server';
import { openDb } from './database/database';
import { requiredEnv } from './helpers/requiredEnv';

async function main(): Promise<void> {
    const shouldInitializeUsers = process.argv.includes('--init');
    await openDb(requiredEnv('DATABASE_PATH'), shouldInitializeUsers);

    await Promise.all([startBot(), startServer()]);
}

main().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
