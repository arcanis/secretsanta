import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { pt } from './pt';

export type Translations = typeof en;

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  pt: { translation: pt },
} satisfies Record<string, { translation: Translations }>;

export const SUPPORTED_LANGUAGES = Object.keys(resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    detection: {
      lookupQuerystring: 'lang'
    },
    interpolation: {
      escapeValue: false
    }
  });

// Type augmentation for useTranslation hook
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en'];
  }
}

export default i18n; 