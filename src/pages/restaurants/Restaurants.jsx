import React from 'react';
import { useRestaurantData } from "../../hooks/useRestaurantData";
import Navigator from "../../components/navigator/Navigator";
import RestaurantStats from "../../components/restaurants/RestaurantStats";
import TopRestaurants from "../../components/restaurants/TopRestaurants";
import RestaurantDetails from "../../components/restaurants/RestaurantDetails";

const Restaurants = () => {
  const { restaurantData, reviewData, isLoading, error } = useRestaurantData();
  const [selectedRestaurant, setSelectedRestaurant] = React.useState(null);

  if (isLoading) {
    return (
      <div className="dashboard">
        <Navigator />
        <div className="content">
          <div className="loading">Loading data...</div>
        </div>
        <style jsx>{`
          .loading {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Navigator />
        <div className="content">
          <div className="error">Error: {error}</div>
        </div>
        <style jsx>{`
          .error {
            text-align: center;
            padding: 2rem;
            color: #dc3545;
            background: #f8d7da;
            border-radius: 4px;
            margin: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navigator />
      
      <div className="content">
        <h1>Kandy Restaurants Dashboard</h1>
        
        <div className="stats-container">
          <RestaurantStats data={restaurantData} reviews={reviewData} />
        </div>

        <div className="visualizations">
          <div className="viz-row">
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

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--background-color);
        }
        
        .content {
          flex: 1;
          padding: 2rem;
          margin-top: 60px;
          max-width: 100vw;
          overflow-x: hidden;
        }

        h1 {
          color: var(--text-primary);
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--primary-color);
        }

        .stats-container {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem;
          transition: transform 0.2s ease;
        }

        .stats-container:hover {
          transform: translateY(-2px);
        }

        .visualizations {
          display: grid;
          gap: 2rem;
        }

        .viz-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .loading, .error {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 2rem;
          border-radius: var(--border-radius);
          background: var(--card-background);
          box-shadow: var(--shadow-md);
          text-align: center;
        }

        .loading {
          color: var(--text-secondary);
          font-size: 1.2rem;
        }

        .error {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
        }

        @media (max-width: 1200px) {
          .viz-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .content {
            padding: 15px;
            padding: 1rem;
            max-width: 100vw;
          }

          h1 {
            font-size: 1.5rem;
          }

          .stats-container {
            padding: 1rem;
          }

          .visualizations {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Restaurants;
