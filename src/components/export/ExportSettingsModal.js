/**
 * ExportSettingsModal Component
 * Reusable modal for exporting data in CSV/PDF formats
 * Dynamically adapts to different pages
 */

import { SettingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Modal, Select } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "../../styles/ExportSettingsModal.module.css";
import useExportHandlers from "./useExportHandlers";
import { useTranslation } from "@/hooks/useTranslation";

const RETENTION_OPTIONS = [
  { value: 7, label: "7" },
  { value: 15, label: "15" },
  { value: 30, label: "30" },
  { value: 60, label: "60" },
  { value: 90, label: "90" },
];

const ExportSettingsModal = ({
  open,
  onClose,
  pageKey,
  pageLabel,
  getData,
}) => {
  const { t } = useTranslation();
  const {
    retentionDays,
    exportFormats,
    enableRealtime,
    allowCustomReports,
    isExporting,
    handleRetentionChange,
    handleFormatChange,
    handleRealtimeChange,
    handleCustomReportsChange,
    handleReset,
    handleSave,
  } = useExportHandlers({ pageKey, getData, onClose });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className={styles.exportModal}
      closable={false}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {t("common.edit")} {pageLabel}
        </h2>

        <div className={styles.subHeader}>
          <SettingOutlined className={styles.settingIcon} />
          <span className={styles.subTitle}>{pageLabel}</span>
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>{t("export.dataRetention")}</label>
          <Select
            value={retentionDays}
            onChange={handleRetentionChange}
            options={RETENTION_OPTIONS}
            className={styles.select}
            size="large"
          />
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>{t("export.exportFormats")}</label>
          <div className={styles.checkboxGroup}>
            <Checkbox
              checked={exportFormats.csv}
              onChange={(e) => handleFormatChange("csv", e.target.checked)}
              className={styles.checkbox}
            >
              CSV
            </Checkbox>
            <Checkbox
              checked={exportFormats.pdf}
              onChange={(e) => handleFormatChange("pdf", e.target.checked)}
              className={styles.checkbox}
            >
              PDF
            </Checkbox>
            <Checkbox
              checked={exportFormats.excel}
              onChange={(e) => handleFormatChange("excel", e.target.checked)}
              className={styles.checkbox}
            >
              Excel
            </Checkbox>
          </div>
        </div>

        <div className={styles.formSection}>
          <Checkbox
            checked={enableRealtime}
            onChange={handleRealtimeChange}
            className={styles.checkbox}
          >
            {t("export.enableRealtime")}
          </Checkbox>
        </div>

        <div className={styles.formSection}>
          <Checkbox
            checked={allowCustomReports}
            onChange={handleCustomReportsChange}
            className={styles.checkbox}
          >
            {t("export.allowCustomReports")}
          </Checkbox>
        </div>

        <div className={styles.footer}>
          <Button
            onClick={handleReset}
            className={styles.resetButton}
            size="large"
            disabled={isExporting}
          >
            {t("buttons.resetToDefault")}
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className={styles.saveButton}
            size="large"
            loading={isExporting}
          >
            {t("buttons.saveSettings")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pageKey: PropTypes.oneOf([
    "bookings",
    "services",
    "additionalServices",
    "customers",
    "discountCodes",
  ]).isRequired,
  pageLabel: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
};

export default memo(ExportSettingsModal);
