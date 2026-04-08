/**
 * Auth Storage Service
 * Handles all authentication-related storage operations (cookies & localStorage)
 */

import { deleteCookie, setCookie, setCookieWithExpiry } from "@/utils/utils";
import { AUTH_STORAGE_KEYS, TOKEN_EXPIRY } from "../constants";

/**
 * Saves authentication tokens based on remember me preference
 * @param {Object} tokens - Object containing access_token and refresh_token
 * @param {boolean} rememberMe - Whether to persist tokens for extended period
 */
export const saveAuthTokens = (tokens, rememberMe = false) => {
  const { access_token, refresh_token } = tokens;

  if (rememberMe) {
    setCookieWithExpiry(
      AUTH_STORAGE_KEYS.REFRESH_TOKEN,
      refresh_token,
      TOKEN_EXPIRY.REMEMBER_ME,
    );
    setCookieWithExpiry(
      AUTH_STORAGE_KEYS.ACCESS_TOKEN,
      access_token,
      TOKEN_EXPIRY.REMEMBER_ME,
    );
  } else {
    setCookie(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    setCookie(AUTH_STORAGE_KEYS.ACCESS_TOKEN, access_token);
  }
};

/**
 * Clears all authentication tokens
 */
export const clearAuthTokens = () => {
  deleteCookie(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  deleteCookie(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Saves email for remember me functionality
 * @param {string} email - User email to remember
 */
export const saveRememberedEmail = (email) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL, email);
};

/**
 * Gets remembered email from storage
 * @returns {string|null} Remembered email or null
 */
export const getRememberedEmail = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL);
};

/**
 * Clears remembered email from storage
 */
export const clearRememberedEmail = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL);
};
