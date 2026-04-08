import { useTranslation } from "@/hooks/useTranslation";
import {
  CloseOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip,
} from "antd";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo } from "react";
import styles from "./PricingRuleFormModal.module.css";

const getServiceTypeOptions = (t) => [
  { value: "ONE_TIME", label: t("pages.pricingRules.fields.oneTime") },
  { value: "RECURRING", label: t("pages.pricingRules.fields.recurring") },
];

const PricingRuleFormModal = ({
  open,
  onClose,
  onSave,
  data,
  mode,
  loading,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const isViewMode = mode === "view";

  // Watch fields for dynamic tooltip and validation
  const parentLimit = Form.useWatch("maxAreaLimit", form);
  const childRules = Form.useWatch("AdditionalAreaCost", form);

  const initialValues = useMemo(() => {
    if (!data) return { AdditionalAreaCost: [] };

    return {
      name: data.name || undefined,
      maxAreaLimit: data.maxAreaLimit ?? undefined,
      price: data.price ? parseFloat(data.price) : undefined,
      serviceType: data.serviceType || undefined,
      AdditionalAreaCost: Array.isArray(data.childRules)
        ? data.childRules.map((rule) => ({
          id: rule.id, // Preserve ID for partial updates
          maxAreaLimit: rule.maxAreaLimit ?? undefined,
          price: rule.price ? parseFloat(rule.price) : undefined,
          stepSize: rule.stepSize ?? undefined,
        }))
        : [],
    };
  }, [data]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  /**
   * Identifies which field should display the carry-over tooltip.
   * Tooltip shows on the field with the highest limit if it is < 500.
   */
  const tooltipInfo = useMemo(() => {
    let maxLimit = Number(parentLimit) || 0;
    let fieldType = "parent";
    let childIndex = -1;

    if (Array.isArray(childRules)) {
      childRules.forEach((child, index) => {
        const limit = Number(child?.maxAreaLimit) || 0;
        if (limit >= maxLimit) {
          maxLimit = limit;
          fieldType = "child";
          childIndex = index;
        }
      });
    }

    return {
      showTooltip: maxLimit > 0 && maxLimit < 500,
      fieldType,
      childIndex,
      message: t("pages.pricingRules.tooltips.maxLimitInfo"),
    };
  }, [parentLimit, childRules, t]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (isCreateMode) {
        const payload = {
          name: values.name,
          maxAreaLimit: Number(values.maxAreaLimit),
          price: Number(values.price),
          serviceType: values.serviceType,
          AdditionalAreaCost: Array.isArray(values.AdditionalAreaCost)
            ? values.AdditionalAreaCost.map((rule) => ({
              maxAreaLimit: Number(rule.maxAreaLimit),
              price: Number(rule.price),
              stepSize: Number(rule.stepSize),
            }))
            : [],
        };
        onSave(payload);
        return;
      }

      if (isEditMode && data?.id) {
        const updates = [];
        const additions = [];
        const deletions = [];

        // Comparison helper to avoid redundant calls
        const isNumericDiff = (v1, v2) => {
          if (v1 === v2) return false;
          if (v1 === undefined || v1 === null || v2 === undefined || v2 === null)
            return v1 !== v2;
          return Number(v1) !== Number(v2);
        };

        // Check parent changes
        const parentData = {};
        if (values.name !== initialValues.name) parentData.name = values.name;
        if (isNumericDiff(values.maxAreaLimit, initialValues.maxAreaLimit)) {
          parentData.maxAreaLimit = Number(values.maxAreaLimit);
        }
        if (isNumericDiff(values.price, initialValues.price)) {
          parentData.price = Number(values.price);
        }
        if (values.serviceType !== initialValues.serviceType) {
          parentData.serviceType = values.serviceType;
        }

        if (Object.keys(parentData).length > 0) {
          updates.push({ id: data.id, data: parentData });
        }

        // Track Current Child IDs for Deletion check
        const currentChildIds = new Set();

        // Check child changes and additions
        if (Array.isArray(values.AdditionalAreaCost)) {
          values.AdditionalAreaCost.forEach((child) => {
            if (child.id) {
              currentChildIds.add(child.id);
              // Check for updates to existing child
              const originalChild = initialValues.AdditionalAreaCost.find(
                (oc) => oc.id === child.id
              );

              if (originalChild) {
                const childData = {};
                if (isNumericDiff(child.maxAreaLimit, originalChild.maxAreaLimit)) {
                  childData.maxAreaLimit = Number(child.maxAreaLimit);
                }
                if (isNumericDiff(child.price, originalChild.price)) {
                  childData.price = Number(child.price);
                }
                if (isNumericDiff(child.stepSize, originalChild.stepSize)) {
                  childData.stepSize = Number(child.stepSize);
                }

                if (Object.keys(childData).length > 0) {
                  updates.push({ id: child.id, data: childData });
                }
              }
            } else {
              // New child addition
              additions.push({
                maxAreaLimit: Number(child.maxAreaLimit),
                price: Number(child.price),
                stepSize: Number(child.stepSize),
              });
            }
          });
        }

        // Identifying Deletions
        initialValues.AdditionalAreaCost.forEach((oc) => {
          if (oc.id && !currentChildIds.has(oc.id)) {
            deletions.push(oc.id);
          }
        });

        onSave({ updates, additions, deletions });
      }
    } catch (err) {
      /* Validation error */
    }
  }, [form, onSave, isCreateMode, isEditMode, data, initialValues]);

  const modalTitle = useMemo(() => {
    if (isViewMode) return `${t("common.view")} ${t("modals.pricingRule")}`;
    if (isCreateMode) return `${t("common.add")} ${t("modals.pricingRule")}`;
    return `${t("common.edit")} ${t("modals.pricingRule")}`;
  }, [isViewMode, isCreateMode, t]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      closeIcon={<CloseOutlined />}
      className={styles.formModal}
      title={
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{modalTitle}</span>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        disabled={isViewMode}
      >
        <div className={styles.fieldsGrid}>
          <Form.Item
            name="name"
            label={t("pages.pricingRules.fields.name")}
            className={styles.fullWidth}
          >
            <Input
              placeholder={t("pages.pricingRules.fields.name")}
              disabled={isViewMode}
            />
          </Form.Item>

          <Form.Item
            name="serviceType"
            label={t("pages.pricingRules.fields.serviceType")}
            rules={[
              { required: true, message: t("pages.pricingRules.fields.serviceType") },
            ]}
            className={styles.halfWidth}
          >
            <Select
              placeholder={t("pages.pricingRules.fields.serviceType")}
              options={getServiceTypeOptions(t)}
              disabled={isViewMode}
            />
          </Form.Item>

          <Form.Item
            name="maxAreaLimit"
            label={
              <span>
                {t("pages.pricingRules.fields.maxAreaLimit")}
                {tooltipInfo.showTooltip && tooltipInfo.fieldType === "parent" && (
                  <Tooltip title={tooltipInfo.message}>
                    <InfoCircleOutlined style={{ marginLeft: 8, color: "var(--color-primary)" }} />
                  </Tooltip>
                )}
              </span>
            }
            rules={[
              { required: true, message: t("pages.pricingRules.fields.maxAreaLimit") },
              { type: "number", min: 0, max: 500, message: "Range 0-500" },
            ]}
            className={styles.halfWidth}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="e.g. 50"
              disabled={isViewMode}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label={t("pages.pricingRules.fields.price")}
            rules={[
              { required: true, message: t("pages.pricingRules.fields.price") },
            ]}
            className={styles.halfWidth}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="e.g. 5850"
              disabled={isViewMode}
            />
          </Form.Item>
        </div>

        <div className={styles.childRulesSection}>
          <h4 className={styles.sectionTitle}>
            {t("pages.pricingRules.fields.additionalAreaCost")}
          </h4>

          <Form.List name="AdditionalAreaCost">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className={styles.childRuleRow}>
                    <Form.Item {...restField} name={[name, "id"]} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "maxAreaLimit"]}
                      label={
                        <span>
                          {t("pages.pricingRules.fields.maxAreaLimitShort")}
                          {tooltipInfo.showTooltip &&
                            tooltipInfo.fieldType === "child" &&
                            tooltipInfo.childIndex === name && (
                              <Tooltip title={tooltipInfo.message}>
                                <InfoCircleOutlined style={{ marginLeft: 8, color: "var(--color-primary)" }} />
                              </Tooltip>
                            )}
                        </span>
                      }
                      rules={[
                        { required: true, message: t("pages.pricingRules.fields.maxAreaLimitShort") },
                        { type: "number", min: 0, max: 500, message: "Range 0-500" },
                      ]}
                      className={styles.childField}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="50"
                        disabled={isViewMode}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      label={t("pages.pricingRules.fields.price")}
                      rules={[{ required: true, message: t("pages.pricingRules.fields.price") }]}
                      className={styles.childField}
                    >
                      <InputNumber
                        min={0}
                        step={0.01}
                        style={{ width: "100%" }}
                        placeholder="5850"
                        disabled={isViewMode}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "stepSize"]}
                      label={t("pages.pricingRules.fields.stepSize")}
                      rules={[{ required: true, message: t("pages.pricingRules.fields.stepSize") }]}
                      className={styles.childField}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="20"
                        disabled={isViewMode}
                      />
                    </Form.Item>

                    {!isViewMode && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        className={styles.removeButton}
                        aria-label="Remove step rule"
                      />
                    )}
                  </div>
                ))}

                {!isViewMode && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className={styles.addButton}
                  >
                    {t("pages.pricingRules.fields.addStepRule")}
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </div>

        {!isViewMode && (
          <div className={styles.footer}>
            <Button onClick={onClose} disabled={loading}>
              {t("common.cancel")}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
            >
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

PricingRuleFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  data: PropTypes.object,
  mode: PropTypes.oneOf(["view", "edit", "create"]).isRequired,
  loading: PropTypes.bool,
};

PricingRuleFormModal.defaultProps = {
  data: null,
  onSave: () => { },
  loading: false,
};

export default memo(PricingRuleFormModal);
