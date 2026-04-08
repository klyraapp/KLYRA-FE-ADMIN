/**
 * ServiceDistribution Component
 * Displays service distribution with progress bars
 */

import PropTypes from "prop-types";
import styles from "../../../../styles/serviceDistribution.module.css";

const COLOR_MAP = {
  red: { dot: styles.dotRed, fill: styles.fillRed },
  green: { dot: styles.dotGreen, fill: styles.fillGreen },
  blue: { dot: styles.dotBlue, fill: styles.fillBlue },
};

const DEFAULT_DATA = [
  { id: 1, name: "Cleaning", bookings: 2, percentage: 100, color: "red" },
  { id: 2, name: "Cleaning", bookings: 2, percentage: 80, color: "green" },
  { id: 3, name: "Cleaning", bookings: 1, percentage: 50, color: "blue" },
];

const ServiceItem = ({ name, bookings, percentage, color }) => {
  const colorStyles = COLOR_MAP[color] || COLOR_MAP.green;

  return (
    <div className={styles.serviceItem}>
      <div className={styles.serviceHeader}>
        <div className={styles.serviceName}>
          <span className={`${styles.colorDot} ${colorStyles.dot}`} />
          <span className={styles.serviceLabel}>{name}</span>
        </div>
        <span className={styles.bookingCount}>{bookings} Booking</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${colorStyles.fill}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ServiceItem.propTypes = {
  name: PropTypes.string.isRequired,
  bookings: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  color: PropTypes.oneOf(["red", "green", "blue"]),
};

ServiceItem.defaultProps = {
  color: "green",
};

const ServiceDistribution = ({ data, title }) => {
  const services = data || DEFAULT_DATA;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.serviceList}>
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            name={service.name}
            bookings={service.bookings}
            percentage={service.percentage}
            color={service.color}
          />
        ))}
      </div>
    </div>
  );
};

ServiceDistribution.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      bookings: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
      color: PropTypes.oneOf(["red", "green", "blue"]),
    }),
  ),
  title: PropTypes.string,
};

ServiceDistribution.defaultProps = {
  data: DEFAULT_DATA,
  title: "Service Distribution",
};

export default ServiceDistribution;
