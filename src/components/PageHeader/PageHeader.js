/**
 * PageHeader Component
 * Reusable page header with title, subtitle, and actions
 * Supports internationalization
 */

import { useTranslation } from "@/hooks/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./PageHeader.module.css";

const PageHeader = ({ title, subtitle, actions, titleKey, subtitleKey }) => {
  const { t } = useTranslation();

  const displayTitle = titleKey ? t(titleKey) : title;
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;

  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{displayTitle}</h1>
        {displaySubtitle && (
          <p className={styles.subtitle}>{displaySubtitle}</p>
        )}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  titleKey: PropTypes.string,
  subtitleKey: PropTypes.string,
};

PageHeader.defaultProps = {
  title: "",
  subtitle: "",
  actions: null,
  titleKey: null,
  subtitleKey: null,
};

export default memo(PageHeader);
