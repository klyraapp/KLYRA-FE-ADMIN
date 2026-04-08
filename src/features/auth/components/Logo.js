/**
 * Logo Component
 * Renders the Klyra brand logo with styled letters
 */

import { logoStyles } from "../styles/login.styles";

const Logo = () => (
  <div style={logoStyles.container}>
    <span style={logoStyles.letterK}>K</span>
    <span style={logoStyles.letterLY}>LY</span>
    <span style={logoStyles.letterRA}>RA</span>
  </div>
);

export default Logo;
