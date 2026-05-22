import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import productsData from './src/data/products/products.json' with { type: 'json' };

const SITE_URL = 'https://toromac.com';
const __dirname = dirname(fileURLToPath(import.meta.url));

const STATIC_ROUTES = [
  '/productos',
  '/compania',
  '/novedades',
  '/contacto',
  '/presupuesto',
  '/en',
  '/en/products',
  '/en/company',
  '/en/news',
  '/en/contact',
  '/en/quote',
];

const PRODUCT_ROUTES_ES = productsData.map((p) => `/productos/${p.slug?.es || p.id}`);
const PRODUCT_ROUTES_EN = productsData.map((p) => `/en/products/${p.slug?.en || p.id}`);

// Lee los artículos (objetos bilingues) y genera sus rutas en ambos idiomas.
function readArticles() {
  const out = [];
  for (const sub of ['es', 'en']) {
    const dir = join(__dirname, 'src', 'data', 'articles', sub);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    } catch {
      continue;
    }
    for (const f of files) {
      try {
        const a = JSON.parse(readFileSync(join(dir, f), 'utf8'));
        if (a?.id) out.push(a);
      } catch {
        // ignorar JSON inválido en build de sitemap
      }
    }
  }
  // dedupe por id
  const byId = new Map();
  for (const a of out) if (!byId.has(a.id)) byId.set(a.id, a);
  return [...byId.values()];
}

const ARTICLES = readArticles();
const ARTICLE_ROUTES_ES = ARTICLES.map((a) => `/novedades/${a.slug?.es || a.id}`);
const ARTICLE_ROUTES_EN = ARTICLES.map((a) => `/en/news/${a.slug?.en || a.id}`);

const ALL_ROUTES = [
  ...STATIC_ROUTES,
  ...PRODUCT_ROUTES_ES,
  ...PRODUCT_ROUTES_EN,
  ...ARTICLE_ROUTES_ES,
  ...ARTICLE_ROUTES_EN,
];

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: ALL_ROUTES,
      readable: true,
    }),
  ],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
  },
});
