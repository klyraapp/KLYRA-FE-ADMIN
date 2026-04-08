/**
 * useToast Hook
 * Centralized toast notification system with i18n support
 */

import { message } from "antd";
import { useCallback } from "react";
import { useTranslation } from "./useTranslation";

const useToast = () => {
  const { t } = useTranslation();

  const success = useCallback(
    (key) => {
      message.success(t(key));
    },
    [t],
  );

  const error = useCallback(
    (key) => {
      message.error(t(key));
    },
    [t],
  );

  const warning = useCallback(
    (key) => {
      message.warning(t(key));
    },
    [t],
  );

  const info = useCallback(
    (key) => {
      message.info(t(key));
    },
    [t],
  );

  return {
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
