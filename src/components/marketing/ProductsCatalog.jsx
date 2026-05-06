import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ProductCard from '../ui/ProductCard';
import { useLang } from '../../hooks/useLang';
import {
  CATEGORIES,
  getAllProducts,
  getCategoryLabel,
} from '../../hooks/useProducts';

export default function ProductsCatalog() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('category') || '';
  const all = useMemo(() => getAllProducts(), []);
  const filtered = useMemo(
    () => (activeCat ? all.filter((p) => p.category === activeCat) : all),
    [all, activeCat]
  );

  function setCategory(cat) {
    if (!cat) params.delete('category');
    else params.set('category', cat);
    setParams(params, { replace: false });
  }

  return (
    <section className="bg-white">
      <Container className="py-16 lg:py-20">
        <div className="flex items-baseline justify-between mb-3">
          <Eyebrow className="text-toro-blue">{t('catalog.eyebrow')}</Eyebrow>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-gray-mid">
            {filtered.length}/{all.length}
          </span>
        </div>
        <h1 className="font-display text-4xl lg:text-6xl font-extrabold leading-[1.02] text-balance max-w-3xl mb-8">
          {t('catalog.headline')}
        </h1>
        <p className="text-toro-gray-mid max-w-2xl leading-relaxed mb-10 text-pretty">
          {t('catalog.lead')}
        </p>

        {/* Filtros de categoría — chips */}
        <div className="flex flex-wrap gap-2 mb-12 -mx-1 px-1 overflow-x-auto" role="tablist" aria-label={t('catalog.filterLabel')}>
          <FilterChip
            active={!activeCat}
            onClick={() => setCategory('')}
          >
            {t('catalog.allCategories')}
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={activeCat === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.label[lang] || c.label.es}
            </FilterChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-toro-black/15 p-12 text-center">
            <p className="text-toro-gray-mid">{t('catalog.empty')}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                categoryLabel={getCategoryLabel(p.category, lang)}
              />
            ))}
          </div>
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
        active
          ? 'bg-toro-black text-white'
          : 'bg-toro-gray-cold text-toro-black hover:bg-toro-black/5'
      }`}
    >
      {children}
    </button>
  );
}
