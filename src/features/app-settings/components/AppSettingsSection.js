/**
 * App Settings Section component
 * Dynamically renders settings cards based on the API response
 */

import SettingsCard from "@/components/Settings/SettingsCard";
import SettingsRow from "@/components/Settings/SettingsRow";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, InputNumber, Skeleton } from "antd";
import { useCallback, useEffect, useState } from "react";
import { humanizeKey } from "../helpers/formatHelpers";
import { useAppSettings, useUpdateAppSettings } from "../hooks/useAppSettings";

import usePermission from "@/hooks/usePermission";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import { Switch } from "antd";
import BookingLimitOverrideInput from "./inputs/BookingLimitOverrideInput";
import MultiDateInput from "./inputs/MultiDateInput";

/**
 * Mapping of setting group names to their respective view and update permissions.
 */
const SETTINGS_PERMISSION_MAP = {
  priceSettings: {
    view: PERMISSION_KEYS.VIEW_APP_PRICE_SETTINGS,
    update: PERMISSION_KEYS.UPDATE_APP_PRICE_SETTINGS,
  },
  bookingCalenderSlotSettings: {
    view: PERMISSION_KEYS.VIEW_APP_BOOKING_CALENDAR_SLOT_SETTINGS,
    update: PERMISSION_KEYS.UPDATE_APP_BOOKING_CALENDAR_SLOT_SETTINGS,
  },
  cronSettings: {
    view: PERMISSION_KEYS.VIEW_APP_CRON_SETTINGS,
    update: PERMISSION_KEYS.UPDATE_APP_CRON_SETTINGS,
  },
};

/**
 * Component for an individual settings group
 * @param {Object} props
 * @param {Object} props.settings - The settings object from API
 * @param {Function} props.onSave - Callback to save changes
 * @param {boolean} props.isUpdating - Loading state for save button
 * @param {boolean} props.canUpdate - Whether the user has permission to update this group
 */
const SettingGroup = ({ settings, onSave, isUpdating, canUpdate }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(settings?.value || {});

  useEffect(() => {
    if (settings?.value) {
      setValues(settings.value);
    }
  }, [settings]);

  const handleChange = useCallback((key, value) => {
    if (!canUpdate) return;
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, [canUpdate]);

  const handleSave = () => {
    const filteredValues = { ...values };
    delete filteredValues.saturdayOff;
    delete filteredValues.sundayOff;
    onSave(settings.id, { value: filteredValues });
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
    const commonProps = {
      disabled: !canUpdate,
    };

    // Boolean switches
    if (typeof value === "boolean") {
      return (
        <Switch
          {...commonProps}
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
            {...commonProps}
            value={value}
            onChange={(val) => handleChange(key, val)}
          />
        );
      case 'maxBookingLimitOverride':
        return (
          <BookingLimitOverrideInput
            {...commonProps}
            value={value}
            onChange={(val) => handleChange(key, val)}
          />
        );
      case 'maxBookingsLimitPerDay':
        return (
          <InputNumber
            {...commonProps}
            value={value}
            onChange={(val) => handleChange(key, val)}
            style={{ width: "100%" }}
            min={1}
          />
        );
      default:
        return (
          <InputNumber
            {...commonProps}
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
      {Object.entries(values)
        .filter(([key]) => !["saturdayOff", "sundayOff"].includes(key))
        .map(([key, value]) => (
          <SettingsRow key={key} label={getLabel(key)}>
            {renderInput(key, value)}
          </SettingsRow>
        ))}
      {canUpdate && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={handleSave}
            loading={isUpdating}
          >
            {t("common.save")}
          </Button>
        </div>
      )}
    </SettingsCard>
  );
};

const AppSettingsSection = () => {
  const { t } = useTranslation();
  const { can } = usePermission();
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

  // Filter groups based on view permissions
  const visibleGroups = appSettings.filter((group) => {
    const config = SETTINGS_PERMISSION_MAP[group.name];
    if (!config) return true; // Default to visible if not explicitly mapped
    return can(config.view);
  });

  return (
    <>
      {visibleGroups.map((group) => {
        const config = SETTINGS_PERMISSION_MAP[group.name];
        const canUpdate = config ? can(config.update) : true;

        return (
          <SettingGroup
            key={group.id}
            settings={group}
            onSave={handleSave}
            isUpdating={isPending && variables?.id === group.id}
            canUpdate={canUpdate}
          />
        );
      })}
    </>
  );
};

export default AppSettingsSection;
