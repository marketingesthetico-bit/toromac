import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Layout from './components/layout/Layout';
import PageStub from './pages/PageStub';
import NotFound from './pages/NotFound';
import DesignSystem from './pages/DesignSystem';
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

const ES_ROUTES = [
  { path: '/', titleKey: 'nav.home' },
  { path: '/productos', titleKey: 'nav.products' },
  { path: '/compania', titleKey: 'nav.company' },
  { path: '/novedades', titleKey: 'nav.news' },
  { path: '/contacto', titleKey: 'nav.contact' },
  { path: '/presupuesto', titleKey: 'nav.quote' },
];

const EN_ROUTES = [
  { path: '/en', titleKey: 'nav.home' },
  { path: '/en/products', titleKey: 'nav.products' },
  { path: '/en/company', titleKey: 'nav.company' },
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
          {ES_ROUTES.map(({ path, titleKey }) => (
            <Route key={path} path={path} element={<PageStub titleKey={titleKey} lang="es" />} />
          ))}
          {ES_ROUTES.filter((r) => r.path !== '/').map(({ path }) => (
            <Route key={`${path}/`} path={`${path}/`} element={<Navigate to={path} replace />} />
          ))}
          {EN_ROUTES.map(({ path, titleKey }) => (
            <Route key={path} path={path} element={<PageStub titleKey={titleKey} lang="en" />} />
          ))}
          {EN_ROUTES.filter((r) => r.path !== '/en').map(({ path }) => (
            <Route key={`${path}/`} path={`${path}/`} element={<Navigate to={path} replace />} />
          ))}
          {isDev && <Route path="/_design-system" element={<DesignSystem />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
