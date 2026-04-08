/**
 * PrimaryButton Component
 * Reusable primary action button
 */

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./PrimaryButton.module.css";

const PrimaryButton = ({ children, icon, onClick, loading, disabled }) => {
  return (
    <Button
      type="primary"
      icon={icon}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={styles.button}
    >
      {children}
    </Button>
  );
};

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

PrimaryButton.defaultProps = {
  icon: <PlusOutlined />,
  onClick: null,
  loading: false,
  disabled: false,
};

export default memo(PrimaryButton);
