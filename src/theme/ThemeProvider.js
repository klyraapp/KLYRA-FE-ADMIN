/**
 * Global Theme Provider for application-wide dark/light mode support
 * Uses Ant Design ConfigProvider with theme algorithms
 */

import { ConfigProvider, theme } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { darkTokens, lightTokens } from "./tokens";

const THEME_STORAGE_KEY = "app-theme-mode";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    if (typeof window === "undefined") {
      return {
        isDarkMode: false,
        toggleTheme: () => {},
        setTheme: () => {},
        tokens: lightTokens,
      };
    }
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === "dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const setTheme = useCallback((dark) => {
    setIsDarkMode(dark);
  }, []);

  const tokens = isDarkMode ? darkTokens : lightTokens;

  const themeConfig = useMemo(
    () => ({
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: tokens.colorPrimary,
        colorBgLayout: tokens.colorBgLayout,
        colorBgContainer: tokens.colorBgContainer,
        colorText: tokens.colorText,
        colorTextSecondary: tokens.colorTextSecondary,
        colorTextTertiary: tokens.colorTextTertiary,
        colorBorder: tokens.colorBorder,
        borderRadius: tokens.borderRadius,
        fontSize: tokens.fontSize,
      },
      components: {
        Switch: {
          colorPrimary: tokens.colorPrimary,
          colorPrimaryHover: tokens.colorPrimary,
        },
        Select: {
          colorBgContainer: tokens.colorBgContainer,
          colorBorder: tokens.colorBorder,
          borderRadius: tokens.borderRadius,
        },
      },
    }),
    [isDarkMode, tokens],
  );

  const contextValue = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      setTheme,
      tokens,
    }),
    [isDarkMode, toggleTheme, setTheme, tokens],
  );

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty(
        "--color-bg-layout",
        tokens.colorBgLayout,
      );
      document.documentElement.style.setProperty(
        "--color-bg-container",
        tokens.colorBgContainer,
      );
      document.documentElement.style.setProperty(
        "--color-text",
        tokens.colorText,
      );
      document.documentElement.style.setProperty(
        "--color-text-secondary",
        tokens.colorTextSecondary,
      );
      document.documentElement.style.setProperty(
        "--color-primary",
        tokens.colorPrimary,
      );
      document.documentElement.style.setProperty(
        "--color-border",
        tokens.colorBorder,
      );
      document.documentElement.style.setProperty(
        "--border-radius",
        `${tokens.borderRadius}px`,
      );
      document.documentElement.style.setProperty(
        "--border-radius-lg",
        `${tokens.borderRadiusLG}px`,
      );
      document.documentElement.style.setProperty(
        "--box-shadow",
        tokens.boxShadow,
      );
    }
  }, [tokens, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
