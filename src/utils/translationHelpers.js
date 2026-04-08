/**
 * Translation Helpers
 * Utilities for translating data in exports and other contexts
 * Uses async loading from public/locales folder
 */

const translationCache = {};

/**
 * Load translation file dynamically from public folder
 */
const loadTranslation = async (language) => {
  if (translationCache[language]) {
    return translationCache[language];
  }

  try {
    const response = await fetch(`/locales/${language}.json`);
    if (response.ok) {
      const data = await response.json();
      translationCache[language] = data;
      return data;
    }
  } catch (error) {
    console.warn(`Failed to load ${language} translations:`, error);
  }

  if (language !== "en") {
    try {
      const fallbackResponse = await fetch("/locales/en.json");
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        translationCache[language] = fallbackData;
        return fallbackData;
      }
    } catch (fallbackError) {
      console.warn("Failed to load fallback translations");
    }
  }

  return {};
};

/**
 * Get translation for a key in a specific language (async)
 */
export const getTranslationByLanguage = async (
  language,
  key,
  fallback = key,
) => {
  const translations = await loadTranslation(language);

  if (!translations || Object.keys(translations).length === 0) {
    return fallback;
  }

  const keys = key.split(".");
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return fallback;
    }
  }

  return typeof value === "string" ? value : fallback;
};

/**
 * Translate status values only (async)
 */
export const translateStatusValue = async (status, language) => {
  const statusMap = {
    active: "status.active",
    inactive: "status.inactive",
    pending: "status.pending",
    completed: "status.completed",
  };

  const key = statusMap[status?.toLowerCase()];
  if (!key) {
    return status || "-";
  }

  return await getTranslationByLanguage(language, key, status);
};

/**
 * Translate data values in a row (NOT keys)
 * Returns new row with same keys but translated values
 */
export const translateRowValues = async (row, language) => {
  const translatedRow = {};

  for (const key of Object.keys(row)) {
    let value = row[key];

    if (key === "status" || key.toLowerCase().includes("status")) {
      value = await translateStatusValue(value, language);
    }

    translatedRow[key] = value;
  }

  return translatedRow;
};

/**
 * Normalize column key for translation lookup
 * Converts snake_case to camelCase for i18n key matching
 * Does NOT mutate original data - only for translation lookup
 */
const normalizeColumnKey = (columnKey) => {
  if (!columnKey || typeof columnKey !== "string") {
    return columnKey;
  }

  return columnKey.replace(/_([a-z])/g, (match, letter) =>
    letter.toUpperCase(),
  );
};

/**
 * Translate table column header (async)
 * Normalizes key for translation lookup while preserving original key
 */
export const translateColumnHeader = async (columnKey, language) => {
  const normalizedKey = normalizeColumnKey(columnKey);
  const translationKey = `table.${normalizedKey}`;
  return await getTranslationByLanguage(language, translationKey, columnKey);
};

/**
 * Get translated column headers mapping
 * Returns: { originalKey: "Translated Label" }
 */
export const getTranslatedHeaders = async (columns, language) => {
  const headers = {};

  for (const column of columns) {
    headers[column] = await translateColumnHeader(column, language);
  }

  return headers;
};

/**
 * Preload translations for a language (useful for exports)
 */
export const preloadTranslations = async (language) => {
  return await loadTranslation(language);
};
