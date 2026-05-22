// Renderer de los bloques tipados de contenido de un articulo.
// Tipos soportados: h2, h3, p, ul, ol, table, callout, quote.

export function slugifyHeading(text = '') {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

// Devuelve la tabla de contenidos (solo H2) a partir de los bloques.
export function buildToc(blocks = []) {
  return blocks
    .filter((b) => b.type === 'h2')
    .map((b) => ({ id: b.id || slugifyHeading(b.text), text: b.text }));
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          id={block.id || slugifyHeading(block.text)}
          className="font-display text-2xl lg:text-3xl font-extrabold leading-tight text-toro-black mt-12 mb-4 scroll-mt-28 text-balance"
        >
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="font-display text-xl font-bold leading-snug text-toro-black mt-8 mb-3">
          {block.text}
        </h3>
      );
    case 'p':
      return <p className="text-toro-black/85 leading-relaxed text-pretty mb-5">{block.text}</p>;
    case 'ul':
      return (
        <ul className="mb-6 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-toro-black/85 leading-relaxed">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-toro-blue" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-6 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-toro-black/85 leading-relaxed">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-toro-blue/10 text-toro-blue font-mono text-xs font-bold">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div className="mb-8 overflow-x-auto rounded-xl border border-toro-black/10">
          <table className="w-full border-collapse text-sm">
            {block.headers && (
              <thead>
                <tr className="bg-toro-gray-cold">
                  {block.headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-display font-bold text-toro-black border-b border-toro-black/10"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="even:bg-toro-gray-cold/40">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 align-top border-b border-toro-black/[0.06] last:border-b-0 ${
                        ci === 0 ? 'font-medium text-toro-black' : 'text-toro-black/80'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <aside className="mb-8 rounded-xl border-l-[3px] border-toro-blue bg-toro-blue/[0.04] px-5 py-4">
          <p className="text-toro-black/85 leading-relaxed text-pretty">{block.text}</p>
        </aside>
      );
    case 'quote':
      return (
        <blockquote className="mb-8 border-l-2 border-toro-black/20 pl-5 italic text-toro-black/70 leading-relaxed">
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default function ArticleBlocks({ blocks = [] }) {
  return (
    <div className="max-w-none">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
