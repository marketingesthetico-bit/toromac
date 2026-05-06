// Descarga logos de clientes desde marobera.com a public/images/clients/
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'public', 'images', 'clients');

const CLIENTS = [
  ['gallo',         'https://marobera.com/wp-content/uploads/2020/10/cliente-pastas-gallo.png'],
  ['bfr-latinpack', 'https://marobera.com/wp-content/uploads/2020/10/cliente-bfr-latinpack.png'],
  ['grefusa',       'https://marobera.com/wp-content/uploads/2020/10/cliente-grefusa.png'],
  ['radar-process', 'https://marobera.com/wp-content/uploads/2020/10/cliente-radar-process.png'],
  ['oromas',        'https://marobera.com/wp-content/uploads/2020/10/cliente-oromas.png'],
  ['rovema',        'https://marobera.com/wp-content/uploads/2020/10/cliente-rovema.png'],
  ['ulma',          'https://marobera.com/wp-content/uploads/2020/10/cliente-ulma.png'],
  ['realplast',     'https://marobera.com/wp-content/uploads/2020/10/cliente-realplast.png'],
  ['chupa-chups',   'https://marobera.com/wp-content/uploads/2020/10/cliente-chupa-chups.png'],
  ['mipcre',        'https://marobera.com/wp-content/uploads/2020/10/cliente-mipcre.png'],
];

async function downloadOne(slug, url) {
  const dest = path.join(OUT, `${slug}.png`);
  if (existsSync(dest)) return { slug, status: 'exists' };
  try {
    const res = await fetch(url, { headers: { Referer: 'https://marobera.com/' } });
    if (!res.ok) return { slug, status: `fail-${res.status}`, url };
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    return { slug, status: `ok-${(buf.length/1024).toFixed(0)}KB` };
  } catch (e) {
    return { slug, status: `err-${e.message}`, url };
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const results = await Promise.all(CLIENTS.map(([slug, url]) => downloadOne(slug, url)));
  for (const r of results) console.log(`${r.status.padEnd(15)} ${r.slug}`);
}

main();
