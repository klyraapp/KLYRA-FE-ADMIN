/**
 * LoginCard Component
 * Container card for the login form
 */

import { loginPageStyles } from "../styles/login.styles";

const LoginCard = ({ children }) => (
  <div style={loginPageStyles.card}>{children}</div>
);

export default LoginCard;
