import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Badge from './Badge';

/**
 * Tarjeta de producto. Recibe `product` con la estructura de CLAUDE.md §7
 * y `lang` para resolver slug/nombre/descripcion del idioma actual.
 */
export default function ProductCard({ product, lang = 'es', categoryLabel }) {
  const slug = product.slug?.[lang] || product.id;
  const href = lang === 'en' ? `/en/products/${slug}` : `/productos/${slug}`;
  const name = product.name?.[lang] || product.name?.es;
  const desc = product.shortDescription?.[lang] || product.shortDescription?.es;
  const alt = product.imageAlt?.[lang] || product.imageAlt?.es || name;

  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-toro-black/10 bg-white transition-all duration-300 ease-out-soft hover:border-toro-black/20 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-toro-blue/40"
    >
      <div className="relative overflow-hidden bg-toro-gray-cold aspect-[4/3]">
        {product.image ? (
          <img
            src={product.image}
            alt={alt}
            loading="lazy"
            width="800"
            height="600"
            className="h-full w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-toro-gray-mid">
            <span className="text-xs uppercase tracking-widest">Toromac</span>
          </div>
        )}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-toro-blue scale-y-0 origin-bottom transition-transform duration-300 ease-out-soft group-hover:scale-y-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {categoryLabel && <Badge variant="outline">{categoryLabel}</Badge>}
        <h3 className="font-heading text-lg font-bold text-toro-black leading-snug">{name}</h3>
        {desc && <p className="text-sm text-toro-gray-mid leading-relaxed line-clamp-3">{desc}</p>}
        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-toro-blue group-hover:gap-2 transition-all">
          {lang === 'en' ? 'View product' : 'Ver producto'}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
