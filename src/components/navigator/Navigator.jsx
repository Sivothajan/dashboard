import { useNavigate, useLocation } from "react-router-dom";
import { useRestaurantData } from "../../hooks/useRestaurantData";
import styles from "./Navigator.module.css";

const Navigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useRestaurantData();

  return (
    <nav className={styles.navigator}>
      <div
        className={styles.logo}
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
      >
        <h2>Kandy Restaurants</h2>
      </div>
      <ul className={styles.navList}>
        <li>
          <button
            className={`${styles.navItem} ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            <span className="icon">🏠</span>
            Home {isLoading && <span className="loading-dot">•</span>}
          </button>
        </li>
        <li>
          <button
            className={`${styles.navItem} ${location.pathname === "/restaurants" ? "active" : ""}`}
            onClick={() => navigate("/restaurants")}
            disabled={isLoading}
          >
            <span className={styles.icon}>🍽️</span>
            Restaurants {isLoading && <span className="loading-dot">•</span>}
          </button>
        </li>
        <li>
          <button
            className={`${styles.navItem} ${location.pathname === "/reviews" ? "active" : ""}`}
            onClick={() => navigate("/reviews")}
            disabled={isLoading}
          >
            <span className={styles.icon}>⭐</span>
            Reviews {isLoading && <span className={styles.loadingDot}>•</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigator;
