/**
 * Login Page Styles
 * Contains all styles for the login feature components
 */

export const colors = {
  primary: "#0d7377",
  textDark: "#1a1a1a",
  textMuted: "#666",
  background: "#f5f5f5",
  white: "#ffffff",
  border: "#e0e0e0",
  shadow: "rgba(0, 0, 0, 0.08)",
};

export const loginPageStyles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: colors.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: "8px",
    padding: "48px 56px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: `0 2px 8px ${colors.shadow}`,
  },
};

export const logoStyles = {
  container: {
    marginBottom: "32px",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  letterK: {
    color: colors.textDark,
  },
  letterLY: {
    color: colors.primary,
  },
  letterRA: {
    color: colors.textDark,
  },
};

export const headingStyles = {
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: "32px",
    marginTop: "0",
  },
};

export const formStyles = {
  form: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: "8px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.textDark,
    marginBottom: "8px",
  },
  formItem: {
    marginBottom: "16px",
  },
  input: {
    height: "44px",
    fontSize: "14px",
    borderRadius: "4px",
    border: `1px solid ${colors.border}`,
  },
  buttonFormItem: {
    marginBottom: "16px",
  },
};

export const optionsRowStyles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  checkbox: {
    fontSize: "14px",
  },
  rememberText: {
    color: colors.textDark,
    fontSize: "14px",
  },
  forgotLink: {
    color: colors.textDark,
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
  },
};

export const buttonStyles = {
  loginButton: {
    width: "100%",
    height: "48px",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export const linkStyles = {
  registerContainer: {
    textAlign: "center",
    marginTop: "16px",
  },
  registerLink: {
    color: colors.textMuted,
  },
  googleContainer: {
    marginTop: "16px",
  },
};

export const buttonTheme = {
  inherit: true,
  token: {
    colorPrimary: colors.primary,
  },
};
