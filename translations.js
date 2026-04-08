import en from "./public/locales/en.json";
import no from "./public/locales/no.json";

const translations = {
  en,
  no,
};

export function getTranslation(locale, key) {
  if (!translations[locale] || !translations[locale][key]) {
    return key;
  }

  return translations[locale][key];
}
