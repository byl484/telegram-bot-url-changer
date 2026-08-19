import http from 'node:http';
import { requiredEnv } from '../helpers/requiredEnv';

const PORT = Number(requiredEnv('SERVER_PORT'));

export function startServer(): Promise<http.Server> {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

            if (req.method === 'GET' && url.pathname === '/') {
                const source = url.searchParams.get('source');

                if (source === 'a') {
                    // Handle URL A
                } else if (source === 'b') {
                    // Handle URL B
                } else {
                    res.writeHead(400);
                    res.end('Invalid source');
                    return;
                }

                res.writeHead(200);
                res.end('OK');
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
