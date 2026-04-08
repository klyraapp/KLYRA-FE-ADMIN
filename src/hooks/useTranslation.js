/**
 * useTranslation Hook
 * Loads and provides translation functions based on current language
 * Supports dot-notation keys and fallback values
 */

import { useLanguage } from "@/context/LanguageContext";
import { useCallback } from "react";

export const useTranslation = () => {
  const { currentLanguage, translations, isLoading } = useLanguage();

  const t = useCallback(
    (key, options = {}) => {
      const { returnObjects = false, fallback } = options;
      const fallbackValue = fallback !== undefined ? fallback : key;

      if (!key || typeof key !== "string") {
        return fallbackValue;
      }

      const keys = key.split(".");
      let value = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallbackValue;
        }
      }

      if (returnObjects) {
        return value !== undefined ? value : fallbackValue;
      }

      return typeof value === "string" ? value : fallbackValue;
    },
    [translations],
  );

  return {
    t,
    currentLanguage,
    isLoading,
  };
};
