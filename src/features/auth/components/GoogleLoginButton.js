/**
 * GoogleLoginButton Component
 * Google OAuth login button wrapper
 */

import { FEATURES } from "@/utils/constant";
import { IfFeatureEnabled } from "@growthbook/growthbook-react";
import { GoogleLogin } from "@react-oauth/google";
import { Form } from "antd";
import { linkStyles } from "../styles/login.styles";

const GoogleLoginButton = ({ onSuccess, onError, testId = "google-login" }) => (
  <IfFeatureEnabled feature={FEATURES.SIGN_UP}>
    <Form.Item style={linkStyles.googleContainer}>
      <GoogleLogin
        onSuccess={onSuccess}
        type="standard"
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
        logo_alignment="center"
        prompt="select_account"
        text="signin_with"
        useOneTap
        onError={onError}
        data-testid={testId}
      />
    </Form.Item>
  </IfFeatureEnabled>
);

export default GoogleLoginButton;
