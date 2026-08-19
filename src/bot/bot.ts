import 'dotenv/config';
import { Bot } from 'grammy';
import { validateUrl } from './urlValidator';
import { messages } from './messages';

const botToken = process.env.BOT_TOKEN;
const allowedUserIds = new Set(
    (process.env.ALLOWED_USER_IDS ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
);

if (!botToken) {
    throw new Error('BOT_TOKEN is not set');
}

const bot = new Bot(botToken);

bot.on('message:text', async (ctx) => {
    const userId = ctx.from?.id.toString();

    if (!userId || !allowedUserIds.has(userId)) {
        await ctx.reply(messages.unauthorized);
        return;
    }

    const spotifyUrl = validateUrl(ctx.message.text);
    if (!spotifyUrl) {
        await ctx.reply(messages.invalidLink);
        return;
    }

    try {
        // TODO: Changing of the URL based on who requests it.
        await ctx.reply(`${messages.updateSuccess}\n${spotifyUrl}`);
    } catch (error) {
        console.error('Error handling message:', error);
        await ctx.reply(messages.updateError);
    }
});

export async function startBot() {
    console.log('Starting bot...');
    await bot.start({
        onStart: () => {
            console.log('Bot started successfully');
        },
    });
}
