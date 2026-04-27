/**
 * AntModal Component
 * Reusable Ant Design modal wrapper for consistent styling and behavior
 */

import { useTranslation } from "@/hooks/useTranslation";
import { CloseOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./AntModal.module.css";

/**
 * AntModal provides a standardized container for all modals in the application.
 * It ensures consistent radius, padding, header design, and footer layout.
 */
const AntModal = ({
  open,
  onClose,
  onOk,
  title,
  children,
  width,
  loading,
  footer,
  okText,
  cancelText,
  okButtonProps,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onOk}
      title={
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{title}</span>
        </div>
      }
      footer={
        footer === undefined ? (
          <div className={styles.modalFooter}>
            <Button onClick={onClose} disabled={loading}>
              {cancelText || t("common.cancel") || "Cancel"}
            </Button>
            <Button
              type="primary"
              onClick={onOk}
              loading={loading}
              {...okButtonProps}
            >
              {okText || t("common.save") || "Save"}
            </Button>
          </div>
        ) : (
          footer
        )
      }
      width={width}
      centered
      closeIcon={<CloseOutlined className={styles.closeIcon} />}
      className={styles.antModal}
      {...props}
    >
      <div className={styles.modalContent}>{children}</div>
    </Modal>
  );
};

AntModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func,
  title: PropTypes.node,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  footer: PropTypes.node,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okButtonProps: PropTypes.object,
};

AntModal.defaultProps = {
  onOk: null,
  title: null,
  children: null,
  width: 600,
  loading: false,
  footer: undefined,
  okText: null,
  cancelText: null,
  okButtonProps: {},
};

export default memo(AntModal);
