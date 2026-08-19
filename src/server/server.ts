import http from 'node:http';

const PORT = Number(process.env.PORT) || 3000;

export function startServer(): Promise<http.Server> {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            if (req.method === 'GET' && req.url === '/health') {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });

                res.end(
                    JSON.stringify({
                        status: 'ok',
                    }),
                );

                return;
            }

            res.writeHead(404, {
                'Content-Type': 'application/json',
            });

            res.end(
                JSON.stringify({
                    error: 'Not found',
                }),
            );
        });

        server.once('error', reject);

        server.listen(PORT, () => {
            console.log(`HTTP server listening on port ${PORT}`);
            resolve(server);
        });
    });
}
