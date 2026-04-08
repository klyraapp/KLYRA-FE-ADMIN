/**
 * StatsCard Component
 * Reusable card for displaying statistics with trend indicators
 */

import PropTypes from "prop-types";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import styles from "../../../../styles/statsCard.module.css";
import { useTranslation } from "@/hooks/useTranslation";



const ICON_MAP = {
  bookings: HiOutlineClipboardList,
  pending: HiOutlineClock,
  revenue: HiOutlineCurrencyDollar,
  customers: HiOutlineCheckCircle,
};

const VARIANT_STYLES = {
  green: styles.iconGreen,
  yellow: styles.iconYellow,
  red: styles.iconRed,
  blue: styles.iconBlue,
};

const StatsCard = ({ title, value, percentage, trend, icon, variant }) => {
  const IconComponent = ICON_MAP[icon] || HiOutlineClipboardList;
  const TrendIcon = trend === "up" ? FiTrendingUp : FiTrendingDown;
  const trendClass = trend === "up" ? styles.trendUp : styles.trendDown;
  const iconClass = VARIANT_STYLES[variant] || styles.iconGreen;
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        <div className={`${styles.iconWrapper} ${iconClass}`}>
          <IconComponent />
        </div>
      </div>
      <h2 className={styles.cardValue}>{value}</h2>
      <div className={styles.trendWrapper}>
        <span className={`${styles.trendIndicator} ${trendClass}`}>
          <TrendIcon className={styles.trendIcon} />
          {percentage}
        </span>
        <span className={styles.trendText}>
          {trend === "up" ? t("dashboard.upFromYesterday") : t("dashboard.downFromYesterday")}
        </span>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["up", "down"]),
  icon: PropTypes.oneOf(["bookings", "pending", "revenue", "customers"]),
  variant: PropTypes.oneOf(["green", "yellow", "red", "blue"]),
};

StatsCard.defaultProps = {
  trend: "up",
  icon: "bookings",
  variant: "green",
};

export default StatsCard;
