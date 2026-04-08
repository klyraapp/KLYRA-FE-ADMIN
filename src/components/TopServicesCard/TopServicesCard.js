/**
 * TopServicesCard Component
 * Displays top performing services with sales data
 */

import PropTypes from "prop-types";
import { memo } from "react";
import styles from "./TopServicesCard.module.css";

const ServiceItem = memo(({ name, price, growth, sales }) => {
  return (
    <div className={styles.serviceItem}>
      <div className={styles.serviceInfo}>
        <span className={styles.serviceName}>{name}</span>
        <span className={styles.servicePrice}>{price}</span>
      </div>
      <div className={styles.serviceStats}>
        <span className={styles.growth}>{growth}</span>
        <span className={styles.sales}>{sales}</span>
      </div>
    </div>
  );
});

ServiceItem.displayName = "ServiceItem";

ServiceItem.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  growth: PropTypes.string.isRequired,
  sales: PropTypes.string.isRequired,
};

const TopServicesCard = ({ title, data }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.servicesList}>
        {data.map((service) => (
          <ServiceItem
            key={service.id}
            name={service.name}
            price={service.price}
            growth={service.growth}
            sales={service.sales}
          />
        ))}
      </div>
    </div>
  );
};

TopServicesCard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      growth: PropTypes.string.isRequired,
      sales: PropTypes.string.isRequired,
    }),
  ),
};

TopServicesCard.defaultProps = {
  title: "Top Services",
  data: [],
};

export default memo(TopServicesCard);
