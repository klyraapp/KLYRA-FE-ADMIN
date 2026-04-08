/**
 * BookingRow Component
 * Single row for the recent bookings table
 */

import PropTypes from "prop-types";
import styles from "../../../../styles/recentBookings.module.css";

const STATUS_STYLES = {
  completed: styles.statusCompleted,
  pending: styles.statusPending,
};

const BookingRow = ({ customerId, name, email, dateTime, status }) => {
  const statusClass = STATUS_STYLES[status] || styles.statusPending;
  const statusLabel = status === "completed" ? "Completed" : "Pending";

  return (
    <tr>
      <td className={styles.customerId}>{customerId}</td>
      <td className={styles.customerName}>{name}</td>
      <td className={styles.customerEmail}>{email}</td>
      <td className={styles.dateTime}>{dateTime}</td>
      <td>
        <span className={`${styles.statusBadge} ${statusClass}`}>
          {statusLabel}
        </span>
      </td>
    </tr>
  );
};

BookingRow.propTypes = {
  customerId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["completed", "pending"]),
};

BookingRow.defaultProps = {
  status: "pending",
};

export default BookingRow;
