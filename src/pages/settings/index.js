/**
 * Settings page with general settings including dark mode toggle
 */

import { useLanguage } from "@/context/LanguageContext";
import AppSettingsSection from "@/features/app-settings/components/AppSettingsSection";
import { useTranslation } from "@/hooks/useTranslation";
// `useTheme` import kept commented along with the dark-mode row below.
// import { useTheme } from "@/theme/ThemeProvider";
import { Select, Switch } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import SettingsCard from "../../components/Settings/SettingsCard";
import SettingsRow from "../../components/Settings/SettingsRow";
import PageGuard from "@/components/common/RBAC/PageGuard";
import PageHeader from "@/components/PageHeader/PageHeader";
import ServiceLocationSelector from "@/components/common/ServiceLocationSelector";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import { useLocation } from "@/context/LocationContext";
import styles from "../../styles/settingsPage.module.css";

const SettingsPage = () => {
  const { t } = useTranslation();
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const { currentLanguage, changeLanguage } = useLanguage();
  const { locations } = useLocation();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [locationFilter, setLocationFilter] = useState(null);

  // Auto-select the first available service location if none selected
  useEffect(() => {
    if (locations.length > 0 && !locationFilter) {
      setLocationFilter(locations[0].id);
    }
  }, [locations, locationFilter]);

  const handleLocationChange = useCallback((value) => {
    setLocationFilter(value);
  }, []);

  const LANGUAGE_OPTIONS = useMemo(
    () => [
      { value: "en", label: t("settings.english") },
      { value: "no", label: t("settings.norwegian") },
    ],
    [t],
  );

  const handleNotificationChange = useCallback((checked) => {
    setNotificationEnabled(checked);
  }, []);

  const handleLanguageChange = useCallback(
    (value) => {
      changeLanguage(value);
    },
    [changeLanguage],
  );

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.title")}
      >
        {isSuperAdmin && (
          <ServiceLocationSelector
            value={locationFilter}
            onChange={handleLocationChange}
            style={{ width: 180 }}
          />
        )}
      </PageHeader>

      <main className={styles.pageContent}>
        <SettingsCard title={t("settings.general")}>
          <SettingsRow label={t("settings.businessInfo")} />
          <SettingsRow label={t("settings.notification")}>
            <Switch
              checked={notificationEnabled}
              onChange={handleNotificationChange}
            />
          </SettingsRow>
          {/* Dark-mode toggle temporarily disabled.
          <SettingsRow label={t("settings.darkMode")}>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </SettingsRow>
          */}
          <SettingsRow label={t("settings.language")}>
            <Select
              value={currentLanguage}
              onChange={handleLanguageChange}
              options={LANGUAGE_OPTIONS}
              style={{ minWidth: 100 }}
              variant="outlined"
            />
          </SettingsRow>
        </SettingsCard>
        <AppSettingsSection
          serviceLocationId={locationFilter}
          isSuperAdmin={isSuperAdmin}
        />
      </main>
    </div>
  );
};

export default SettingsPage;
