/**
 * StatusBadge Component
 * Reusable status indicator with translation support
 */

import { useTranslation } from "@/hooks/useTranslation";
import { Tag } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./StatusBadge.module.css";

const STATUS_CONFIG = {
  active: {
    className: styles.active,
    translationKey: "status.active",
  },
  inactive: {
    className: styles.inactive,
    translationKey: "status.inactive",
  },
  pending: {
    className: styles.pending,
    translationKey: "status.pending",
  },
  completed: {
    className: styles.completed,
    translationKey: "status.completed",
  },
  in_progress: {
    className: styles.in_progress,
    translationKey: "status.in_progress",
  },
  confirmed: {
    className: styles.confirmed,
    translationKey: "status.confirmed",
  },
  cancelled: {
    className: styles.cancelled,
    translationKey: "status.cancelled",
  },
  paid: {
    className: styles.active,
    translationKey: "status.paid",
  },
  unpaid: {
    className: styles.pending,
    translationKey: "status.unpaid",
  },
  failed: {
    className: styles.cancelled,
    translationKey: "status.failed",
  },
  expired: {
    className: styles.inactive,
    translationKey: "status.expired",
  },
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  const label = t(config.translationKey, { fallback: status });

  return <Tag className={`${styles.badge} ${config.className}`}>{label}</Tag>;
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    "active",
    "inactive",
    "pending",
    "completed",
    "in_progress",
    "confirmed",
    "cancelled",
    "paid",
    "unpaid",
    "failed",
    "expired",
  ]),
};

StatusBadge.defaultProps = {
  status: "inactive",
};

export default memo(StatusBadge);
