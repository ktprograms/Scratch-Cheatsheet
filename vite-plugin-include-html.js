import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const transform = (template) => {
    const templateRegex = /^\s*<!--#include (.*)-->\s*$/gm;
    return template.replaceAll(templateRegex, (_, file) => {
        const fileContent = fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
        return fileContent;
    });
};

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
    const rawTemplate = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
    fs.writeFileSync(path.resolve(__dirname, 'dist/index.html'), transform(rawTemplate));
}

export { transform };
