import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import vi from "./locales/vi.json";
import { getStoredLanguage, setStoredLanguage } from "./languageStorage";

const initialLanguage = getStoredLanguage();
setStoredLanguage(initialLanguage);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: initialLanguage,
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

