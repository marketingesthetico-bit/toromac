import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Badge from './Badge';

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

export default function ArticleCard({ article, lang = 'es', categoryLabel }) {
  const slug = article.slug?.[lang] || article.id;
  const href = lang === 'en' ? `/en/news/${slug}` : `/novedades/${slug}`;
  const title = article.title?.[lang] || article.title?.es;
  const excerpt = article.metaDescription?.[lang] || article.metaDescription?.es;
  const alt = article.heroImageAlt?.[lang] || article.heroImageAlt?.es || title;

  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-toro-black/10 bg-white transition-all duration-300 ease-out-soft hover:border-toro-black/20 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-toro-blue/40"
    >
      <div className="relative overflow-hidden bg-toro-gray-cold aspect-[16/9]">
        {article.heroImage ? (
          <img
            src={article.heroImage}
            alt={alt}
            loading="lazy"
            width="800"
            height="450"
            className="h-full w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-toro-gray-mid">
            <span className="text-xs uppercase tracking-widest">Toromac · {lang.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3 text-xs text-toro-gray-mid">
          {categoryLabel && <Badge variant="blue">{categoryLabel}</Badge>}
          {article.publishedAt && <span>{formatDate(article.publishedAt, lang)}</span>}
        </div>
        <h3 className="font-heading text-lg font-bold text-toro-black leading-snug">{title}</h3>
        {excerpt && <p className="text-sm text-toro-gray-mid leading-relaxed line-clamp-3">{excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-toro-blue group-hover:gap-2 transition-all">
          {lang === 'en' ? 'Read article' : 'Leer artículo'}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
