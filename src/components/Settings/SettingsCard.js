/**
 * Reusable settings card component with title and content area
 */

import PropTypes from 'prop-types';
import styles from '../../styles/settingsCard.module.css';

const SettingsCard = ({ title, children }) => (
  <div className={styles.card}>
    {title && <h2 className={styles.cardTitle}>{title}</h2>}
    <div className={styles.cardContent}>{children}</div>
  </div>
);

SettingsCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

SettingsCard.defaultProps = {
  title: '',
};

export default SettingsCard;
