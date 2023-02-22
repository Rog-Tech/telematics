import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector  from 'i18next-browser-languagedetector'
import translationHE from './locales/he/translation.json';
import translationEN from './locales/en/translation.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources:{
            en:{
                translation:translationEN
            },
            he:{
                translation:translationHE
            }
        },
        fallbackLng:'en',
        interpolation:{
            escapeValue:false
        },
        lng:'he'
    })
export default i18n;