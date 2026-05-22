import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ArticleCard from '../ui/ArticleCard';
import { useLang } from '../../hooks/useLang';
import { getLatestArticles, getCategoryLabel } from '../../hooks/useArticles';

export default function LatestArticlesPreview() {
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const newsHref = isEn ? '/en/news' : '/novedades';
  const articles = getLatestArticles(3);

  if (articles.length === 0) return null;

  return (
    <section className="bg-white">
      <Container className="py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="space-y-5 max-w-2xl">
            <Eyebrow className="text-toro-blue">{t('home.news.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('home.news.headline')}
            </h2>
            <p className="text-toro-gray-mid leading-relaxed text-pretty">
              {t('home.news.lead')}
            </p>
          </div>
          <Link
            to={newsHref}
            className="inline-flex items-center gap-2 self-start lg:self-end text-sm font-medium text-toro-blue hover:gap-3 transition-all"
          >
            {t('home.news.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
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
  );
}
