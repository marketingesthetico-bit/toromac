import { useLocation } from 'react-router-dom';
import { detectLang, getAlternatePath } from '../utils/seo';

export function useLang() {
  const { pathname } = useLocation();
  const lang = detectLang(pathname);
  const isEs = lang === 'es';
  const isEn = lang === 'en';
  const home = isEn ? '/en' : '/';
  return { lang, isEs, isEn, home, pathname };
}

export function useAlternatePath(overrides = {}) {
  const { pathname } = useLocation();
  return getAlternatePath(pathname, overrides);
}
