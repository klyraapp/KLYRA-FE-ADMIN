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
    const first = booking?.contactFirstName || booking?.user?.firstName || "";
    const last = booking?.contactLastName || booking?.user?.lastName || "";
    return `${first} ${last}`.trim() || "-";
  }, [booking?.contactFirstName, booking?.contactLastName, booking?.user?.firstName, booking?.user?.lastName]);

  const serviceName = useMemo(
    () => booking?.service?.name || booking?.serviceName || booking?.service?.serviceName || "-",
    [booking?.service?.name, booking?.serviceName, booking?.service?.serviceName]
  );

  const formattedStatus = useMemo(
    () => formatBookingStatus(booking?.status),
    [booking?.status]
  );

  const actionItems = useMemo(() => {
    const items = [{ key: "view", label: t("common.view") }];

    if (booking?.id) {
      if (canEdit) {
        items.push({ key: "edit", label: t("common.edit") });
      }

      if (canDelete) {
        items.push({ key: "delete", label: t("common.delete") });
      }
    }

    return items;
  }, [t, canEdit, canDelete, booking?.id]);

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.statusIndicator} data-status={formattedStatus} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.titleSection}>
            <span className={styles.bookingNumber}>
              {getSafeValue(booking?.bookingNumber)}
            </span>
            {(booking?.subscription || booking?.subscriptionId) && (
              <RecurringIndicator
                interval={booking.subscription?.recurringIntervalType || booking?.recurringIntervalType}
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

        <div className={styles.customerRow}>
          <span className={styles.customerName}>{customerName}</span>
          <span className={styles.email}>
            {getSafeValue(booking?.contactEmail || booking?.user?.email)}
          </span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            {serviceName}
          </span>
          <span className={styles.metaDivider}>·</span>
          {booking?.startTime && (
            <>
              <span className={styles.metaItem}>
                {formatTime(booking?.startTime)}
              </span>
              <span className={styles.metaDivider}>·</span>
            </>
          )}
          <span className={styles.metaItem}>
            {formatArea(booking?.areaSqm)}
          </span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>
            {formatCurrency(booking?.totalAmount)}
          </span>
        </div>

        <div className={styles.contactRow}>
          <span className={styles.phone}>
            {getSafeValue(booking?.contactPhone || booking?.user?.phone)}
          </span>
          {(booking?.serviceStreetAddress || booking?.serviceCity) && (
            <>
              <span className={styles.metaDivider}>·</span>
              <span className={styles.address} title={`${booking?.serviceStreetAddress || ""} ${booking?.serviceCity || ""}`}>
                {booking?.serviceStreetAddress || booking?.serviceCity}
              </span>
            </>
          )}
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
          {(booking?.adminNotes || booking?.specialInstructions) && (
            <Tag
              color="red"
              icon={<FileTextOutlined />}
              className={styles.noteTag}
              title={booking?.adminNotes || booking?.specialInstructions}
            >
              {t("table.adminNotes") || "Admin Notes"}
            </Tag>
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
