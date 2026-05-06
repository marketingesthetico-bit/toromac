import { ArrowUpRight } from 'lucide-react';

export default function SectorCard({ icon: Icon, title, items = [], accent = false }) {
  return (
    <article
      className={`group relative flex h-full flex-col gap-4 rounded-xl border p-6 transition-all duration-300 ease-out-soft ${
        accent
          ? 'bg-toro-black border-toro-black text-white hover:bg-toro-blue-dark'
          : 'bg-white border-toro-black/10 text-toro-black hover:border-toro-blue hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <div
            className={`grid h-12 w-12 place-items-center rounded-lg ${
              accent ? 'bg-white/10 text-white' : 'bg-toro-blue/10 text-toro-blue'
            }`}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </div>
        )}
        <ArrowUpRight
          className={`h-5 w-5 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
            accent ? 'text-white/70' : 'text-toro-gray-mid'
          }`}
          aria-hidden
        />
      </div>
      <h3 className="font-heading text-xl font-bold leading-tight">{title}</h3>
      {items.length > 0 && (
        <ul
          className={`mt-auto space-y-1.5 text-sm leading-relaxed ${
            accent ? 'text-white/80' : 'text-toro-gray-mid'
          }`}
        >
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                  accent ? 'bg-white/60' : 'bg-toro-blue'
                }`}
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
