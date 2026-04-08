/**
 * Login Page
 * Entry point for user authentication
 */

"use-client";

import {
  LoginCard,
  LoginForm,
  LoginHeader,
  loginPageStyles,
  useGoogleAuth,
  useLanguage,
  useLogin,
  useRememberMe,
} from "@/features/auth";
import { Form } from "antd";

const Login = () => {
  const [form] = Form.useForm();
  const language = useLanguage();

  const { rememberMe, handleRememberMeChange, persistEmail } =
    useRememberMe(form);

  const { login, loginWithGoogle, isLoading } = useLogin({
    rememberMe,
    onEmailPersist: persistEmail,
  });

  const { handleGoogleSuccess, handleGoogleError } =
    useGoogleAuth(loginWithGoogle);

  const handleFinish = (values) => {
    login(values);
  };

  return (
    <div style={loginPageStyles.pageContainer}>
      <LoginCard>
        <LoginHeader />
        <LoginForm
          form={form}
          onFinish={handleFinish}
          rememberMe={rememberMe}
          onRememberMeChange={handleRememberMeChange}
          isLoading={isLoading}
          language={language}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
        />
      </LoginCard>
    </div>
  );
};

export default Login;

Login.getLayout = function (page) {
  return <>{page}</>;
};
