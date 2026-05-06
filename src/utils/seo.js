export const SITE_URL = 'https://toromac.com';

// Mapeo de rutas estaticas ES <-> EN. Las rutas dinamicas (productos y articulos)
// se resuelven en sus paginas respectivas a partir del slug por idioma.
export const STATIC_ROUTE_MAP = {
  '/': '/en',
  '/productos': '/en/products',
  '/compania': '/en/company',
  '/novedades': '/en/news',
  '/contacto': '/en/contact',
  '/presupuesto': '/en/quote',
};

const STATIC_ROUTE_MAP_REVERSE = Object.fromEntries(
  Object.entries(STATIC_ROUTE_MAP).map(([es, en]) => [en, es])
);

export function normalizePath(pathname) {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export function detectLang(pathname) {
  const p = normalizePath(pathname);
  return p === '/en' || p.startsWith('/en/') ? 'en' : 'es';
}

// Devuelve la ruta equivalente en el otro idioma. Para rutas dinamicas
// (producto/articulo) se debe pasar `overrides` con los slugs traducidos.
export function getAlternatePath(pathname, overrides = {}) {
  const p = normalizePath(pathname);
  const lang = detectLang(p);

  if (lang === 'es' && overrides.en) return overrides.en;
  if (lang === 'en' && overrides.es) return overrides.es;

  if (lang === 'es' && STATIC_ROUTE_MAP[p]) return STATIC_ROUTE_MAP[p];
  if (lang === 'en' && STATIC_ROUTE_MAP_REVERSE[p]) return STATIC_ROUTE_MAP_REVERSE[p];

  // Fallback: home del otro idioma
  return lang === 'es' ? '/en' : '/';
}

export function getCanonical(pathname) {
  return `${SITE_URL}${normalizePath(pathname)}`;
}

export function getAlternates(pathname, overrides = {}) {
  const p = normalizePath(pathname);
  const lang = detectLang(p);
  const otherPath = getAlternatePath(p, overrides);

  const esPath = lang === 'es' ? p : otherPath;
  const enPath = lang === 'en' ? p : otherPath;

  return {
    es: `${SITE_URL}${esPath}`,
    en: `${SITE_URL}${enPath}`,
    xDefault: `${SITE_URL}${esPath}`,
  };
}
