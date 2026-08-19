import { Bot } from 'grammy';
import { validateUrl } from './urlValidator';
import { messages } from './messages';
import { findUserByTelegramId, changeUserLink } from '../database/database';
import { requiredEnv } from '../helpers/requiredEnv';

const botToken = requiredEnv('BOT_TOKEN');
const bot = new Bot(botToken);

bot.on('message:text', async (ctx) => {
    try {
        const telegramUserId = ctx.from.id.toString();
        const user = await findUserByTelegramId(telegramUserId);

        if (!user) {
            await ctx.reply(messages.unauthorized);
            return;
        }
        const newUrl = validateUrl(ctx.message.text);

        if (!newUrl) {
            await ctx.reply(messages.invalidLink);
            return;
        }

        const updatedUser = await changeUserLink(telegramUserId, newUrl);

        if (!updatedUser) {
            await ctx.reply(messages.updateError);
            return;
        }

        await ctx.reply(`${messages.updateSuccess}\n${updatedUser.link}`);
    } catch (error) {
        console.error('Error handling message:', error);
        await ctx.reply(messages.updateError);
    }
});

export async function startBot(): Promise<void> {
    console.log('Starting bot...');
    await bot.start({
        onStart: () => {
            console.log('Bot started successfully');
        },
    });
}
