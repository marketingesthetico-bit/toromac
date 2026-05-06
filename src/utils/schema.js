import { SITE_URL } from './seo';

// Datos de empresa centralizados. Actualizar cuando Toromac confirme
// telefono, direccion fisica y emails finales.
export const ORG = {
  name: 'Toromac',
  legalName: 'Toro Maquinaria Industria Alimentaria',
  url: SITE_URL,
  logo: `${SITE_URL}/images/brand/logo-toromac.svg`,
  email: 'jtoro@marobera.com',
  foundingYear: 1985,
  sameAs: [],
  address: {
    streetAddress: '',
    addressLocality: '',
    postalCode: '',
    addressCountry: 'ES',
  },
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    foundingDate: String(ORG.foundingYear),
    sameAs: ORG.sameAs,
  };
}

export function websiteSchema(lang = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG.name,
    url: lang === 'en' ? `${SITE_URL}/en` : SITE_URL,
    inLanguage: lang === 'en' ? 'en' : 'es',
    publisher: { '@type': 'Organization', name: ORG.name },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      ...ORG.address,
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// Producto en un idioma concreto. `product` debe seguir la estructura
// definida en CLAUDE.md §7.
export function productSchema(product, lang = 'es') {
  const slug = product.slug?.[lang] || product.id;
  const productPath = lang === 'en' ? `/en/products/${slug}` : `/productos/${slug}`;
  const name = product.name?.[lang] || product.name?.es;
  const description = product.shortDescription?.[lang] || product.description?.[lang];
  const image = product.image ? `${SITE_URL}${product.image}` : ORG.logo;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url: `${SITE_URL}${productPath}`,
    brand: { '@type': 'Brand', name: ORG.name },
    manufacturer: { '@type': 'Organization', name: ORG.name },
    category: product.category,
  };
}

export function articleSchema(article, lang = 'es') {
  const slug = article.slug?.[lang] || article.id;
  const articlePath = lang === 'en' ? `/en/news/${slug}` : `/novedades/${slug}`;
  const title = article.title?.[lang] || article.title?.es;
  const description = article.metaDescription?.[lang];
  const image = article.heroImage ? `${SITE_URL}${article.heroImage}` : ORG.logo;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url: `${SITE_URL}${articlePath}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: lang === 'en' ? 'en' : 'es',
    author: { '@type': 'Organization', name: article.author || ORG.name },
    publisher: {
      '@type': 'Organization',
      name: ORG.name,
      logo: { '@type': 'ImageObject', url: ORG.logo },
    },
  };
}

export function faqPageSchema(faqs, lang = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question?.[lang] || f.question?.es,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer?.[lang] || f.answer?.es,
      },
    })),
  };
}
