/**
 * LoginHeader Component
 * Renders the login page header with logo and title
 */

import { headingStyles } from "../styles/login.styles";
import Logo from "./Logo";

const LoginHeader = ({ testId = "Login-heading" }) => (
  <>
    <Logo />
    <h1 style={headingStyles.title} data-testid={testId}>
      Sign in to Klyra
    </h1>
  </>
);

export default LoginHeader;
