/**
 * Auth Feature Constants
 * Contains all constants related to authentication
 */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Successfully Login",
  LOGIN_ERROR: "Email or Password is invalid",
  GOOGLE_LOGIN_FAILED: "Login Failed",
};

export const AUTH_STORAGE_KEYS = {
  REMEMBERED_EMAIL: "rememberedEmail",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export const TOKEN_EXPIRY = {
  REMEMBER_ME: 30,
  DEFAULT: 1,
};
