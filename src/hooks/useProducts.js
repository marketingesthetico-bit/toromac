import productsData from '../data/products/products.json';
import categoriesData from '../data/products/categories.json';

// Lista de categorias en orden de aparicion en navegacion / filtros.
export const CATEGORIES = [
  'elevacion-transporte',
  'recambios-cangilones',
  'procesado',
  'dosificacion',
  'otros',
].map((id) => ({ id, ...categoriesData[id] }));

export function getCategoryLabel(categoryId, lang = 'es') {
  const cat = categoriesData[categoryId];
  return cat?.label?.[lang] || cat?.label?.es || categoryId;
}

export function getCategoryMeta(categoryId) {
  return categoriesData[categoryId] || null;
}

export function getAllProducts() {
  return productsData;
}

export function getProductsByCategory(categoryId) {
  if (!categoryId) return productsData;
  return productsData.filter((p) => p.category === categoryId);
}

export function getFeaturedProducts(limit = 6) {
  return productsData.filter((p) => p.featured).slice(0, limit);
}

export function getProductBySlug(slug, lang = 'es') {
  return productsData.find((p) => p.slug?.[lang] === slug || p.id === slug);
}

export function getProductById(id) {
  return productsData.find((p) => p.id === id);
}

export function getRelatedProducts(product, lang = 'es', limit = 3) {
  if (!product) return [];
  return productsData
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

// Resuelve cualquier valor de spec que pueda venir como string o como
// objeto con traduccion {es, en}.
export function resolveSpecValue(value, lang = 'es') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.es || '';
}
