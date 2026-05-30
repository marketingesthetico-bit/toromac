// GA4 — inyeccion condicional. Solo carga el script de gtag si hay
// VITE_GA_ID configurado (formato `G-XXXXXXXX`). Esto evita peticiones de
// red innecesarias en entorno local o en builds sin analytics.

const GA_ID = import.meta.env.VITE_GA_ID;

export function initAnalytics() {
  if (!GA_ID || !GA_ID.startsWith('G-')) return;
  if (typeof window === 'undefined') return;
  if (window.__gaInited) return;
  window.__gaInited = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: false, // Lo dispara trackPageview() en cada cambio de ruta.
  });
}

// Llamar en cada cambio de ruta del SPA.
export function trackPageview(path) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
