import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../hooks/useLang';
import Button from '../ui/Button';
import Container from '../ui/Container';
import LangSwitcher from './LangSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const { isEn, home } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV = isEn
    ? [
        { to: '/en/products', label: t('nav.products') },
        { to: '/en/company', label: t('nav.company') },
        { to: '/en/news', label: t('nav.news') },
        { to: '/en/contact', label: t('nav.contact') },
      ]
    : [
        { to: '/productos', label: t('nav.products') },
        { to: '/compania', label: t('nav.company') },
        { to: '/novedades', label: t('nav.news') },
        { to: '/contacto', label: t('nav.contact') },
      ];

  const quoteHref = isEn ? '/en/quote' : '/presupuesto';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar menu mobile al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const linkBase = 'text-sm font-medium transition-colors';
  const linkInactive = 'text-toro-black/70 hover:text-toro-black';
  const linkActive = 'text-toro-blue';

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/90 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-sm border-b border-toro-black/5' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-toro-black focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        {t('common.skipToContent')}
      </a>
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to={home} className="flex items-center gap-3" aria-label={t('site.name')}>
          <img
            src="/images/brand/logo-toromac.svg"
            alt="Toromac"
            width="160"
            height="24"
            className="h-7 w-auto lg:h-8"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LangSwitcher />
          <Button to={quoteHref} variant="primary" size="sm">
            {t('cta.quote')}
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-toro-black hover:bg-toro-gray-cold"
          aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="lg:hidden border-t border-toro-black/5 bg-white">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-base font-medium ${
                    isActive ? 'bg-toro-gray-cold text-toro-blue' : 'text-toro-black hover:bg-toro-gray-cold'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-toro-black/5 pt-3">
              <LangSwitcher />
              <Button to={quoteHref} variant="primary" size="sm" onClick={() => setMobileOpen(false)}>
                {t('cta.quote')}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
