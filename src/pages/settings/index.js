/**
 * Settings page with general settings including dark mode toggle
 */

import { useLanguage } from "@/context/LanguageContext";
import AppSettingsSection from "@/features/app-settings/components/AppSettingsSection";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/theme/ThemeProvider";
import { Select, Switch } from "antd";
import { useCallback, useMemo, useState } from "react";
import SettingsCard from "../../components/Settings/SettingsCard";
import SettingsRow from "../../components/Settings/SettingsRow";
import PageGuard from "@/components/common/RBAC/PageGuard";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import styles from "../../styles/settingsPage.module.css";

const SettingsPage = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [notificationEnabled, setNotificationEnabled] = useState(true);

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
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t("settings.title")}</h1>
        <p className={styles.pageBreadcrumb}>{t("settings.title")}</p>
      </header>
      <main className={styles.pageContent}>
        <SettingsCard title={t("settings.general")}>
          <SettingsRow label={t("settings.businessInfo")} />
          <SettingsRow label={t("settings.notification")}>
            <Switch
              checked={notificationEnabled}
              onChange={handleNotificationChange}
            />
          </SettingsRow>
          <SettingsRow label={t("settings.darkMode")}>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </SettingsRow>
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
        <AppSettingsSection />
      </main>
    </div>
  );
};

export default SettingsPage;
