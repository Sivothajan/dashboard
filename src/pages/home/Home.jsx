import styles from "./Home.module.css";
import Navigator from "../../components/navigator/Navigator";
import visualizations from "../../assets/visualizations";
import homeImage from "../../assets/homeImage";

const Home = () => {
  return (
    <div className={styles.dashboard}>
      <Navigator />

      <div className={styles.content}>
        <h1>Kandy Restaurants Analysis</h1>
        <p className={styles.intro}>
          Welcome to the Kandy Restaurants Dashboard! Explore comprehensive
          analytics and insights about restaurants in Kandy, including ratings,
          reviews, cuisines, and more.
        </p>

        <div className={styles.picCard}>
          <img
            src={homeImage}
            alt="Kandy Restaurants"
            loading="lazy"
            style={{ maxWidth: "800px", width: "100%" }}
          />
        </div>

        <div className={styles.visualizationGrid}>
          {visualizations.map((viz, index) => (
            <div key={index} className={styles.vizCard}>
              <h3>{viz.title}</h3>
              <div className={styles.imgContainer}>
                <img src={viz.src} alt={viz.title} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
