/**
 * DeleteConfirmModal Component
 * Reusable delete confirmation modal with pixel-perfect design
 */

import { useTranslation } from "@/hooks/useTranslation";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./DeleteConfirmModal.module.css";

const DeleteConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  title,
  itemName,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      closable={false}
      className={styles.deleteModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.iconWrapper}>
          <ExclamationCircleFilled className={styles.warningIcon} />
        </div>
        <h3 className={styles.title}>
          {title || t("modals.deleteConfirmation")}
        </h3>
        <p className={styles.message}>
          {t("modals.deleteMessage")}{" "}
          <span className={styles.itemName}>{itemName}</span>?{" "}
          {t("modals.cannotUndo")}
        </p>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("modals.deleting") : t("common.delete")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

DeleteConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  itemName: PropTypes.string,
  loading: PropTypes.bool,
};

DeleteConfirmModal.defaultProps = {
  title: "Delete Confirmation",
  itemName: "this item",
  loading: false,
};

export default memo(DeleteConfirmModal);
