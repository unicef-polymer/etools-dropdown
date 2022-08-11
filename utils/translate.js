import translations from '../assets/translations/all';

export function getTranslation(lang, key) {
  try {
    return translations[lang][key];
  } catch (error) {
    return translations.en[key];
  }
}
