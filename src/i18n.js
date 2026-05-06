import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import en from './locales/en.json';

export const SUPPORTED_LANGS = ['es', 'en'];
export const DEFAULT_LANG = 'es';

export function detectLangFromPath(pathname) {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return 'es';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'toromac-lang',
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

export default i18n;
