import { Bot, Context } from 'grammy';
import { validateUrl } from './urlValidator';
import { messages } from './messages';
import { findUserByTelegramId, changeUserLink } from '../database/database';
import { requiredEnv } from '../helpers/requiredEnv';

export function registerBotHandlers(bot: Bot): void {
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
}

export async function startBot(): Promise<void> {
    const bot = new Bot(requiredEnv('BOT_TOKEN'));

    registerBotHandlers(bot);
    console.log('Starting bot...');
    await bot.start({
        onStart: () => {
            console.log('Bot started successfully');
        },
    });
}
