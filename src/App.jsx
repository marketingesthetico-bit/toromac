import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import PageStub from './pages/PageStub';
import NotFound from './pages/NotFound';
import { detectLangFromPath } from './i18n';

function LangSync() {
  const location = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = detectLangFromPath(location.pathname);
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [location.pathname, i18n]);
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

export default function App() {
  return (
    <>
      <LangSync />
      <Routes>
        {ES_ROUTES.map(({ path, titleKey }) => (
          <Route key={path} path={path} element={<PageStub titleKey={titleKey} lang="es" />} />
        ))}
        {ES_ROUTES.filter((r) => r.path !== '/').map(({ path, titleKey }) => (
          <Route key={`${path}/`} path={`${path}/`} element={<Navigate to={path} replace />} />
        ))}
        {EN_ROUTES.map(({ path, titleKey }) => (
          <Route key={path} path={path} element={<PageStub titleKey={titleKey} lang="en" />} />
        ))}
        {EN_ROUTES.filter((r) => r.path !== '/en').map(({ path, titleKey }) => (
          <Route key={`${path}/`} path={`${path}/`} element={<Navigate to={path} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
