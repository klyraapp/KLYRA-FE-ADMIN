/**
 * ServiceCard Component
 * Reusable card for displaying service packages and additional services
 * Supports two variants: 'package' (with status badge) and 'service' (with number)
 */

import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./ServiceCard.module.css";

const ServiceCard = ({
  variant,
  title,
  subtitle,
  price,
  status,
  number,
  onEdit,
  onDelete,
}) => {
  const isPackageVariant = variant === "package";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {isPackageVariant ? (
          <>
            <span className={styles.title}>{title}</span>
            <StatusBadge status={status} />
          </>
        ) : (
          <div className={styles.serviceHeader}>
            <span className={styles.serviceNumber}>#{number}</span>
            <span className={styles.serviceName}>{title}</span>
          </div>
        )}
      </div>

      {isPackageVariant && (
        <div className={styles.cardBody}>
          <span className={styles.planName}>{subtitle}</span>
        </div>
      )}

      <div className={styles.cardFooter}>
        <span
          className={
            isPackageVariant ? styles.packagePrice : styles.servicePrice
          }
        >
          {price}
        </span>
        <div className={styles.actions}>
          <Button
            type={isPackageVariant ? "link" : "text"}
            className={
              isPackageVariant ? styles.editLinkButton : styles.editButton
            }
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className={styles.deleteButton}
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  variant: PropTypes.oneOf(["package", "service"]),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  price: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["active", "inactive"]),
  number: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ServiceCard.defaultProps = {
  variant: "package",
  subtitle: null,
  status: "active",
  number: null,
  onEdit: null,
  onDelete: null,
};

export default memo(ServiceCard);
