import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLACEHOLDER = '__SW_BUILD__';
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const build = process.env.KONVITA_BUILD_ID || Date.now().toString(36);
const swPath = path.join(dist, 'sw.js');

if (!fs.existsSync(swPath)) {
  console.error(`stamp-sw: missing ${swPath}`);
  process.exit(1);
}

const sw = fs.readFileSync(swPath, 'utf8');
if (!sw.includes(PLACEHOLDER)) {
  console.error('stamp-sw: sw.js is missing the __SW_BUILD__ placeholder');
  process.exit(1);
}

fs.writeFileSync(swPath, sw.replaceAll(PLACEHOLDER, build));
fs.writeFileSync(path.join(dist, 'version.json'), `${JSON.stringify({ build })}\n`);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    if (html.includes(PLACEHOLDER)) {
      html = html.replaceAll(PLACEHOLDER, build);
    } else if (!html.includes('name="konvita-build"')) {
      html = html.replace(/<head[^>]*>/i, (open) => `${open}<meta name="konvita-build" content="${build}" />`);
    }
    fs.writeFileSync(full, html);
  }
}

walk(dist);
console.log(`stamp-sw: konvita-${build}`);
