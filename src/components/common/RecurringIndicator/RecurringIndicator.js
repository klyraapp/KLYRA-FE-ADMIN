/**
 * RecurringIndicator Component
 * Pure, memoized UI component for displaying recurring booking indicators
 * Renders a small icon with frequency badge for subscribed bookings
 */

import { RedoOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./RecurringIndicator.module.css";

const INTERVAL_CONFIG = {
  WEEKLY: {
    badge: "W",
    color: "blue",
    label: "weekly",
  },
  EVERY_SECOND_WEEK: {
    badge: "2W",
    color: "green",
    label: "every 2 weeks",
  },
  EVERY_THIRD_WEEK: {
    badge: "3W",
    color: "orange",
    label: "every 3 weeks",
  },
  MONTHLY: {
    badge: "M",
    color: "purple",
    label: "monthly",
  },
};

const RecurringIndicator = ({ interval }) => {
  if (!interval) {
    return null;
  }

  const config = INTERVAL_CONFIG[interval];

  if (!config) {
    return null;
  }

  const tooltipText = `Recurring booking — ${config.label}`;

  return (
    <Tooltip title={tooltipText} placement="top">
      <span className={styles.container}>
        <RedoOutlined className={styles.icon} />
        <span className={`${styles.badge} ${styles[config.color]}`}>
          {config.badge}
        </span>
      </span>
    </Tooltip>
  );
};

RecurringIndicator.propTypes = {
  interval: PropTypes.oneOf([
    "WEEKLY",
    "EVERY_SECOND_WEEK",
    "EVERY_THIRD_WEEK",
    "MONTHLY",
  ]),
};

RecurringIndicator.defaultProps = {
  interval: null,
};

export default memo(RecurringIndicator);
