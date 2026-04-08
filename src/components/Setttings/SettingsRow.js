/**
 * Reusable settings row component for displaying label with control
 */

import PropTypes from 'prop-types';
import styles from '../../styles/settingsRow.module.css';

const SettingsRow = ({ label, children }) => (
  <div className={styles.row}>
    <p className={styles.label}>{label}</p>
    <div className={styles.control}>{children}</div>
  </div>
);

SettingsRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

SettingsRow.defaultProps = {
  children: null,
};

export default SettingsRow;
