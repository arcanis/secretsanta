import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './en';
import { fr } from './fr';

export type Translations = typeof en;

const resources = {
  en: { translation: en },
  fr: { translation: fr }
} satisfies Record<string, { translation: Translations }>;

export const SUPPORTED_LANGUAGES = Object.keys(resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
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