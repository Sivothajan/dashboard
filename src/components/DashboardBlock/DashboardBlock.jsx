import PropTypes from 'prop-types';
import styles from './DashboardBlock.module.css';

const DashboardBlock = ({ title, children, className }) => {
  return (
    <div className={`${styles.block} ${className || ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

DashboardBlock.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default DashboardBlock;
