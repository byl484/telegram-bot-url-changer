import http from 'node:http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { findUserByUsername } from '../../src/database/database';
import { startServer } from '../../src/server/server';

vi.mock('../../src/database/database', () => ({
    findUserByUsername: vi.fn(),
}));

describe('HTTP server', () => {
    let server: http.Server;
    let port: number;

    beforeEach(async () => {
        server = await startServer(0);

        const address = server.address();

        if (!address || typeof address === 'string') {
            throw new Error('Failed to get server address');
        }

        port = address.port;
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    });

    async function request(path: string): Promise<{
        status: number;
        headers: http.IncomingHttpHeaders;
        body: string;
    }> {
        return new Promise((resolve, reject) => {
            const req = http.get(
                {
                    hostname: 'localhost',
                    port,
                    path,
                },
                (res) => {
                    let body = '';

                    res.on('data', (chunk) => {
                        body += chunk;
                    });

                    res.on('end', () => {
                        resolve({
                            status: res.statusCode ?? 0,
                            headers: res.headers,
                            body,
                        });
                    });
                },
            );

            req.on('error', reject);
        });
    }

    it('redirects to the user link', async () => {
        vi.mocked(findUserByUsername).mockResolvedValue({
            telegramUserId: '123',
            username: 'test',
            link: 'https://example.com/',
        });

        const response = await request('/u/test');

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('https://example.com/');
        expect(findUserByUsername).toHaveBeenCalledWith('test');
    });

    it('returns 404 when the user does not exist', async () => {
        vi.mocked(findUserByUsername).mockResolvedValue(null);

        const response = await request('/u/unknown');

        expect(response.status).toBe(404);
        expect(response.body).toBe('User not found');
    });

    it('returns 400 when the username is missing', async () => {
        const response = await request('/u/');

        expect(response.status).toBe(400);
        expect(response.body).toBe('Missing user');

        expect(findUserByUsername).not.toHaveBeenCalled();
    });

    it('returns 400 when the username contains another slash', async () => {
        const response = await request('/u/foo/bar');

        expect(response.status).toBe(400);
        expect(response.body).toBe('Missing user');

        expect(findUserByUsername).not.toHaveBeenCalled();
    });

    it('returns 404 for an unsupported path', async () => {
        const response = await request('/something');

        expect(response.status).toBe(404);
        expect(response.body).toBe('Not found');
    });

    it('returns 404 for the root path', async () => {
        const response = await request('/');

        expect(response.status).toBe(404);
        expect(response.body).toBe('Not found');
    });

    it('returns 500 when the database throws', async () => {
        vi.mocked(findUserByUsername).mockRejectedValue(new Error('Database error'));

        const response = await request('/u/test');

        expect(response.status).toBe(500);
        expect(response.body).toBe('Internal server error');
    });
});
