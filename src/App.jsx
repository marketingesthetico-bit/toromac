import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Layout from './components/layout/Layout';
import PageStub from './pages/PageStub';
import NotFound from './pages/NotFound';
import DesignSystem from './pages/DesignSystem';

import HomeEs from './pages/es/Home';
import CompaniaEs from './pages/es/Compania';
import ProductosEs from './pages/es/Productos';
import ProductoDetalleEs from './pages/es/ProductoDetalle';
import ContactoEs from './pages/es/Contacto';
import PresupuestoEs from './pages/es/Presupuesto';

import HomeEn from './pages/en/Home';
import CompanyEn from './pages/en/Company';
import ProductsEn from './pages/en/Products';
import ProductDetailEn from './pages/en/ProductDetail';
import ContactEn from './pages/en/Contact';
import QuoteEn from './pages/en/Quote';

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

// Stubs aun-no-implementados (Fase 6: blog).
const ES_STUBS = [{ path: '/novedades', titleKey: 'nav.news' }];
const EN_STUBS = [{ path: '/en/news', titleKey: 'nav.news' }];

const isDev = import.meta.env.DEV;

export default function App() {
  return (
    <>
      <LangSync />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* ES */}
          <Route path="/" element={<HomeEs />} />
          <Route path="/compania" element={<CompaniaEs />} />
          <Route path="/productos" element={<ProductosEs />} />
          <Route path="/productos/:slug" element={<ProductoDetalleEs />} />
          <Route path="/contacto" element={<ContactoEs />} />
          <Route path="/presupuesto" element={<PresupuestoEs />} />

          {/* EN */}
          <Route path="/en" element={<HomeEn />} />
          <Route path="/en/company" element={<CompanyEn />} />
          <Route path="/en/products" element={<ProductsEn />} />
          <Route path="/en/products/:slug" element={<ProductDetailEn />} />
          <Route path="/en/contact" element={<ContactEn />} />
          <Route path="/en/quote" element={<QuoteEn />} />

          {/* Stubs Fase 6 */}
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
