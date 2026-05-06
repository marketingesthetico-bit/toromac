import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

const SITE_URL = 'https://toromac.com';

// Sitemap — Fase 1: rutas estaticas base. En Fases 4 y 6 se ampliara con productos y articulos.
// Los hreflang se emiten por pagina via PageSeo.jsx, no a nivel de sitemap, porque los slugs
// difieren entre ES y EN (productos vs products) y las URLs no se mapean por simple prefijo.
const baseRoutes = [
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

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: baseRoutes,
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
