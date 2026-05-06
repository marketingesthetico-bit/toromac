import { useTranslation } from 'react-i18next';

/**
 * Tira horizontal de 4 stats con numeros grandes en font-display y labels mono.
 * Para uso dentro del hero (sobre fondo oscuro) o como section standalone.
 */
export default function Stats({ tone = 'dark' }) {
  const { t } = useTranslation();
  const items = t('home.stats.items', { returnObjects: true });
  const isDark = tone === 'dark';

  return (
    <ul
      className={`grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x ${
        isDark ? 'divide-white/10' : 'divide-toro-black/10'
      }`}
    >
      {Array.isArray(items) &&
        items.map((s, i) => (
          <li
            key={i}
            className={`flex flex-col gap-2 p-6 lg:p-8 ${
              i % 2 === 1 ? 'border-l lg:border-l-0' : ''
            } ${isDark ? 'border-white/10' : 'border-toro-black/10'}`}
          >
            <span
              className={`stat-number text-4xl lg:text-5xl ${
                isDark ? 'text-white' : 'text-toro-black'
              }`}
            >
              {s.value}
            </span>
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.18em] leading-snug ${
                isDark ? 'text-white/55' : 'text-toro-gray-mid'
              }`}
            >
              {s.label}
            </span>
          </li>
        ))}
    </ul>
  );
}
