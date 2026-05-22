import { getCategoryLabel } from './useProducts';

// Carga todos los articulos (objetos bilingues) desde src/data/articles/**.
// Cada articulo se almacena una sola vez como objeto bilingue; el glob recorre
// las subcarpetas es/ y en/ y se deduplica por `id` (n8n puede escribir en
// ambas carpetas, ver api/publish-article.js).
const modules = import.meta.glob('../data/articles/**/*.json', { eager: true });

const byId = new Map();
for (const mod of Object.values(modules)) {
  const a = mod?.default ?? mod;
  if (a && a.id && !byId.has(a.id)) byId.set(a.id, a);
}

const ARTICLES = [...byId.values()].sort(
  (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
);

export function getAllArticles() {
  return ARTICLES;
}

export function getLatestArticles(limit = 3) {
  return ARTICLES.slice(0, limit);
}

export function getArticlesByCategory(categoryId) {
  if (!categoryId) return ARTICLES;
  return ARTICLES.filter((a) => a.category === categoryId);
}

export function getArticleBySlug(slug, lang = 'es') {
  return ARTICLES.find((a) => a.slug?.[lang] === slug || a.id === slug);
}

export function getRelatedArticles(article, lang = 'es', limit = 3) {
  if (!article) return [];
  const sameCategory = ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category
  );
  const pool = sameCategory.length >= limit
    ? sameCategory
    : [...sameCategory, ...ARTICLES.filter((a) => a.id !== article.id && a.category !== article.category)];
  return pool.slice(0, limit);
}

// Categorias presentes en al menos un articulo, en el orden de la taxonomia
// de producto (reutilizamos las mismas categorias).
const CATEGORY_ORDER = [
  'elevacion-transporte',
  'recambios-cangilones',
  'procesado',
  'dosificacion',
  'otros',
];

export function getArticleCategories() {
  const present = new Set(ARTICLES.map((a) => a.category).filter(Boolean));
  return CATEGORY_ORDER.filter((id) => present.has(id));
}

export { getCategoryLabel };

// Lectura estimada en minutos a partir del contenido (bloques tipados).
export function getReadingMinutes(article, lang = 'es') {
  const blocks = article?.content?.[lang] || article?.content?.es || [];
  let words = 0;
  for (const b of blocks) {
    if (b.text) words += b.text.split(/\s+/).length;
    if (Array.isArray(b.items)) words += b.items.join(' ').split(/\s+/).length;
    if (Array.isArray(b.rows)) words += b.rows.flat().join(' ').split(/\s+/).length;
  }
  return Math.max(1, Math.round(words / 200));
}
