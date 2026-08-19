import { startBot } from './bot/bot';
import { startServer } from './server/server';
import { initDb } from './database/database';

async function main(): Promise<void> {
    await initDb('data/database.db');

    await Promise.all([startBot(), startServer()]);

    console.log('Application started');
}

main().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
