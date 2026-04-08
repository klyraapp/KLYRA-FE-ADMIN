/**
 * useRememberMe Hook
 * Manages remember me checkbox state and email persistence
 */

import { useCallback, useEffect, useState } from "react";
import {
  clearRememberedEmail,
  getRememberedEmail,
  saveRememberedEmail,
} from "../services/authStorage";

/**
 * Hook for managing remember me functionality
 * @param {Object} form - Ant Design form instance
 * @returns {Object} Remember me state and handlers
 */
const useRememberMe = (form) => {
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = getRememberedEmail();

    if (savedEmail && form) {
      form.setFieldsValue({ email: savedEmail });
      setRememberMe(true);
    }
  }, [form]);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const persistEmail = useCallback(
    (email) => {
      if (rememberMe) {
        saveRememberedEmail(email);
      } else {
        clearRememberedEmail();
      }
    },
    [rememberMe],
  );

  return {
    rememberMe,
    handleRememberMeChange,
    persistEmail,
  };
};

export default useRememberMe;
