import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Layout from './components/layout/Layout';
import PageStub from './pages/PageStub';
import NotFound from './pages/NotFound';
import DesignSystem from './pages/DesignSystem';
import HomeEs from './pages/es/Home';
import CompaniaEs from './pages/es/Compania';
import HomeEn from './pages/en/Home';
import CompanyEn from './pages/en/Company';
import { detectLang } from './utils/seo';

function LangSync() {
  const location = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = detectLang(location.pathname);
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [location.pathname, i18n]);
  return null;
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  return null;
}

// Stubs aun-no-implementados (Fases 4-6).
const ES_STUBS = [
  { path: '/productos', titleKey: 'nav.products' },
  { path: '/novedades', titleKey: 'nav.news' },
  { path: '/contacto', titleKey: 'nav.contact' },
  { path: '/presupuesto', titleKey: 'nav.quote' },
];

const EN_STUBS = [
  { path: '/en/products', titleKey: 'nav.products' },
  { path: '/en/news', titleKey: 'nav.news' },
  { path: '/en/contact', titleKey: 'nav.contact' },
  { path: '/en/quote', titleKey: 'nav.quote' },
];

const isDev = import.meta.env.DEV;

export default function App() {
  return (
    <>
      <LangSync />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* Paginas reales (Fase 3) */}
          <Route path="/" element={<HomeEs />} />
          <Route path="/compania" element={<CompaniaEs />} />
          <Route path="/en" element={<HomeEn />} />
          <Route path="/en/company" element={<CompanyEn />} />

          {/* Stubs hasta Fases 4-6 */}
          {ES_STUBS.map(({ path, titleKey }) => (
            <Route key={path} path={path} element={<PageStub titleKey={titleKey} lang="es" />} />
          ))}
          {EN_STUBS.map(({ path, titleKey }) => (
            <Route key={path} path={path} element={<PageStub titleKey={titleKey} lang="en" />} />
          ))}

          {isDev && <Route path="/_design-system" element={<DesignSystem />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
