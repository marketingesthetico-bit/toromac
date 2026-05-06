import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLang, useAlternatePath } from '../../hooks/useLang';

const LANGS = [
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
];

/**
 * Selector de idioma. Al elegir el otro idioma navega a la URL equivalente
 * (no a home), lo que es importante para SEO y UX.
 */
export default function LangSwitcher({ tone = 'light', overrides }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { lang } = useLang();
  const { t } = useTranslation();
  const otherPath = useAlternatePath(overrides);
  const otherLang = lang === 'es' ? 'en' : 'es';
  const current = LANGS.find((l) => l.code === lang);
  const other = LANGS.find((l) => l.code === otherLang);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const isDark = tone === 'dark';
  const triggerCls = isDark
    ? 'text-white/90 hover:text-white border-white/20 hover:border-white/40'
    : 'text-toro-black/80 hover:text-toro-black border-toro-black/15 hover:border-toro-black/30';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('lang.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${triggerCls}`}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span aria-hidden>{current?.flag}</span>
        <span>{current?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t('lang.label')}
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-toro-black/10 bg-white shadow-lg"
        >
          <li role="option" aria-selected="true" className="px-3 py-2 text-sm bg-toro-gray-cold text-toro-black flex items-center gap-2">
            <span aria-hidden>{current?.flag}</span>
            <span>{t(`lang.${lang}`)}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-toro-gray-mid">{t('lang.current')}</span>
          </li>
          <li role="option" aria-selected="false">
            <Link
              to={otherPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-toro-black hover:bg-toro-gray-cold"
            >
              <span aria-hidden>{other?.flag}</span>
              <span>{t(`lang.${otherLang}`)}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-toro-gray-mid">{other?.label}</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
