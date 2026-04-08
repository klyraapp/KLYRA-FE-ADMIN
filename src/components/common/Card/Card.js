/**
 * Card Component
 * Reusable card wrapper with consistent styling
 */

import { FilterOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from '../../../../styles/Dashboard.module.css';

const Card = ({
  title,
  subtitle,
  showFilter,
  extra,
  children,
  className,
}) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {(title || showFilter || extra) && (
        <div className={styles.cardHeader}>
          <div>
            {title && <h3 className={styles.cardTitle}>{title}</h3>}
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
          <div className={styles.headerActions}>
            {showFilter && (
              <Button
                type="text"
                className={styles.filterButton}
                icon={<FilterOutlined />}
              />
            )}
            {extra}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showFilter: PropTypes.bool,
  extra: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.defaultProps = {
  title: '',
  subtitle: '',
  showFilter: false,
  extra: null,
  children: null,
  className: '',
};

export default Card;
