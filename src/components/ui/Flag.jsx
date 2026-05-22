import { useId } from 'react';

/**
 * Banderas SVG en miniatura. Se usan en el selector de idioma en lugar de
 * emoji de bandera (en Windows el emoji se renderiza como las letras "ES"/"GB"
 * porque el sistema no tiene glifo, rompiendo el diseño).
 */

const baseCls = 'inline-block rounded-[2px] ring-1 ring-black/10 shrink-0';

function FlagES({ className = 'h-3.5 w-5' }) {
  return (
    <svg
      viewBox="0 0 3 2"
      className={`${baseCls} ${className}`}
      role="img"
      aria-label="España"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="3" height="2" fill="#c60b1e" />
      <rect width="3" height="1" y="0.5" fill="#ffc400" />
    </svg>
  );
}

function FlagGB({ className = 'h-3.5 w-5' }) {
  const rawId = useId();
  const clip = `gb-${rawId.replace(/:/g, '')}`;
  return (
    <svg
      viewBox="0 0 60 30"
      className={`${baseCls} ${className}`}
      role="img"
      aria-label="United Kingdom"
      preserveAspectRatio="xMidYMid slice"
    >
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clip})`}
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export default function Flag({ code, className }) {
  return code === 'en' ? <FlagGB className={className} /> : <FlagES className={className} />;
}
