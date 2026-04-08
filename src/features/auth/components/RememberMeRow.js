/**
 * RememberMeRow Component
 * Renders remember me checkbox and forgot password link
 */

import { useTranslation } from "@/hooks/useTranslation";
import { Checkbox } from "antd";
import Link from "next/link";
import { optionsRowStyles } from "../styles/login.styles";

const RememberMeRow = ({ checked, onChange }) => {
  const { t } = useTranslation();

  return (
    <div style={optionsRowStyles.container}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        style={optionsRowStyles.checkbox}
      >
        <span style={optionsRowStyles.rememberText}>
          {t("auth.rememberMe")}
        </span>
      </Checkbox>
      <Link href="/forgot-password" style={optionsRowStyles.forgotLink}>
        {t("auth.forgotPassword")}
      </Link>
    </div>
  );
};

export default RememberMeRow;
