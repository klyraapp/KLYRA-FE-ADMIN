/**
 * App Settings Section component
 * Dynamically renders settings cards based on the API response
 */

import SettingsCard from "@/components/Setttings/SettingsCard";
import SettingsRow from "@/components/Setttings/SettingsRow";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, InputNumber, Skeleton } from "antd";
import { useCallback, useEffect, useState } from "react";
import { humanizeKey } from "../helpers/formatHelpers";
import { useAppSettings, useUpdateAppSettings } from "../hooks/useAppSettings";

import { Switch } from "antd";
import BookingLimitOverrideInput from "./inputs/BookingLimitOverrideInput";
import MultiDateInput from "./inputs/MultiDateInput";

/**
 * Component for an individual settings group
 * @param {Object} props
 * @param {Object} props.settings - The settings object from API
 * @param {Function} props.onSave - Callback to save changes
 * @param {boolean} props.isUpdating - Loading state for save button
 */
const SettingGroup = ({ settings, onSave, isUpdating }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(settings?.value || {});

  useEffect(() => {
    if (settings?.value) {
      setValues(settings.value);
    }
  }, [settings]);

  const handleChange = useCallback((key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSave = () => {
    onSave(settings.id, { value: values });
  };

  // Generic translation lookup or humanize fallback
  const getLabel = (key) => {
    // Try to find in settings namespace first
    const translation = t(`settings.${key}`);
    if (translation !== `settings.${key}`) {
      return translation;
    }
    // Fallback to humanized key
    return humanizeKey(key);
  };

  const getTitle = (name) => {
    const translation = t(`settings.${name}`);
    if (translation !== `settings.${name}`) {
      return translation;
    }
    return humanizeKey(name);
  };

  const renderInput = (key, value) => {
    // Boolean switches
    if (typeof value === 'boolean' || ['sundayOff', 'saturdayOff'].includes(key)) {
      return (
        <Switch
          checked={value}
          onChange={(checked) => handleChange(key, checked)}
        />
      );
    }

    // Modern inputs based on key
    switch (key) {
      case 'fullClosedDates':
        return (
          <MultiDateInput
            value={value}
            onChange={(val) => handleChange(key, val)}
          />
        );
      case 'maxBookingLimitOverride':
        return (
          <BookingLimitOverrideInput
            value={value}
            onChange={(val) => handleChange(key, val)}
          />
        );
      case 'maxBookingsLimitPerDay':
        return (
          <InputNumber
            value={value}
            onChange={(val) => handleChange(key, val)}
            style={{ width: "100%" }}
            min={1}
          />
        );
      default:
        return (
          <InputNumber
            value={value}
            onChange={(val) => handleChange(key, val)}
            style={{ width: "100%" }}
            precision={key === "SQM_TO_SQFT" ? 3 : undefined}
          />
        );
    }
  };

  return (
    <SettingsCard title={getTitle(settings.name)}>
      {Object.entries(values).map(([key, value]) => (
        <SettingsRow key={key} label={getLabel(key)}>
          {renderInput(key, value)}
        </SettingsRow>
      ))}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={handleSave}
          loading={isUpdating}
        >
          {t("common.save")}
        </Button>
      </div>
    </SettingsCard>
  );
};

const AppSettingsSection = () => {
  const { t } = useTranslation();
  const { data: appSettings, isLoading } = useAppSettings();
  const { mutate: updateSettings, isPending, variables } = useUpdateAppSettings();

  const handleSave = (id, data) => {
    updateSettings({ id, data });
  };

  if (isLoading) {
    return (
      <SettingsCard title="...">
        <Skeleton active paragraph={{ rows: 5 }} />
      </SettingsCard>
    );
  }

  if (!appSettings || !Array.isArray(appSettings)) {
    return null;
  }

  return (
    <>
      {appSettings.map((group) => (
        <SettingGroup
          key={group.id}
          settings={group}
          onSave={handleSave}
          isUpdating={isPending && variables?.id === group.id}
        />
      ))}
    </>
  );
};

export default AppSettingsSection;
