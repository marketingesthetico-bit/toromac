import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import productsData from './src/data/products/products.json' with { type: 'json' };

const SITE_URL = 'https://toromac.com';

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

const ALL_ROUTES = [...STATIC_ROUTES, ...PRODUCT_ROUTES_ES, ...PRODUCT_ROUTES_EN];

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
