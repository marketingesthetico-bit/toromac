import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { detectLang, getCanonical, getAlternates } from '../../utils/seo';

/**
 * Wrapper de Helmet que inyecta:
 *  - title, meta description
 *  - canonical
 *  - hreflang ES / EN / x-default (calculado a partir de la ruta o `alternates`)
 *  - Open Graph base + image opcional
 *  - JSON-LD (uno o varios bloques pasados via `schema`)
 *
 * Uso:
 *   <PageSeo
 *     title="..."
 *     description="..."
 *     image="/images/og/home.jpg"
 *     schema={[organizationSchema(), websiteSchema('es')]}
 *     alternates={{ es: '/productos/elevador-x', en: '/en/products/x-elevator' }}
 *   />
 */
export default function PageSeo({
  title,
  description,
  image,
  type = 'website',
  schema,
  alternates,
  noindex = false,
}) {
  const location = useLocation();
  const path = location.pathname;
  const lang = detectLang(path);
  const canonical = getCanonical(path);
  const alts = getAlternates(path, alternates || {});
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `https://toromac.com${image}`
    : 'https://toromac.com/images/brand/logo-toromac.svg';

  const schemaArr = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="es" href={alts.es} />
      <link rel="alternate" hrefLang="en" href={alts.en} />
      <link rel="alternate" hrefLang="x-default" href={alts.xDefault} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang === 'en' ? 'en_GB' : 'es_ES'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {schemaArr.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
