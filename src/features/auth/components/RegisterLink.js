/**
 * RegisterLink Component
 * Link to registration page with feature flag
 */

import { FEATURES } from "@/utils/constant";
import { IfFeatureEnabled } from "@growthbook/growthbook-react";
import Link from "next/link";
import { getTranslation } from "../../../../translations";
import { linkStyles } from "../styles/login.styles";

const RegisterLink = ({ language }) => (
  <IfFeatureEnabled feature={FEATURES.SIGN_UP}>
    <div style={linkStyles.registerContainer}>
      <Link href="/signup" style={linkStyles.registerLink}>
        {getTranslation(language, "don't_have_an_account?")}?{" "}
        {getTranslation(language, "register_here")}
      </Link>
    </div>
  </IfFeatureEnabled>
);

export default RegisterLink;
