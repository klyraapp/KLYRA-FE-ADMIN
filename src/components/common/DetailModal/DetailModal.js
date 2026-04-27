/**
 * DetailModal Component
 * Reusable modal for viewing and editing details
 */

import { useTranslation } from "@/hooks/useTranslation";
import { CloseOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Select, Switch } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { memo, useEffect, useMemo } from "react";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { safeMap, safeRender } from "@/utils/safeRendering";
import IconUpload from "../IconUpload/IconUpload";
import styles from "./DetailModal.module.css";

const DetailModal = ({
  open,
  onClose,
  onSave,
  title,
  data,
  fields,
  mode,
  loading,
  children,
  isCreateMode = false,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const isViewMode = mode === "view";

  const processedData = useMemo(() => {
    if (!data) return {};

    const result = { ...data };
    fields.forEach((field) => {
      if (field.type === "date" && result[field.name]) {
        const dateValue = result[field.name];
        result[field.name] = dayjs(dateValue);
      }
    });
    return result;
  }, [data, fields]);

  useEffect(() => {
    if (open && processedData) {
      form.setFieldsValue(processedData);
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, processedData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch {
      // Validation failed
    }
  };

  const renderField = (field) => {
    const { type, options, revalidateFieldsOnChange, ...rest } = field;

    switch (type) {
      case "custom": {
        return safeRender(field.component, { disabled: isViewMode });
      }
      case "select":
        return (
          <Select
            disabled={isViewMode}
            options={options}
            placeholder={`Select ${field.label}`}
            {...rest}
          />
        );
      case "date":
        return (
          <DatePicker
            disabled={isViewMode}
            style={{ width: "100%" }}
            {...rest}
          />
        );
      case "switch":
        return (
          <Switch
            disabled={isViewMode}
            {...rest}
            onChange={(checked, event) => {
              if (typeof rest.onChange === "function") {
                rest.onChange(checked, event);
              }
              if (Array.isArray(revalidateFieldsOnChange)) {
                form.validateFields(revalidateFieldsOnChange).catch(() => {
                  // keep inline field errors from validation
                });
              }
            }}
          />
        );
      case "textarea":
        return (
          <Input.TextArea
            disabled={isViewMode}
            rows={3}
            placeholder={field.placeholder}
            {...rest}
          />
        );
      case "password":
        return (
          <Input.Password
            disabled={isViewMode}
            placeholder={field.placeholder || `Enter ${field.label}`}
            {...rest}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            disabled={isViewMode}
            placeholder={field.placeholder || `Enter ${field.label}`}
            {...rest}
          />
        );
      case "icon-upload":
        return <IconUpload disabled={isViewMode} {...rest} />;
      default:
        return (
          <Input
            disabled={isViewMode}
            placeholder={field.placeholder || `Enter ${field.label}`}
            {...rest}
          />
        );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closeIcon={<CloseOutlined />}
      className={styles.detailModal}
      title={
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            {isViewMode
              ? t("common.view")
              : isCreateMode
                ? t("common.add")
                : t("common.edit")}{" "}
            {title}
          </span>
        </div>
      }
    >
      <Form form={form} layout="vertical" className={styles.form}>
        <div className={styles.fieldsGrid}>
          <ErrorBoundary>
            {safeMap(fields, (field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={isViewMode ? [] : field.rules}
                dependencies={field.dependencies}
                valuePropName={field.type === "switch" ? "checked" : "value"}
                className={field.fullWidth ? styles.fullWidth : styles.halfWidth}
              >
                {renderField(field)}
              </Form.Item>
            ))}
          </ErrorBoundary>
        </div>

        {children}

        {!isViewMode && (
          <div className={styles.footer}>
            <Button onClick={onClose} disabled={loading}>
              {t("common.cancel")}
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {t("buttons.saveChanges")}
            </Button>
          </div>
        )}

        {isViewMode && (
          <div className={styles.footer}>
            <Button type="primary" onClick={onClose}>
              {t("common.close")}
            </Button>
          </div>
        )}
      </Form>
    </Modal>
  );
};

DetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      rules: PropTypes.array,
      dependencies: PropTypes.array,
      revalidateFieldsOnChange: PropTypes.array,
      options: PropTypes.array,
      fullWidth: PropTypes.bool,
    }),
  ).isRequired,
  mode: PropTypes.oneOf(["view", "edit"]).isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
  isCreateMode: PropTypes.bool,
};

DetailModal.defaultProps = {
  data: {},
  onSave: () => { },
  loading: false,
  children: null,
  isCreateMode: false,
};

export default memo(DetailModal);
