/**
 * useLanguage Hook
 * Handles language detection and state management
 */

import { useEffect, useState } from "react";

const DEFAULT_LANGUAGE = "en";

/**
 * Detects and manages user language preference
 * @returns {string} Current language code
 */
const useLanguage = () => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const detectLanguage = () => {
      if (typeof window === "undefined") return DEFAULT_LANGUAGE;

      const userLanguage =
        window.navigator.language || window.navigator.userLanguage;

      return userLanguage?.startsWith("en") ? "en" : "ar";
    };

    setLanguage(detectLanguage());
  }, []);

  return language;
};

export default useLanguage;
