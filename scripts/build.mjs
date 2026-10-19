// Wraps src/game.html (a page fragment, the format Claude Artifacts expect)
// into a complete HTML document at public/index.html for static hosting such as Vercel.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src/game.html'), 'utf8');

// Everything up to the end of the first <style> block belongs in <head>; the rest is page body.
const cut = src.indexOf('</style>') + '</style>'.length;
if (cut < '</style>'.length) throw new Error('src/game.html has no <style> block');
const head = src.slice(0, cut).trim();
const body = src.slice(cut).trim();

const favicon =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20 92V46C20 25 33 12 50 12S80 25 80 46V92Q72.5 84 65 92Q57.5 100 50 92Q42.5 84 35 92Q27.5 100 20 92Z" fill="#F6F3FF" stroke="#2A1F45" stroke-width="5"/><ellipse cx="40" cy="46" rx="5" ry="7" fill="#2A1F45"/><ellipse cx="60" cy="46" rx="5" ry="7" fill="#2A1F45"/><ellipse cx="50" cy="61" rx="4" ry="5" fill="#2A1F45"/></svg>'
  );

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#160F2C">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<link rel="icon" href="${favicon}">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;

mkdirSync(join(root, 'public'), { recursive: true });
writeFileSync(join(root, 'public/index.html'), html);
console.log(`built public/index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
