import { defineConfig } from 'vite';

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { transform } from './vite-plugin-include-html';

export default defineConfig({
    base: 'vigilant-succotash',
    plugins: [
        {
            name: 'vite-plugin-include-html',
            configureServer(server) {
                return () => {
                    server.middlewares.use(async (req, res) => {
                        const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

                        const template = await server.transformIndexHtml(
                            req.originalUrl,
                            fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
                        );

                        const html = transform(template);

                        res.end(html);
                    });
                };
            },
            handleHotUpdate(ctx) {
                if (!ctx.modules.length && ctx.file.endsWith('.template.html')) {
                    ctx.server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    });
                }
            },
        },
    ],
});
