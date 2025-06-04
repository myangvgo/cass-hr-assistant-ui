import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en/translation.json'
import zh from './locales/zh/translation.json'
import de from './locales/de/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      de: { translation: de },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
