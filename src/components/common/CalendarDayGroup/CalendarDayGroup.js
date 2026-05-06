/**
 * CalendarDayGroup Component
 * Renders a date header followed by booking cards for that day
 * Matches the reference design: date number + month on left, day name beside it
 */

import BookingCard from "@/components/common/BookingCard";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./CalendarDayGroup.module.css";

const CalendarDayGroup = ({
  dateLabel,
  dayLabel,
  monthLabel,
  bookings,
  onAction,
  canEdit,
  canDelete,
}) => {
  const hasBookings = Array.isArray(bookings) && bookings.length > 0;

  return (
    <div className={styles.dayGroup}>
      <div className={styles.dayHeader}>
        <div className={styles.dateInfo}>
          <span
            className={`${styles.dateNumber} ${
              hasBookings ? styles.dateNumberActive : ""
            }`}
          >
            {dateLabel}
          </span>
          <span className={styles.monthAbbr}>{monthLabel}</span>
        </div>
        <span className={styles.dayName}>{dayLabel}</span>
        <div className={styles.headerLine} />
      </div>

      {hasBookings && (
        <div className={styles.bookingsList}>
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking?.id || `reserved-${index}`}
              booking={booking}
              onAction={onAction}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

CalendarDayGroup.propTypes = {
  dateLabel: PropTypes.string.isRequired,
  dayLabel: PropTypes.string.isRequired,
  monthLabel: PropTypes.string.isRequired,
  bookings: PropTypes.arrayOf(PropTypes.object),
  onAction: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

CalendarDayGroup.defaultProps = {
  bookings: [],
  canEdit: false,
  canDelete: false,
};

export default memo(CalendarDayGroup);
