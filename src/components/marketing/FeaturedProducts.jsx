import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ProductCard from '../ui/ProductCard';
import { useLang } from '../../hooks/useLang';
import { getFeaturedProducts, getCategoryLabel } from '../../hooks/useProducts';

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const productsHref = isEn ? '/en/products' : '/productos';
  const featured = getFeaturedProducts(6);

  return (
    <section className="bg-toro-gray-cold">
      <Container className="py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="space-y-5 max-w-2xl">
            <Eyebrow className="text-toro-blue">{t('home.products.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('home.products.headline')}
            </h2>
            <p className="text-toro-gray-mid leading-relaxed text-pretty">
              {t('home.products.lead')}
            </p>
          </div>
          <Link
            to={productsHref}
            className="inline-flex items-center gap-2 self-start lg:self-end text-sm font-medium text-toro-blue hover:gap-3 transition-all"
          >
            {t('home.products.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
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
  );
}
