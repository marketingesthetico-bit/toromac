import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Eyebrow from './Eyebrow';
import Breadcrumb from '../layout/Breadcrumb';
import ArticleCard from '../ui/ArticleCard';
import ArticleBlocks, { buildToc } from './ArticleBlocks';
import PageSeo from '../seo/PageSeo';
import NotFound from '../../pages/NotFound';
import { useLang } from '../../hooks/useLang';
import { useSetAlternates } from '../../hooks/useAlternates';
import {
  getArticleBySlug,
  getRelatedArticles,
  getCategoryLabel,
  getReadingMinutes,
} from '../../hooks/useArticles';
import { getProductById } from '../../hooks/useProducts';
import { articleSchema, faqPageSchema, breadcrumbSchema } from '../../utils/schema';

function formatDate(iso, lang = 'es') {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const article = getArticleBySlug(slug, lang);

  // Publica las rutas alternas para el selector de idioma (Rules of Hooks:
  // se llama siempre, con null cuando no hay articulo).
  useSetAlternates(
    article
      ? {
          es: `/novedades/${article.slug?.es || article.id}`,
          en: `/en/news/${article.slug?.en || article.id}`,
        }
      : null
  );

  if (!article) return <NotFound />;

  const title = article.title?.[lang] || article.title?.es;
  const lead = article.metaDescription?.[lang] || article.metaDescription?.es;
  const heroAlt = article.heroImageAlt?.[lang] || article.heroImageAlt?.es || title;
  const blocks = article.content?.[lang] || article.content?.es || [];
  const faqs = Array.isArray(article.faq) ? article.faq : [];
  const toc = buildToc(blocks);
  const categoryLabel = getCategoryLabel(article.category, lang);
  const minutes = getReadingMinutes(article, lang);

  const slugEs = article.slug?.es || article.id;
  const slugEn = article.slug?.en || article.id;
  const alternates = {
    es: `/novedades/${slugEs}`,
    en: `/en/news/${slugEn}`,
  };

  const homeHref = isEn ? '/en' : '/';
  const newsHref = isEn ? '/en/news' : '/novedades';
  const selfHref = isEn ? `/en/news/${slugEn}` : `/novedades/${slugEs}`;

  const breadcrumb = [
    { name: t('nav.home'), path: homeHref },
    { name: t('nav.news'), path: newsHref },
    { name: title, path: selfHref },
  ];

  const related = getRelatedArticles(article, lang, 3);
  const relatedProduct = article.relatedProduct ? getProductById(article.relatedProduct) : null;

  const schemas = [articleSchema(article, lang), breadcrumbSchema(breadcrumb)];
  if (faqs.length > 0) schemas.push(faqPageSchema(faqs, lang));

  let productHref = null;
  let productName = null;
  if (relatedProduct) {
    const pSlug = relatedProduct.slug?.[lang] || relatedProduct.id;
    productHref = isEn ? `/en/products/${pSlug}` : `/productos/${pSlug}`;
    productName = relatedProduct.name?.[lang] || relatedProduct.name?.es;
  }

  const seo = article.seo?.[lang] || {};

  return (
    <>
      <PageSeo
        title={seo.title || `${title} | Toromac`}
        description={seo.description || lead}
        type="article"
        image={article.heroImage}
        alternates={alternates}
        schema={schemas}
      />

      {/* Breadcrumb + volver */}
      <div className="border-b border-toro-black/[0.06] bg-toro-gray-cold/40">
        <Container className="py-5 flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={breadcrumb} />
          <Link
            to={newsHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-toro-gray-mid hover:text-toro-black transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t('article.backToNews')}
          </Link>
        </Container>
      </div>

      {/* Cabecera del articulo */}
      <section className="bg-white">
        <Container className="pt-12 lg:pt-16 pb-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-toro-gray-mid mb-5">
              <span className="font-mono uppercase tracking-[0.18em] text-toro-blue">{categoryLabel}</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                {formatDate(article.publishedAt, lang)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {t('article.readingTime', { minutes })}
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance mb-5">
              {title}
            </h1>
            <p className="text-lg text-toro-gray-mid leading-relaxed text-pretty">{lead}</p>
          </div>
        </Container>

        {/* Imagen hero */}
        {article.heroImage && (
          <Container className="pb-4">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={article.heroImage}
                alt={heroAlt}
                width="1200"
                height="675"
                loading="eager"
                fetchpriority="high"
                className="aspect-[16/9] w-full object-cover bg-toro-gray-cold"
              />
            </div>
          </Container>
        )}
      </section>

      {/* Contenido + TOC */}
      <section className="bg-white">
        <Container className="py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* TOC sidebar */}
            {toc.length > 1 && (
              <aside className="lg:col-span-4 order-first lg:order-last">
                <div className="lg:sticky lg:top-24">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-gray-mid mb-4">
                    {t('article.tocLabel')}
                  </p>
                  <nav aria-label={t('article.tocLabel')}>
                    <ol className="space-y-2.5 border-l border-toro-black/10">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="block -ml-px border-l-2 border-transparent pl-4 text-sm text-toro-gray-mid hover:border-toro-blue hover:text-toro-black transition-colors"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              </aside>
            )}

            {/* Cuerpo */}
            <div className={toc.length > 1 ? 'lg:col-span-8' : 'lg:col-span-9'}>
              <ArticleBlocks blocks={blocks} />

              {/* CTA inline al producto relacionado */}
              {relatedProduct && (
                <div className="mt-12 rounded-xl border border-toro-black/10 bg-toro-gray-cold/50 p-6 lg:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue mb-2">
                    {t('article.relatedProductLabel')}
                  </p>
                  <h2 className="font-display text-xl lg:text-2xl font-bold leading-tight mb-3">
                    {productName}
                  </h2>
                  <p className="text-toro-gray-mid leading-relaxed text-pretty mb-5">
                    {relatedProduct.shortDescription?.[lang] || relatedProduct.shortDescription?.es}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button to={productHref} variant="primary" withArrow>
                      {t('cta.viewProduct')}
                    </Button>
                    <Button to={isEn ? '/en/quote' : '/presupuesto'} variant="secondary">
                      {t('cta.quote')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-toro-gray-cold border-y border-toro-black/[0.06]">
          <Container className="py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 space-y-4">
                <Eyebrow className="text-toro-blue">{t('article.faqLabel')}</Eyebrow>
                <h2 className="font-display text-2xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
                  {t('article.faqHeadline')}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <ul className="space-y-px">
                  {faqs.map((f, i) => {
                    const q = f.question?.[lang] || f.question?.es;
                    const a = f.answer?.[lang] || f.answer?.es;
                    return (
                      <li key={i} className="border-b border-toro-black/10 last:border-b-0 group">
                        <details className="py-5 lg:py-6">
                          <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                            <h3 className="font-display text-lg lg:text-xl font-bold text-toro-black leading-snug pr-2">
                              {q}
                            </h3>
                            <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-toro-black/15 text-toro-blue text-lg leading-none transition-transform group-open:rotate-45">
                              +
                            </span>
                          </summary>
                          <p className="pt-3 text-toro-gray-mid leading-relaxed text-pretty pr-10">{a}</p>
                        </details>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* CTA presupuesto */}
      <section className="bg-blueprint text-white">
        <Container className="py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-4 max-w-2xl">
              <Eyebrow className="text-toro-blue-light">{t('article.ctaEyebrow')}</Eyebrow>
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
                {t('article.ctaHeadline')}
              </h2>
              <p className="text-white/65 leading-relaxed text-pretty">{t('article.ctaLead')}</p>
            </div>
            <Button to={isEn ? '/en/quote' : '/presupuesto'} variant="primary" size="lg" withArrow>
              {t('cta.quote')}
            </Button>
          </div>
        </Container>
      </section>

      {/* Articulos relacionados */}
      {related.length > 0 && (
        <section className="bg-white">
          <Container className="py-16 lg:py-20">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div className="space-y-3">
                <Eyebrow className="text-toro-blue">{t('article.relatedEyebrow')}</Eyebrow>
                <h2 className="font-display text-2xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
                  {t('article.relatedHeadline')}
                </h2>
              </div>
              <Link
                to={newsHref}
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-toro-blue hover:gap-3 transition-all"
              >
                {t('article.viewAll')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard
                  key={a.id}
                  article={a}
                  lang={lang}
                  categoryLabel={getCategoryLabel(a.category, lang)}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
