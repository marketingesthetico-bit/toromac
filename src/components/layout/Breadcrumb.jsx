import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { breadcrumbSchema } from '../../utils/schema';

/**
 * `items`: array de { name, path }. El ultimo item se renderiza como activo
 * (sin link) y se incluye igualmente en el schema BreadcrumbList.
 */
export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null;
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema(items))}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-toro-gray-mid">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={`${item.path}-${idx}`} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-toro-black/30" aria-hidden />}
                {isLast ? (
                  <span aria-current="page" className="text-toro-black font-medium">
                    {item.name}
                  </span>
                ) : (
                  <Link to={item.path} className="hover:text-toro-black transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
