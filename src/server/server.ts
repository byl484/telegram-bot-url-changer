import http from 'node:http';
import { findUserByUsername } from '../database/database';
import { requiredEnv } from '../helpers/requiredEnv';

const PORT = Number(requiredEnv('SERVER_PORT'));

export function startServer(): Promise<http.Server> {
    return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

            if (req.method === 'GET' && url.pathname === '/') {
                const username = url.searchParams.get('v');

                if (!username) {
                    res.writeHead(400);
                    res.end('Missing user');
                    return;
                }

                try {
                    const user = await findUserByUsername(username);

                    if (!user) {
                        res.writeHead(404);
                        res.end('User not found');
                        return;
                    }
                    res.writeHead(302, {
                        Location: user.link,
                    });
                    res.end();
                } catch (error) {
                    console.error('Error handling request:', error);

                    res.writeHead(500);
                    res.end('Internal server error');
                }

                return;
            }

            res.writeHead(404);
            res.end('Not found');
        });

        server.once('error', reject);

        server.listen(PORT, () => {
            console.log(`HTTP server listening on port ${PORT}`);
            resolve(server);
        });
    });
}
