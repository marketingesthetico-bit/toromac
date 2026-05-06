import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Eyebrow from './Eyebrow';
import Breadcrumb from '../layout/Breadcrumb';
import ProductCard from '../ui/ProductCard';
import PageSeo from '../seo/PageSeo';
import NotFound from '../../pages/NotFound';
import { useLang } from '../../hooks/useLang';
import {
  getProductBySlug,
  getRelatedProducts,
  getCategoryLabel,
  resolveSpecValue,
} from '../../hooks/useProducts';
import { productSchema, breadcrumbSchema } from '../../utils/schema';

export default function ProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const product = getProductBySlug(slug, lang);

  if (!product) return <NotFound />;

  const name = product.name?.[lang] || product.name?.es;
  const desc = product.description?.[lang] || product.shortDescription?.[lang];
  const alt = product.imageAlt?.[lang] || name;
  const categoryLabel = getCategoryLabel(product.category, lang);
  const seo = product.seo?.[lang] || product.seo?.es || {};

  // Slugs ES y EN para hreflang correcto
  const slugEs = product.slug?.es || product.id;
  const slugEn = product.slug?.en || product.id;
  const alternates = {
    es: `/productos/${slugEs}`,
    en: `/en/products/${slugEn}`,
  };

  const homeHref = isEn ? '/en' : '/';
  const productsHref = isEn ? '/en/products' : '/productos';
  const quoteHref = isEn ? '/en/quote' : '/presupuesto';

  const breadcrumb = [
    { name: t('nav.home'), path: homeHref },
    { name: t('nav.products'), path: productsHref },
    { name: name, path: isEn ? `/en/products/${slugEn}` : `/productos/${slugEs}` },
  ];

  const related = getRelatedProducts(product, lang, 3);

  const highlights = product.highlights?.[lang] || product.highlights?.es || [];
  const specs = Array.isArray(product.specs) ? product.specs : [];

  return (
    <>
      <PageSeo
        title={seo.title || `${name} | Toromac`}
        description={seo.description || desc}
        type="website"
        image={product.image}
        alternates={alternates}
        schema={[productSchema(product, lang), breadcrumbSchema(breadcrumb)]}
      />

      {/* Top: breadcrumb + back link */}
      <div className="border-b border-toro-black/[0.06] bg-toro-gray-cold/40">
        <Container className="py-5 flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={breadcrumb} />
          <Link
            to={productsHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-toro-gray-mid hover:text-toro-black transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t('product.backToCatalog')}
          </Link>
        </Container>
      </div>

      {/* Hero del producto: imagen grande + ficha tecnica */}
      <section className="bg-white">
        <Container className="py-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative">
                <span aria-hidden className="absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-toro-blue hidden lg:block" />
                <span aria-hidden className="absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-toro-blue hidden lg:block" />
                <span aria-hidden className="absolute -left-3 -bottom-3 h-6 w-6 border-l-2 border-b-2 border-toro-blue hidden lg:block" />
                <span aria-hidden className="absolute -right-3 -bottom-3 h-6 w-6 border-r-2 border-b-2 border-toro-blue hidden lg:block" />
                {product.image ? (
                  <img
                    src={product.image}
                    alt={alt}
                    width="1200"
                    height="900"
                    loading="eager"
                    fetchpriority="high"
                    className="aspect-[4/3] w-full object-cover bg-toro-gray-cold"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-toro-gray-cold grid place-items-center text-toro-gray-mid">
                    <span className="font-mono text-xs uppercase tracking-widest">Toromac</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue">
                  {categoryLabel}
                </span>
                <span aria-hidden className="h-px flex-1 bg-toro-black/10" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-gray-mid">{product.id}</span>
              </div>
              <h1 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
                {name}
              </h1>
              <p className="text-toro-gray-mid leading-relaxed text-pretty text-lg">{desc}</p>

              {highlights.length > 0 && (
                <ul className="space-y-2.5 pt-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-toro-blue/10 text-toro-blue">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-toro-black/85">{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-3 pt-4">
                <Button to={quoteHref} variant="primary" size="lg" withArrow>
                  {t('cta.quote')}
                </Button>
                <Button to={isEn ? '/en/contact' : '/contacto'} variant="secondary" size="lg">
                  {t('cta.contact')}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Specs técnicos */}
      {specs.length > 0 && (
        <section className="bg-toro-gray-cold border-y border-toro-black/[0.06]">
          <Container className="py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end mb-10">
              <div className="lg:col-span-7 space-y-4">
                <Eyebrow className="text-toro-blue">{t('product.specsLabel')}</Eyebrow>
                <h2 className="font-display text-2xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
                  {t('product.specsHeadline')}
                </h2>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-toro-black/10 bg-white">
              <dl className="divide-y divide-toro-black/[0.06]">
                {specs.map((s, i) => {
                  const label = resolveSpecValue(s.label, lang);
                  const value = resolveSpecValue(s.value, lang);
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-2 sm:gap-6 px-6 py-4"
                    >
                      <dt className="text-sm text-toro-gray-mid font-medium">{label}</dt>
                      <dd className="font-mono text-sm text-toro-black tabular-nums">{value}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </Container>
        </section>
      )}

      {/* CTA contextual */}
      <section className="bg-blueprint text-white">
        <Container className="py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-4 max-w-2xl">
              <Eyebrow className="text-toro-blue-light">{t('product.ctaEyebrow')}</Eyebrow>
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
                {t('product.ctaHeadline', { product: name })}
              </h2>
              <p className="text-white/65 leading-relaxed text-pretty">
                {t('product.ctaLead')}
              </p>
            </div>
            <Button to={quoteHref} variant="primary" size="lg" withArrow>
              {t('cta.quote')}
            </Button>
          </div>
        </Container>
      </section>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section className="bg-white">
          <Container className="py-16 lg:py-20">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div className="space-y-3">
                <Eyebrow className="text-toro-blue">{t('product.relatedEyebrow')}</Eyebrow>
                <h2 className="font-display text-2xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
                  {t('product.relatedHeadline')}
                </h2>
              </div>
              <Link
                to={productsHref}
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-toro-blue hover:gap-3 transition-all"
              >
                {t('catalog.viewAll')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  categoryLabel={getCategoryLabel(p.category, lang)}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
