/**
 * LoginButton Component
 * Primary login submit button with loading state
 */

import Config from "@/components/common/Cofig";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Form } from "antd";
import { buttonStyles, buttonTheme, formStyles } from "../styles/login.styles";

const LoginButton = ({ isLoading, testId = "login-button" }) => {
  const { t } = useTranslation();

  return (
    <Form.Item style={formStyles.buttonFormItem}>
      <Config theme={buttonTheme}>
        <Button
          disabled={isLoading}
          style={buttonStyles.loginButton}
          type="primary"
          htmlType="submit"
          loading={isLoading}
          data-testid={testId}
        >
          {t("auth.loginButton")}
        </Button>
      </Config>
    </Form.Item>
  );
};

export default LoginButton;
