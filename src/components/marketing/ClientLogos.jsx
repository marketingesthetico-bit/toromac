/**
 * Wall de logos placeholder. Cuando lleguen los SVG/PNG reales,
 * se reemplaza el wordmark por un <img>. Mantenemos el contenedor
 * con la misma altura para evitar layout shift.
 */
const CLIENTS = [
  'Gallo',
  'BFR Groupe',
  'Grefusa',
  'Radar Process',
  'Oromas',
  'Rovema',
  'ULMA',
  'Realplast',
  'Chupa Chups',
  'MIPCRE',
];

export default function ClientLogos({ tone = 'light' }) {
  const isDark = tone === 'dark';
  return (
    <ul
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-8 items-center ${
        isDark ? 'text-white/45' : 'text-toro-gray-mid'
      }`}
    >
      {CLIENTS.map((name) => (
        <li
          key={name}
          className="flex h-14 items-center justify-center text-center"
        >
          <span className="font-display text-lg font-bold uppercase tracking-tight transition-colors hover:text-toro-black">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
