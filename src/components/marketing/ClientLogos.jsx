/**
 * Wall de logos de clientes. Cada logo es PNG con fondo transparente.
 * En grayscale por defecto, color en hover, para coherencia visual cross-marca.
 */
const CLIENTS = [
  { slug: 'gallo',         name: 'Pastas Gallo' },
  { slug: 'bfr-latinpack', name: 'BFR Groupe / Latinpack' },
  { slug: 'grefusa',       name: 'Grefusa' },
  { slug: 'radar-process', name: 'Radar Process' },
  { slug: 'oromas',        name: 'Oromas' },
  { slug: 'rovema',        name: 'Rovema' },
  { slug: 'ulma',          name: 'ULMA' },
  { slug: 'realplast',     name: 'Realplast' },
  { slug: 'chupa-chups',   name: 'Chupa Chups' },
  { slug: 'mipcre',        name: 'Mipcre' },
];

export default function ClientLogos({ tone = 'light' }) {
  const isDark = tone === 'dark';
  return (
    <ul
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-8 items-center ${
        isDark ? 'opacity-90' : ''
      }`}
    >
      {CLIENTS.map(({ slug, name }) => (
        <li key={slug} className="flex items-center justify-center h-16 sm:h-20">
          <img
            src={`/images/clients/${slug}.png`}
            alt={name}
            width="160"
            height="80"
            loading="lazy"
            className={`max-h-full max-w-[140px] object-contain transition-all duration-300 ease-out-soft ${
              isDark
                ? 'brightness-0 invert opacity-60 hover:opacity-100'
                : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
            }`}
          />
        </li>
      ))}
    </ul>
  );
}
