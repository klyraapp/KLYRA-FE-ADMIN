/**
 * useGoogleAuth Hook
 * Handles Google OAuth authentication
 */

import { useCallback } from "react";

/**
 * Decodes Google credential response
 * @param {string} credential - JWT credential from Google
 * @returns {Object} Decoded user data
 */
const decodeGoogleCredential = (credential) => {
  // jwt_decode is expected to be available globally or imported
  if (typeof jwt_decode === "undefined") {
    throw new Error("jwt_decode is not available");
  }

  return jwt_decode(credential);
};

/**
 * Hook for handling Google authentication
 * @param {Function} onSuccess - Callback when Google auth succeeds
 * @returns {Object} Google auth handlers
 */
const useGoogleAuth = (onSuccess) => {
  const handleGoogleSuccess = useCallback(
    (credentialResponse) => {
      try {
        const decoded = decodeGoogleCredential(credentialResponse?.credential);

        const googleUserData = {
          email: decoded?.email,
          socialId: decoded?.sub,
          is_active: decoded?.email_verified,
          socialProvider: "google",
          name: decoded?.name,
        };

        onSuccess?.(googleUserData);
      } catch (error) {
        handleGoogleError();
      }
    },
    [onSuccess],
  );

  const handleGoogleError = useCallback(() => {
    // Silent fail as per original implementation
  }, []);

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};

export default useGoogleAuth;
