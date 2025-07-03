import React, { useState, useEffect } from 'react';
import RestaurantStats from './RestaurantStats';
import TopRestaurants from './TopRestaurants';
import ReviewTrends from './ReviewTrends';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Load restaurant data
    fetch('/restaurant_data.csv')
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const restaurantData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
        setRestaurants(restaurantData);
      });

    // Load review data
    fetch('/review_data.csv')
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const reviewData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
        setReviews(reviewData);
      });
  }, []);
  
  return (
    <div className="dashboard">
      <RestaurantStats data={restaurants} reviews={reviews} />
      <div className="dashboard-row">
        <TopRestaurants data={restaurants} reviews={reviews} />
        <ReviewTrends data={reviews} />
      </div>

      <style jsx>{`
        .dashboard {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dashboard-row {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .dashboard-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;