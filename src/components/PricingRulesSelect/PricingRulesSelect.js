/**
 * PricingRulesSelect Component
 * Reusable multi-select dropdown for pricing rules
 * Enforces max 1 ONE_TIME and max 1 RECURRING rule selection
 * Fetches pricing rules and displays by id (or name when available)
 */

import { usePricingRulesList } from "@/hooks/usePricingRules";
import { useTranslation } from "@/hooks/useTranslation";
import { getSafeValue, safeMap } from "@/utils/safeRendering";
import { Form, Select, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo } from "react";

const MAX_ONE_TIME_RULES = 1;
const MAX_RECURRING_RULES = 1;

const PricingRulesSelect = ({
  value,
  onChange,
  disabled,
  placeholder,
}) => {
  const { t } = useTranslation();
  const { data: pricingRules = [], isLoading } =
    usePricingRulesList();

  // Watch the toggle fields from the parent form
  const allowRecurringBookings = Form.useWatch("allowRecurringBookings");
  const allowOneTimeBookings = Form.useWatch("allowOneTimeBookings");

  // Auto-filter selected rules when toggles change or data loads
  useEffect(() => {
    if (!onChange || isLoading || !Array.isArray(value)) return;

    const filteredValues = value.filter((id) => {
      const rule = pricingRules.find((r) => r.id === id);
      if (!rule) return true; // Keep if we can't find it (yet)

      if (rule.serviceType === "ONE_TIME" && allowOneTimeBookings === false) {
        return false;
      }
      if (rule.serviceType === "RECURRING" && allowRecurringBookings === false) {
        return false;
      }
      return true;
    });

    if (filteredValues.length !== value.length) {
      onChange(filteredValues);
    }
  }, [allowOneTimeBookings, allowRecurringBookings, pricingRules, isLoading, onChange, value]);

  const rulesByServiceType = useMemo(() => {
    const map = { ONE_TIME: [], RECURRING: [] };
    if (Array.isArray(pricingRules)) {
      pricingRules.forEach((rule) => {
        if (rule?.serviceType && map[rule.serviceType]) {
          map[rule.serviceType].push(rule);
        }
      });
    }
    return map;
  }, [pricingRules]);

  const selectedRuleTypes = useMemo(() => {
    const selectedIds = Array.isArray(value) ? value : [];
    const counts = { ONE_TIME: 0, RECURRING: 0 };

    selectedIds.forEach((selectedId) => {
      const rule = pricingRules.find(
        (r) => r?.id === selectedId,
      );
      if (rule?.serviceType && counts[rule.serviceType] !== undefined) {
        counts[rule.serviceType] += 1;
      }
    });

    return counts;
  }, [value, pricingRules]);

  const options = useMemo(() => {
    return safeMap(
      pricingRules.filter((rule) => rule?.ruleType === "BASE"),
      (rule) => {
        const selectedIds = Array.isArray(value) ? value : [];
        const isAlreadySelected = selectedIds.includes(rule?.id);

        let isDisabled = false;

        // Logic for types being enabled/disabled
        if (rule?.serviceType === "ONE_TIME" && allowOneTimeBookings === false) {
          isDisabled = true;
        }
        if (rule?.serviceType === "RECURRING" && allowRecurringBookings === false) {
          isDisabled = true;
        }

        // Logic for max selection (only if not already disabled by the toggles)
        if (!isDisabled && !isAlreadySelected && rule?.serviceType) {
          if (
            rule.serviceType === "ONE_TIME" &&
            selectedRuleTypes.ONE_TIME >= MAX_ONE_TIME_RULES
          ) {
            isDisabled = true;
          }
          if (
            rule.serviceType === "RECURRING" &&
            selectedRuleTypes.RECURRING >= MAX_RECURRING_RULES
          ) {
            isDisabled = true;
          }
        }

        const label = rule?.name
          ? `${rule.name} (ID: ${rule.id})`
          : `Rule #${getSafeValue(rule?.id)}`;

        const serviceTypeLabel =
          rule?.serviceType === "ONE_TIME"
            ? t("pages.pricingRules.fields.oneTime")
            : rule?.serviceType === "RECURRING"
              ? t("pages.pricingRules.fields.recurring")
              : t("common.unknown");

        return {
          value: rule?.id,
          label: `${label} - ${serviceTypeLabel}`,
          disabled: isDisabled,
          serviceType: rule?.serviceType,
          ruleName: rule?.name,
          ruleId: rule?.id,
        };
      },
      [],
    );
  }, [pricingRules, value, selectedRuleTypes, allowRecurringBookings, allowOneTimeBookings]);

  const handleChange = useCallback(
    (selectedValues) => {
      if (onChange) {
        onChange(selectedValues);
      }
    },
    [onChange],
  );

  const tagRender = useCallback(
    (props) => {
      const { value: tagValue, closable, onClose } = props;
      const rule = pricingRules.find((r) => r?.id === tagValue);
      const tagLabel = rule?.name
        ? rule.name
        : `Rule #${tagValue}`;

      const color =
        rule?.serviceType === "ONE_TIME" ? "green" : "orange";

      return (
        <Tag
          color={color}
          closable={closable && !disabled}
          onClose={onClose}
          style={{ marginRight: 4 }}
        >
          {tagLabel}
        </Tag>
      );
    },
    [pricingRules, disabled],
  );

  const bothTogglesOff = allowRecurringBookings === false && allowOneTimeBookings === false;

  return (
    <Tooltip
      title={bothTogglesOff ? t("messages.turnOnBookingTypeToSelectRules") : ""}
    >
      <div>
        <Select
          mode="multiple"
          value={value}
          onChange={handleChange}
          options={options}
          placeholder={placeholder || (bothTogglesOff ? t("messages.turnOnBookingTypeToSelectRules") : t("fields.selectPricingRulesOptional"))}
          disabled={disabled || bothTogglesOff}
          loading={isLoading}
          tagRender={tagRender}
          style={{ width: "100%" }}
          maxTagCount="responsive"
          allowClear
          optionFilterProp="label"
        />
      </div>
    </Tooltip>
  );
};

PricingRulesSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

PricingRulesSelect.defaultProps = {
  value: [],
  onChange: null,
  disabled: false,
  placeholder: null,
};

export default memo(PricingRulesSelect);
