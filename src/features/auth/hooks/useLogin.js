/**
 * useLogin Hook
 * Handles login mutation and authentication flow
 */

import { userLogin } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { AUTH_MESSAGES } from "../constants";
import { saveAuthTokens } from "../services/authStorage";

/**
 * Hook for handling login operations
 * @param {Object} options - Hook options
 * @param {boolean} options.rememberMe - Whether to remember user
 * @param {Function} options.onEmailPersist - Callback to persist email
 * @returns {Object} Login mutation state and handlers
 */
const useLogin = ({ rememberMe, onEmailPersist }) => {
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: userLogin,
  });

  const handleLoginSuccess = useCallback(
    (response, email) => {
      message.success(AUTH_MESSAGES.LOGIN_SUCCESS);

      const tokens = {
        access_token: response?.data?.access_token,
        refresh_token: response?.data?.refresh_token,
      };

      saveAuthTokens(tokens, rememberMe);
      onEmailPersist?.(email);
      router.push("/");
    },
    [rememberMe, onEmailPersist, router],
  );

  const handleLoginError = useCallback((error) => {
    const errorMsg = error?.response?.data?.message || AUTH_MESSAGES.LOGIN_ERROR;
    message.error(errorMsg);
  }, []);

  const login = useCallback(
    (credentials) => {
      const { email, password } = credentials;

      mutate(
        { email, password },
        {
          onSuccess: (response) => handleLoginSuccess(response, email),
          onError: handleLoginError,
        },
      );
    },
    [mutate, handleLoginSuccess, handleLoginError],
  );

  const loginWithGoogle = useCallback(
    (googleData) => {
      mutate(googleData, {
        onSuccess: (response) => handleLoginSuccess(response, googleData.email),
        onError: handleLoginError,
      });
    },
    [mutate, handleLoginSuccess, handleLoginError],
  );

  return {
    login,
    loginWithGoogle,
    isLoading,
  };
};

export default useLogin;
