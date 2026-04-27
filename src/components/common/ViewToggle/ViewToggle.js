/**
 * ViewToggle Component
 * Toggle between List and Calendar views
 * Follows existing FiltersBar design language
 */

import { useTranslation } from "@/hooks/useTranslation";
import {
  UnorderedListOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { memo, useCallback } from "react";
import styles from "./ViewToggle.module.css";

const VIEW_LIST = "list";
const VIEW_CALENDAR = "calendar";

const ViewToggle = ({ activeView, onViewChange }) => {
  const { t } = useTranslation();

  const handleListClick = useCallback(() => {
    onViewChange(VIEW_LIST);
  }, [onViewChange]);

  const handleCalendarClick = useCallback(() => {
    onViewChange(VIEW_CALENDAR);
  }, [onViewChange]);

  return (
    <div className={styles.toggleWrapper}>
      <button
        type="button"
        className={`${styles.toggleButton} ${
          activeView === VIEW_LIST ? styles.active : ""
        }`}
        onClick={handleListClick}
        aria-label={t("common.list") || "List view"}
        aria-pressed={activeView === VIEW_LIST}
      >
        <UnorderedListOutlined className={styles.toggleIcon} />
        <span className={styles.toggleLabel}>{t("common.list")}</span>
      </button>
      <button
        type="button"
        className={`${styles.toggleButton} ${
          activeView === VIEW_CALENDAR ? styles.active : ""
        }`}
        onClick={handleCalendarClick}
        aria-label={t("common.dates") || "Calendar view"}
        aria-pressed={activeView === VIEW_CALENDAR}
      >
        <CalendarOutlined className={styles.toggleIcon} />
        <span className={styles.toggleLabel}>{t("common.dates")}</span>
      </button>
    </div>
  );
};

ViewToggle.propTypes = {
  activeView: PropTypes.oneOf([VIEW_LIST, VIEW_CALENDAR]).isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export { VIEW_LIST, VIEW_CALENDAR };
export default memo(ViewToggle);
