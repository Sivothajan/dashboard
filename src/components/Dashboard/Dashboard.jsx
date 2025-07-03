import styles from '../../styles/Dashboard.module.css';
import DashboardBlock from '../DashboardBlock';

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        {/* Add any header controls here */}
      </header>
      
      <div className={styles.grid}>
        {/* Example blocks - replace with your actual dashboard blocks */}
        <DashboardBlock title="Analytics" className={styles.fullWidth}>
          {/* Add your analytics content */}
        </DashboardBlock>
        
        <DashboardBlock title="Statistics">
          {/* Add your statistics content */}
        </DashboardBlock>
        
        <DashboardBlock title="Performance">
          {/* Add your performance metrics */}
        </DashboardBlock>
        
        <DashboardBlock title="Revenue" className={styles.halfWidth}>
          {/* Add your revenue charts */}
        </DashboardBlock>
      </div>
    </div>
  );
};

export default Dashboard;
