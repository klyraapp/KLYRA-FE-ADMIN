/**
 * RecentBookingsTable Component
 * Displays recent bookings in a table format
 */

import PropTypes from "prop-types";
import styles from "../../../../styles/recentBookings.module.css";
import BookingRow from "./BookingRow";

const DEFAULT_DATA = [
  {
    id: 1,
    customerId: "H1-36R",
    name: "Will Joyce",
    email: "will.joyce@gmail.com",
    dateTime: "22-12-2025 03:44 PM",
    status: "completed",
  },
  {
    id: 2,
    customerId: "H1-36R",
    name: "Will Joyce",
    email: "will.joyce@gmail.com",
    dateTime: "22-12-2025 03:44 PM",
    status: "pending",
  },
  {
    id: 3,
    customerId: "H1-36R",
    name: "Will Joyce",
    email: "will.joyce@gmail.com",
    dateTime: "22-12-2025 03:44 PM",
    status: "completed",
  },
];

const RecentBookingsTable = ({ data, title }) => {
  const bookings = data || DEFAULT_DATA;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                customerId={booking.customerId}
                name={booking.name}
                email={booking.email}
                dateTime={booking.dateTime}
                status={booking.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RecentBookingsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customerId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      dateTime: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["completed", "pending"]),
    }),
  ),
  title: PropTypes.string,
};

RecentBookingsTable.defaultProps = {
  data: DEFAULT_DATA,
  title: "Recent Bookings",
};

export default RecentBookingsTable;
