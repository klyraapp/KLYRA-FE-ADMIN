/**
 * FormField Component
 * Reusable form field wrapper with label
 */

import { Form, Input } from "antd";
import { formStyles } from "../styles/login.styles";

const FormField = ({
  name,
  label,
  placeholder,
  rules,
  isPassword = false,
  testId,
}) => (
  <div style={formStyles.fieldContainer}>
    <label style={formStyles.label}>{label}</label>
    <Form.Item name={name} rules={rules} style={formStyles.formItem}>
      {isPassword ? (
        <Input.Password placeholder={placeholder} style={formStyles.input} />
      ) : (
        <Input
          placeholder={placeholder}
          style={formStyles.input}
          data-testid={testId}
        />
      )}
    </Form.Item>
  </div>
);

export default FormField;
