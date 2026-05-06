# Toromac — Web corporativa

Web bilingüe (ES/EN) de **Toromac — Toro Maquinaria Industria Alimentaria**. Catálogo de 26 productos, blog SEO automatizado vía n8n y formularios de contacto/presupuesto serverless.

> Fuente de verdad del proyecto: [`CLAUDE.md`](./CLAUDE.md). Léelo antes de tocar código.

## Stack

- **Frontend:** React 18 + Vite 5 + Tailwind 3 + React Router 6 + i18next + React Helmet Async + React Hook Form + Zod + Framer Motion + Lucide React
- **Serverless:** Vercel Functions (`api/contact.js`, `api/quote.js`, `api/publish-article.js`) con SDK Resend
- **SEO:** sitemap automático bilingüe (`vite-plugin-sitemap`), JSON-LD Schema.org, hreflang ES/EN/x-default
- **Despliegue:** Vercel + dominio `toromac.com`

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor local en http://localhost:5173
npm run build        # build de produccion en dist/
npm run preview      # servir el build local
npm run lint         # lint
```

## Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena los valores. En producción se configuran en el dashboard de Vercel.

## Estructura

Ver detalle en [`CLAUDE.md` §13](./CLAUDE.md). Resumen:

```
src/
  components/    layout, ui, seo
  pages/         es/, en/  (rutas EN bajo /en/*)
  data/          products/, articles/{es,en}/
  locales/       es.json, en.json
  hooks/, utils/
api/             Vercel Functions
public/images/   products/, articles/
```

## Idiomas

- ES por defecto: `/`, `/productos/`, `/novedades/`, etc.
- EN bajo prefijo: `/en/`, `/en/products/`, `/en/news/`, etc.
- Detección por path → localStorage → navegador. Persistencia en `localStorage` con clave `toromac-lang`.
