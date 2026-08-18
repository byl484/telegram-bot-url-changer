import 'dotenv/config';
import { Bot } from 'grammy';
import pg from 'pg';
import { validateSpotifyUrl } from './validateUrl';

const { Pool } = pg;

const botToken = process.env.BOT_TOKEN;
const databaseUrl = process.env.DATABASE_URL;
const allowedUserIds = new Set(
    (process.env.ALLOWED_USER_IDS ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
);

if (!botToken) {
    throw new Error('BOT_TOKEN is not set');
}

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
}

const bot = new Bot(botToken);

const pool = new Pool({
    connectionString: databaseUrl,
});

bot.on('message:text', async (ctx) => {
    const userId = ctx.from?.id.toString();

    if (!userId || !allowedUserIds.has(userId)) {
        await ctx.reply('Unauthorized');
        return;
    }

    const spotifyUrl = validateSpotifyUrl(ctx.message.text);
    if (!spotifyUrl) {
        await ctx.reply('Please send a valid Spotify link.');
        return;
    }

    //TODO: Changing of the URL based on who requests it.
    await ctx.reply(`Link updated successfully to:\n${spotifyUrl}`);
});

async function main() {
    console.log('Starting bot...');
    await bot.start({
        onStart: () => {
            console.log('Bot started successfully');
        },
    });
}

main().catch((error) => {
    console.error('Failed to start bot:', error);
    process.exit(1);
});
