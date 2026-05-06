/**
 * BookingsCalendar Component
 * Main calendar view container for bookings
 * Groups bookings by date and renders CalendarDayGroup rows
 * Pure presentation — data fetching lives in the parent
 */

import CalendarDayGroup from "@/components/common/CalendarDayGroup";
import { groupBookingsByDate } from "@/utils/dateGrouping";
import { Empty, Spin } from "antd";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import styles from "./BookingsCalendar.module.css";

const BookingsCalendar = ({
  bookings,
  loading,
  onAction,
  canEdit,
  canDelete,
  totalCount,
}) => {
  const groupedDays = useMemo(
    () => groupBookingsByDate(bookings),
    [bookings]
  );

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  if (groupedDays.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <Empty description="No bookings found" />
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.summaryBar}>
        <span className={styles.summaryText}>
          {totalCount > 0 ? (
            <>
              Showing <strong>{bookings.length}</strong> of{" "}
              <strong>{totalCount}</strong> bookings
            </>
          ) : (
            <>
              Showing <strong>{bookings.length}</strong> bookings
            </>
          )}
        </span>
      </div>
      <div className={styles.daysList}>
        {groupedDays.map((group) => (
          <CalendarDayGroup
            key={group.date}
            dateLabel={group.dateLabel}
            dayLabel={group.dayLabel}
            monthLabel={group.monthLabel}
            bookings={group.bookings}
            onAction={onAction}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}
      </div>
    </div>
  );
};

BookingsCalendar.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onAction: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  totalCount: PropTypes.number,
};

BookingsCalendar.defaultProps = {
  bookings: [],
  loading: false,
  canEdit: false,
  canDelete: false,
  totalCount: 0,
};

export default memo(BookingsCalendar);
