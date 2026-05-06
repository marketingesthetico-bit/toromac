import { Link } from 'react-router-dom';
import { detectLangFromPath } from '../i18n';

export default function NotFound() {
  const isEn = typeof window !== 'undefined' && detectLangFromPath(window.location.pathname) === 'en';
  const home = isEn ? '/en/' : '/';
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-widest text-toro-gray-mid mb-3">404</p>
      <h1 className="font-heading text-3xl md:text-5xl font-bold text-toro-black">
        {isEn ? 'Page not found' : 'Página no encontrada'}
      </h1>
      <Link
        to={home}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-toro-blue px-6 py-3 text-white font-medium hover:bg-toro-blue-light transition"
      >
        {isEn ? 'Back to home' : 'Volver al inicio'}
      </Link>
    </main>
  );
}
