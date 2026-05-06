/**
 * Etiqueta de seccion estilo datasheet: numero / texto + linea decorativa.
 * Color heredado de la clase contenedora (text-toro-blue, text-white/60, etc).
 */
export default function Eyebrow({ children, withRule = true, className = '' }) {
  return (
    <div className={`eyebrow ${className}`}>
      <span className="font-semibold">{children}</span>
      {withRule && <span aria-hidden className="eyebrow-rule" />}
    </div>
  );
}
