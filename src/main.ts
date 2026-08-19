import 'dotenv/config';
import { startBot } from './bot/bot';
import { startServer } from './server/server';
import { initDb } from './database/database';
import { requiredEnv } from './helpers/requiredEnv';

async function main(): Promise<void> {
    await initDb(requiredEnv('DATABASE_PATH'));

    await Promise.all([startBot(), startServer()]);

    console.log('Application started');
}

main().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
