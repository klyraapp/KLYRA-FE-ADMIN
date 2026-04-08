/**
 * KpiCardsContainer Component
 * Displays all KPI cards in a single unified container with dividers
 * Matches the design reference with 4 partitions in one card
 */

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from '../../../../styles/Dashboard.module.css';

const KpiCardsContainer = ({ data = [] }) => {
  return (
    <div className={styles.kpiCardsWrapper}>
      {data.map((kpi, index) => {
        const ChangeIcon = kpi.isPositive ? ArrowUpOutlined : ArrowDownOutlined;
        const isLast = index === data.length - 1;

        return (
          <div key={kpi.id} className={styles.kpiCardItem}>
            {/* <div className={styles.kpiItemDivider} /> */}
            <div className={styles.kpiItemContent}>
              <p className={styles.kpiItemLabel}>{kpi.label}</p>
              <h2 className={styles.kpiItemValue}>{kpi.value}</h2>
              <div className={styles.kpiItemChange}>
                <span
                  className={
                    kpi.isPositive
                      ? styles.kpiItemChangePositive
                      : styles.kpiItemChangeNegative
                  }
                >
                  <ChangeIcon />
                  {kpi.change}
                </span>
                <span className={styles.kpiItemChangeText}>Up from yesterday</span>
              </div>
            </div>
            {!isLast && <div className={styles.kpiCardSeparator} />}
          </div>
        );
      })}
    </div>
  );
};

KpiCardsContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.string.isRequired,
      isPositive: PropTypes.bool,
    })
  ),
};

KpiCardsContainer.defaultProps = {
  data: [],
};

export default KpiCardsContainer;
