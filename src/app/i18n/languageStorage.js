import apiConfig from "app/configs/api.config";

export const DEFAULT_LANGUAGE = "vi";

export function getStoredLanguage() {
  const stored = window.localStorage.getItem(apiConfig.languageKey);
  if (stored === "en" || stored === "vi") {
    return stored;
  }
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang) {
  window.localStorage.setItem(apiConfig.languageKey, lang);
}

