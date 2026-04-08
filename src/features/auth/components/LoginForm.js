/**
 * LoginForm Component
 * Main login form containing all form fields and actions
 */

import { useTranslation } from "@/hooks/useTranslation";
import { Form } from "antd";
import { formStyles } from "../styles/login.styles";
import FormField from "./FormField";
import GoogleLoginButton from "./GoogleLoginButton";
import LoginButton from "./LoginButton";
import RegisterLink from "./RegisterLink";
import RememberMeRow from "./RememberMeRow";

const LoginForm = ({
  form,
  onFinish,
  rememberMe,
  onRememberMeChange,
  isLoading,
  language,
  onGoogleSuccess,
  onGoogleError,
}) => {
  const { t } = useTranslation();

  const EMAIL_RULES = [{ required: true, message: t("auth.emailPlaceholder") }];
  const PASSWORD_RULES = [
    { required: true, message: t("auth.passwordPlaceholder") },
  ];

  return (
    <Form name="login" form={form} onFinish={onFinish} style={formStyles.form}>
      <FormField
        name="email"
        label={t("auth.emailLabel")}
        placeholder={t("auth.emailPlaceholder")}
        rules={EMAIL_RULES}
        testId="email-input"
      />

      <FormField
        name="password"
        label={t("auth.passwordLabel")}
        placeholder={t("auth.passwordPlaceholder")}
        rules={PASSWORD_RULES}
        isPassword
      />

      <RememberMeRow checked={rememberMe} onChange={onRememberMeChange} />

      <LoginButton isLoading={isLoading} />

      <RegisterLink language={language} />

      <GoogleLoginButton onSuccess={onGoogleSuccess} onError={onGoogleError} />
    </Form>
  );
};

export default LoginForm;
