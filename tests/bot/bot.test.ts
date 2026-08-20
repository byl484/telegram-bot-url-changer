import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Bot } from 'grammy';
import { changeUserLink, findUserByTelegramId } from '../../src/database/database';
import { messages } from '../../src/bot/messages';
import { registerBotHandlers } from '../../src/bot/bot';
import { validateUrl } from '../../src/bot/urlValidator';

vi.mock('../database/database', () => ({
    findUserByTelegramId: vi.fn(),
    changeUserLink: vi.fn(),
}));

vi.mock('./messages', () => ({
    messages: {
        unauthorized: 'Unauthorized',
        invalidLink: 'Invalid link',
        updateError: 'Update error',
        updateSuccess: 'Updated successfully',
    },
}));

vi.mock('./urlValidator', () => ({
    validateUrl: vi.fn(),
}));

describe('bot message handler', () => {
    let bot: Bot;
    let handler: (ctx: any) => Promise<void>;

    beforeEach(() => {
        vi.clearAllMocks();

        bot = new Bot('test-token');

        vi.spyOn(bot, 'on').mockImplementation((_filter, callback) => {
            handler = callback as (ctx: any) => Promise<void>;
            return bot;
        });

        registerBotHandlers(bot);
    });

    it('rejects an unauthorized user', async () => {
        vi.mocked(findUserByTelegramId).mockResolvedValue(null);

        const ctx = {
            from: { id: 123456 },
            message: { text: 'https://example.com' },
            reply: vi.fn(),
        };

        await handler(ctx);

        expect(findUserByTelegramId).toHaveBeenCalledWith('123456');
        expect(ctx.reply).toHaveBeenCalledWith(messages.unauthorized);
        expect(validateUrl).not.toHaveBeenCalled();
        expect(changeUserLink).not.toHaveBeenCalled();
    });

    it('rejects an invalid URL', async () => {
        vi.mocked(findUserByTelegramId).mockResolvedValue({
            telegramUserId: '123456',
            username: 'test',
            link: 'https://example.com',
        });

        vi.mocked(validateUrl).mockReturnValue(null);

        const ctx = {
            from: { id: 123456 },
            message: { text: 'not a url' },
            reply: vi.fn(),
        };

        await handler(ctx);

        expect(validateUrl).toHaveBeenCalledWith('not a url');
        expect(ctx.reply).toHaveBeenCalledWith(messages.invalidLink);
        expect(changeUserLink).not.toHaveBeenCalled();
    });

    it('reports an error when updating the link fails', async () => {
        vi.mocked(findUserByTelegramId).mockResolvedValue({
            telegramUserId: '123456',
            username: 'test',
            link: 'https://example.com',
        });

        vi.mocked(validateUrl).mockReturnValue('https://new.example.com');
        vi.mocked(changeUserLink).mockResolvedValue(null);

        const ctx = {
            from: { id: 123456 },
            message: { text: 'https://new.example.com' },
            reply: vi.fn(),
        };

        await handler(ctx);

        expect(changeUserLink).toHaveBeenCalledWith('123456', 'https://new.example.com');
        expect(ctx.reply).toHaveBeenCalledWith(messages.updateError);
    });

    it('updates the link successfully', async () => {
        vi.mocked(findUserByTelegramId).mockResolvedValue({
            telegramUserId: '123456',
            username: 'test',
            link: 'https://old.example.com',
        });

        vi.mocked(validateUrl).mockReturnValue('https://new.example.com');

        vi.mocked(changeUserLink).mockResolvedValue({
            telegramUserId: '123456',
            username: 'test',
            link: 'https://new.example.com',
        });

        const ctx = {
            from: { id: 123456 },
            message: { text: 'https://new.example.com' },
            reply: vi.fn(),
        };

        await handler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith(
            `${messages.updateSuccess}\nhttps://new.example.com`,
        );
    });

    it('reports an error when the database throws', async () => {
        vi.mocked(findUserByTelegramId).mockRejectedValue(new Error('Database error'));

        const ctx = {
            from: { id: 123456 },
            message: { text: 'https://example.com' },
            reply: vi.fn(),
        };

        await handler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith(messages.updateError);
    });
});
