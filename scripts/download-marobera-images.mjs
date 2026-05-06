// Descarga imagenes placeholder de marobera.com a public/images/products/
// Mapeo URL Marobera -> slug Toromac (ID interno del producto).
// Ejecutar: node scripts/download-marobera-images.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'public', 'images', 'products');

// Pedimos resoluciones grandes cuando existen (sin -300x300 da el original).
// Para los listados (300x300) usamos esa. Para hero/detalle, mejor el original.
const PRODUCTS = [
  // [slug-toromac, url-marobera]
  ['elevador-cangilones-tipo-z',         'https://marobera.com/wp-content/uploads/2025/11/tipo-z2-1400x788.jpg'],
  ['elevador-cangilones-tipo-c',         'https://marobera.com/wp-content/uploads/2020/08/elevador-cangilones-marobera-tipo-c.jpg'],
  ['elevador-cangilones-tipo-o',         'https://marobera.com/wp-content/uploads/2020/08/elevador-cangilones-marobera-tipo-o-3.jpg'],
  ['elevador-cangilones-movil',          'https://marobera.com/wp-content/uploads/2020/11/elevador-cangilones-tipo-z-movil-marobera.jpg'],
  ['elevador-banda-tipo-z',              'https://marobera.com/wp-content/uploads/2020/10/elevador-de-banda-cinta-z-marobera.jpg'],
  ['elevador-sinfin',                    'https://marobera.com/wp-content/uploads/2020/09/elevador-gusano-sinfin-sin-fin-marobera-1400x507.jpg'],
  ['cinta-transportadora-banda-industrial','https://marobera.com/wp-content/uploads/2020/10/cinta-transportadora-azul-marobera.jpg'],

  ['cangilon-calyon-natural-2l',         'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-natural-marobera-2l.jpg'],
  ['cangilon-calyon-natural-5l',         'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-natural-marobera-5l.jpg'],
  ['cangilon-calyon-natural-7l',         'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-natural-marobera-7l.jpg'],
  ['cangilon-calyon-natural-10l',        'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-natural-marobera-10l.jpg'],
  ['cangilon-calyon-x-metal-detectable-2l',  'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-metal-detectable-marobera-2l.jpg'],
  ['cangilon-calyon-x-metal-detectable-5l',  'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-metal-detectable-marobera-5l.jpg'],
  ['cangilon-calyon-x-metal-detectable-7l',  'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-metal-detectable-marobera-7l.jpg'],
  ['cangilon-calyon-x-metal-detectable-10l', 'https://marobera.com/wp-content/uploads/2020/09/cangilon-bucket-metal-detectable-marobera-10l.jpg'],

  ['tamizadora-centrifuga-tc400',        'https://marobera.com/wp-content/uploads/2020/11/Tamizadora-Centrifuga-01bb.jpg'],
  ['tamizadora-centrifuga-tc650',        'https://marobera.com/wp-content/uploads/2020/11/Tamizadora-Centrifuga-01bb.jpg'],
  ['tamizadora-centrifuga-tc800',        'https://marobera.com/wp-content/uploads/2020/11/Tamizadora-Centrifuga-01cc.jpg'],
  ['tamizadora-centrifuga-tc1000',       'https://marobera.com/wp-content/uploads/2020/11/Tamizadora-Centrifuga-cernedor-industrial-marobera-01aa.jpg'],
  ['freidora-industrial-acero-inox',     'https://marobera.com/wp-content/uploads/2020/10/freidora-industrial-200kg-marobera.jpg'],
  ['caldera-volcable',                   'https://marobera.com/wp-content/uploads/2020/11/caldera-volcable.jpg'],

  ['soporte-big-bags',                   'https://marobera.com/wp-content/uploads/2023/05/1.jpg'],
  ['alimentador-silos-industrial',       'https://marobera.com/wp-content/uploads/2020/10/alimentador-de-silos-marobera.jpg'],
  ['deposito-agua-purificada',           'https://marobera.com/wp-content/uploads/2020/09/deposito-agua-purificada-marobera.jpg'],

  ['canal-alimentacion-vibrada',         'https://marobera.com/wp-content/uploads/2020/09/canal-alimentacion-vibrada-con-tolva-marobera.jpg'],
  ['filtro-ciclonico',                   'https://marobera.com/wp-content/uploads/2020/10/filtro-ciclonico-para-embolsado-de-marobera.jpg'],
];

async function downloadOne(slug, url) {
  const dest = path.join(OUT, `${slug}.jpg`);
  if (existsSync(dest)) {
    return { slug, status: 'exists' };
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ToromacWebSetup/1.0',
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8',
        Referer: 'https://marobera.com/',
      },
    });
    if (!res.ok) {
      // Reintenta con tamaño 300x300 si el original devuelve 404
      const fallback = url.replace(/\.jpg$/, '-300x300.jpg');
      const res2 = await fetch(fallback, { headers: { Referer: 'https://marobera.com/' } });
      if (!res2.ok) return { slug, status: `fail-${res.status}/${res2.status}`, url };
      const buf = Buffer.from(await res2.arrayBuffer());
      await writeFile(dest, buf);
      return { slug, status: `ok-fallback-${(buf.length/1024).toFixed(0)}KB` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    return { slug, status: `ok-${(buf.length/1024).toFixed(0)}KB` };
  } catch (e) {
    return { slug, status: `err-${e.message}`, url };
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const results = await Promise.all(PRODUCTS.map(([slug, url]) => downloadOne(slug, url)));
  for (const r of results) {
    console.log(`${r.status.padEnd(20)} ${r.slug}${r.url ? ' <- ' + r.url : ''}`);
  }
  const fails = results.filter(r => !r.status.startsWith('ok') && r.status !== 'exists');
  console.log(`\n${results.length - fails.length}/${results.length} descargadas, ${fails.length} fallidas`);
}

main();
