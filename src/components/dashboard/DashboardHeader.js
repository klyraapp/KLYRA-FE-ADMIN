/**
 * DashboardHeader Component
 * Displays the dashboard title and subtitle
 */

import { useTranslation } from "@/hooks/useTranslation";
import PropTypes from "prop-types";
import styles from "../../../styles/dashboard.module.css";

const DashboardHeader = ({ title, subtitle, titleKey, subtitleKey }) => {
  const { t } = useTranslation();

  const displayTitle = titleKey ? t(titleKey) : title;
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;

  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{displayTitle}</h1>
      <p className={styles.pageSubtitle}>{displaySubtitle}</p>
    </div>
  );
};

DashboardHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  titleKey: PropTypes.string,
  subtitleKey: PropTypes.string,
};

DashboardHeader.defaultProps = {
  title: "",
  subtitle: "",
  titleKey: null,
  subtitleKey: null,
};

export default DashboardHeader;
