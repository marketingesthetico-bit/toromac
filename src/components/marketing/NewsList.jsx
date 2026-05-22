import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ArticleCard from '../ui/ArticleCard';
import { useLang } from '../../hooks/useLang';
import {
  getAllArticles,
  getArticleCategories,
  getCategoryLabel,
} from '../../hooks/useArticles';

const PER_PAGE = 9;

export default function NewsList() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('category') || '';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const all = useMemo(() => getAllArticles(), []);
  const categories = useMemo(() => getArticleCategories(), []);
  const filtered = useMemo(
    () => (activeCat ? all.filter((a) => a.category === activeCat) : all),
    [all, activeCat]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function setCategory(cat) {
    if (!cat) params.delete('category');
    else params.set('category', cat);
    params.delete('page');
    setParams(params, { replace: false });
  }

  function goToPage(p) {
    if (p <= 1) params.delete('page');
    else params.set('page', String(p));
    setParams(params, { replace: false });
  }

  return (
    <section className="bg-white">
      <Container className="py-16 lg:py-20">
        <div className="flex items-baseline justify-between mb-3">
          <Eyebrow className="text-toro-blue">{t('news.eyebrow')}</Eyebrow>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-gray-mid">
            {filtered.length}
          </span>
        </div>
        <h1 className="font-display text-4xl lg:text-6xl font-extrabold leading-[1.02] text-balance max-w-3xl mb-8">
          {t('news.headline')}
        </h1>
        <p className="text-toro-gray-mid max-w-2xl leading-relaxed mb-10 text-pretty">
          {t('news.lead')}
        </p>

        {/* Filtros por categoria */}
        {categories.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-12 -mx-1 px-1 overflow-x-auto"
            role="tablist"
            aria-label={t('news.filterLabel')}
          >
            <FilterChip active={!activeCat} onClick={() => setCategory('')}>
              {t('news.allCategories')}
            </FilterChip>
            {categories.map((id) => (
              <FilterChip key={id} active={activeCat === id} onClick={() => setCategory(id)}>
                {getCategoryLabel(id, lang)}
              </FilterChip>
            ))}
          </div>
        )}

        {pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-toro-black/15 p-12 text-center">
            <p className="text-toro-gray-mid">{t('news.empty')}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((a) => (
              <ArticleCard
                key={a.id}
                article={a}
                lang={lang}
                categoryLabel={getCategoryLabel(a.category, lang)}
              />
            ))}
          </div>
        )}

        {/* Paginacion */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === safePage ? 'page' : undefined}
                className={`h-9 min-w-9 rounded-md px-3 text-sm font-medium transition-colors ${
                  p === safePage
                    ? 'bg-toro-black text-white'
                    : 'bg-toro-gray-cold text-toro-black hover:bg-toro-black/5'
                }`}
              >
                {p}
              </button>
            ))}
          </nav>
        )}
      </Container>
    </section>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-toro-black text-white' : 'bg-toro-gray-cold text-toro-black hover:bg-toro-black/5'
      }`}
    >
      {children}
    </button>
  );
}
