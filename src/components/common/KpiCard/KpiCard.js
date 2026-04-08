/**
 * KpiCard Component
 * Displays key performance indicator with change percentage
 */

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from '../../../../styles/Dashboard.module.css';

const KpiCard = ({ label, value, change, isPositive }) => {
  const ChangeIcon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiDivider} />
      <div className={styles.kpiContent}>
        <p className={styles.kpiLabel}>{label}</p>
        <h2 className={styles.kpiValue}>{value}</h2>
        <div className={styles.kpiChange}>
          <span className={isPositive ? styles.kpiChangePositive : styles.kpiChangeNegative}>
            <ChangeIcon />
            {change}
          </span>
          <span className={styles.kpiChangeText}>Up from yesterday</span>
        </div>
      </div>
    </div>
  );
};

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string.isRequired,
  isPositive: PropTypes.bool,
};

KpiCard.defaultProps = {
  isPositive: true,
};

export default KpiCard;
