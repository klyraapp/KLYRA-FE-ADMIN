/**
 * BookingCard Component
 * Compact card for displaying individual bookings in calendar view
 * Reuses StatusBadge, ActionMenu, and existing formatters
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import RecurringIndicator from "@/components/common/RecurringIndicator";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { FileTextOutlined } from "@ant-design/icons";
import { useTranslation } from "@/hooks/useTranslation";
import { Tag } from "antd";
import {
  formatArea,
  formatBookingStatus,
  formatCurrency,
  formatTime,
} from "@/utils/formatters";
import { getSafeValue } from "@/utils/safeRendering";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import styles from "./BookingCard.module.css";

const BookingCard = ({
  booking,
  onAction,
  canEdit,
  canDelete,
}) => {
  const { t } = useTranslation();

  const customerName = useMemo(() => {
    const first = booking?.contactFirstName || "";
    const last = booking?.contactLastName || "";
    return `${first} ${last}`.trim() || "-";
  }, [booking?.contactFirstName, booking?.contactLastName]);

  const serviceName = useMemo(
    () => booking?.service?.name || "-",
    [booking?.service?.name]
  );

  const formattedStatus = useMemo(
    () => formatBookingStatus(booking?.status),
    [booking?.status]
  );

  const actionItems = useMemo(() => {
    const items = [{ key: "view", label: t("common.view") }];

    if (canEdit) {
      items.push({ key: "edit", label: t("common.edit") });
    }

    if (canDelete) {
      items.push({ key: "delete", label: t("common.delete") });
    }

    return items;
  }, [t, canEdit, canDelete]);

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.statusIndicator} data-status={formattedStatus} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardRow}>
          <div className={styles.titleSection}>
            <span className={styles.bookingNumber}>
              {getSafeValue(booking?.bookingNumber)}
            </span>
            {booking?.subscription && (
              <RecurringIndicator
                interval={booking.subscription?.recurringIntervalType}
              />
            )}
          </div>
          <div className={styles.actionsSection}>
            <ActionMenu
              onAction={onAction}
              record={booking}
              items={actionItems}
            />
          </div>
        </div>

        <div className={styles.cardRow}>
          <span className={styles.customerName}>{customerName}</span>
          <span className={styles.email}>
            {getSafeValue(booking?.contactEmail)}
          </span>
        </div>

        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            {serviceName}
          </span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>
            {formatTime(booking?.startTime)}
          </span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>
            {formatArea(booking?.areaSqm)}
          </span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>
            {formatCurrency(booking?.totalAmount)}
          </span>
        </div>

        {booking?.bookingExtraServices?.length > 0 && (
          <div className={styles.extraServices}>
            {booking.bookingExtraServices.map((bes, idx) => (
              <Tag key={idx} color="cyan" className={styles.extraServiceTag}>
                {bes.extraService?.name}
              </Tag>
            ))}
          </div>
        )}

        <div className={styles.cardFooter}>
          <StatusBadge status={formattedStatus} />
          {booking?.adminNotes && (
            <div className={styles.adminNotesContainer}>
              <FileTextOutlined className={styles.notesIcon} />
              <span className={styles.notesText}>{booking.adminNotes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

BookingCard.defaultProps = {
  canEdit: false,
  canDelete: false,
};

export default memo(BookingCard);
