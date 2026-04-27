/**
 * LanguageContext
 * Global language management with persistence and page reload
 * Supports: en (English), no (Norwegian)
 */

import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/nb";

const LanguageContext = createContext(null);

const SUPPORTED_LANGUAGES = ["en", "no"];
const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "language";

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true);
      return;
    }

    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    const validLanguage =
      savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)
        ? savedLanguage
        : DEFAULT_LANGUAGE;

    setCurrentLanguage(validLanguage);
    setIsInitialized(true);

    if (validLanguage === "no") {
      dayjs.locale("nb");
    } else {
      dayjs.locale("en");
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = validLanguage;
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const loadTranslations = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/locales/${currentLanguage}.json`);

        if (!response.ok) {
          throw new Error(`Failed to load ${currentLanguage} translations`);
        }

        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        if (currentLanguage !== "en") {
          try {
            const fallbackResponse = await fetch("/locales/en.json");
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
          } catch (fallbackError) {
            setTranslations({});
          }
        } else {
          setTranslations({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage, isInitialized]);

  const changeLanguage = useMemo(
    () => (newLanguage) => {
      if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
        return;
      }

      if (newLanguage === currentLanguage) {
        return;
      }

      setCurrentLanguage(newLanguage);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newLanguage);
      }

      if (typeof document !== "undefined") {
        document.documentElement.lang = newLanguage;
      }

      if (typeof window !== "undefined") {
        router.reload();
      }
    },
    [currentLanguage, router],
  );

  const value = useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
      isInitialized,
      supportedLanguages: SUPPORTED_LANGUAGES,
      translations,
      isLoading,
    }),
    [currentLanguage, changeLanguage, isInitialized, translations, isLoading],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    if (typeof window === "undefined") {
      return {
        currentLanguage: DEFAULT_LANGUAGE,
        changeLanguage: () => { },
        isInitialized: true,
        supportedLanguages: SUPPORTED_LANGUAGES,
        translations: {},
        isLoading: false,
      };
    }
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};

export default LanguageContext;

