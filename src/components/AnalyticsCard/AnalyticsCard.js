/**
 * AnalyticsCard Component
 * Card for displaying analytics metrics with badge
 */

import PropTypes from "prop-types";
import { memo } from "react";
import {
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
} from "react-icons/hi";
import styles from "./AnalyticsCard.module.css";

const ICON_MAP = {
  growth: HiOutlineClipboardList,
  customers: HiOutlineUserGroup,
  order: HiOutlineTrendingUp,
};

const VARIANT_STYLES = {
  green: { icon: styles.iconGreen, badge: styles.badgeGreen },
  yellow: { icon: styles.iconYellow, badge: styles.badgeYellow },
  blue: { icon: styles.iconBlue, badge: styles.badgeBlue },
};

const AnalyticsCard = ({ title, value, badgeText, icon, variant }) => {
  const IconComponent = ICON_MAP[icon] || HiOutlineClipboardList;
  const variantStyles = VARIANT_STYLES[variant] || VARIANT_STYLES.green;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        <div className={`${styles.iconWrapper} ${variantStyles.icon}`}>
          <IconComponent />
        </div>
      </div>
      <h2 className={styles.cardValue}>{value}</h2>
      <span className={`${styles.badge} ${variantStyles.badge}`}>
        {badgeText}
      </span>
    </div>
  );
};

AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  badgeText: PropTypes.string,
  icon: PropTypes.oneOf(["growth", "customers", "order"]),
  variant: PropTypes.oneOf(["green", "yellow", "blue"]),
};

AnalyticsCard.defaultProps = {
  badgeText: "this month",
  icon: "growth",
  variant: "green",
};

export default memo(AnalyticsCard);
