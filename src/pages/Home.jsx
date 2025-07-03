import { useState, useEffect } from "react";
import Navigator from "../components/navigator/Navigator";
import RestaurantStats from "../components/restaurants/RestaurantStats";
import TopRestaurants from "../components/restaurants/TopRestaurants";
import ReviewTrends from "../components/restaurants/ReviewTrends";

const Home = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load restaurant data
        const restaurantResponse = await fetch('/restaurant_data.csv');
        if (!restaurantResponse.ok) {
          throw new Error(`Failed to load restaurant data: ${restaurantResponse.statusText}`);
        }
        const restaurantText = await restaurantResponse.text();
        
        // Parse CSV data
        const restaurantRows = restaurantText.split('\n');
        const headers = restaurantRows[0].split(',');
        const restaurantArray = restaurantRows.slice(1)
          .filter(row => row.trim()) // Skip empty rows
          .map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              return obj;
            }, {});
          });
        
        console.log('Loaded restaurants:', restaurantArray.length);
        setRestaurantData(restaurantArray);

        // Load review data  
        const reviewResponse = await fetch('/review_data.csv');
        if (!reviewResponse.ok) {
          throw new Error(`Failed to load review data: ${reviewResponse.statusText}`);
        }
        const reviewText = await reviewResponse.text();
        
        const reviewRows = reviewText.split('\n');
        const reviewHeaders = reviewRows[0].split(',');
        const reviewArray = reviewRows.slice(1)
          .filter(row => row.trim()) // Skip empty rows
          .map(row => {
            const values = row.split(',');
            return reviewHeaders.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              return obj;
            }, {});
          });

        console.log('Loaded reviews:', reviewArray.length);
        setReviewData(reviewArray);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
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
            <TopRestaurants data={restaurantData} reviews={reviewData} />
            <ReviewTrends data={reviewData} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 20px;
        }
        
        .content {
          margin-top: 20px;
        }

        .stats-container {
          margin: 20px 0;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .visualizations {
          margin-top: 20px;
        }

        .viz-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        h1 {
          color: #333;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .viz-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
