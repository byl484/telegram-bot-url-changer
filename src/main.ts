import { startBot } from './telegramBot/telegramBot';
import { startServer } from './server/server';

async function main(): Promise<void> {
    await Promise.all([startBot(), startServer()]);
    console.log('Application started');
}

main().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
