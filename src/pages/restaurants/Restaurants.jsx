import { useState } from "react";
import { useRestaurantData } from "../../hooks/useRestaurantData";
import Navigator from "../../components/navigator/Navigator";
import RestaurantStats from "../../components/restaurants/RestaurantStats";
import TopRestaurants from "../../components/restaurants/TopRestaurants";
import RestaurantDetails from "../../components/restaurants/RestaurantDetails";
import styles from "./Restaurants.module.css";

const Restaurants = () => {
  const { restaurantData, reviewData, isLoading, error } = useRestaurantData();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <Navigator />
        <div className={styles.content}>
          <div className={styles.loading}>Loading data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <Navigator />
        <div className={styles.content}>
          <div className={styles.error}>Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Navigator />

      <div className={styles.content}>
        <h1>Kandy Restaurants Dashboard</h1>

        <div className={styles.statsContainer}>
          <RestaurantStats data={restaurantData} reviews={reviewData} />
        </div>

        <div className={styles.visualizations}>
          <div className={styles.vizRow}>
            <TopRestaurants
              data={restaurantData}
              onSelectRestaurant={setSelectedRestaurant}
            />
            <RestaurantDetails
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
