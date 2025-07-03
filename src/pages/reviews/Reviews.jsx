import { useState, useEffect } from "react";
import Navigator from "../../components/navigator/Navigator";
import { useRestaurantData } from "../../hooks/useRestaurantData";

const Reviews = () => {
  const { reviewData, isLoading, error } = useRestaurantData();
  const [sortBy, setSortBy] = useState('date');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterRestaurant, setFilterRestaurant] = useState('all');
  const [top10Restaurants, setTop10Restaurants] = useState([]);

  // Get unique restaurants from review data
  useEffect(() => {
    if (reviewData.length > 0) {
      // Extract unique restaurant names from the review data
      const uniqueRestaurants = Array.from(new Set(
        reviewData
          .map(review => review.restaurant_name)
          .filter(name => name && name.trim()) // Filter out empty names
      )).sort(); // Sort alphabetically

      // Convert to the format we need
      const restaurantsList = uniqueRestaurants.map(name => ({
        name: name.trim(),
        reviewCount: reviewData.filter(r => r.restaurant_name === name).length
      }));

      // Take top 10 by review count
      const top10 = restaurantsList
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 10);

      setTop10Restaurants(top10);
    }
  }, [reviewData]);

  const getSentimentEmoji = (score) => {
    score = parseFloat(score);
    if (score > 0.6) return '😊';
    if (score > 0.3) return '😐';
    return '😕';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const filteredAndSortedReviews = reviewData
    .filter(review => {
      // Filter by sentiment
      const sentimentMatch = 
        filterSentiment === 'all' ? true :
        filterSentiment === 'positive' ? parseFloat(review.Sentiment_score) > 0.6 :
        filterSentiment === 'neutral' ? parseFloat(review.Sentiment_score) > 0.3 && parseFloat(review.Sentiment_score) <= 0.6 :
        filterSentiment === 'negative' ? parseFloat(review.Sentiment_score) <= 0.3 :
        true;

      // Filter by restaurant - case insensitive and trimmed comparison
      const restaurantName = (review.restaurant_name || '').toLowerCase().trim();
      const filterName = (filterRestaurant || '').toLowerCase().trim();
      const restaurantMatch = filterRestaurant === 'all' || restaurantName === filterName;

      return sentimentMatch && restaurantMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.published_date) - new Date(a.published_date);
      }
      if (sortBy === 'sentiment') {
        return parseFloat(b.Sentiment_score) - parseFloat(a.Sentiment_score);
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="dashboard">
        <Navigator />
        <div className="content">
          <div className="loading">Loading reviews...</div>
        </div>
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
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navigator />
      <div className="content"></div>
        <div className="description-container">
          <h1>Restaurant Reviews Analysis</h1>
          <p className="description-text"></p>
        <div className="controls">
          <div className="filter">
            <label>Filter by restaurant:</label>
            <select 
              value={filterRestaurant} 
              onChange={(e) => setFilterRestaurant(e.target.value)}
            >
              <option value="all">All Restaurants</option>
              {top10Restaurants
                .filter(restaurant => restaurant.name && restaurant.name.trim())
                .map((restaurant, index) => (
                  <option 
                    key={index} 
                    value={restaurant.name.trim()}
                  >
                    {restaurant.name.trim()}
                  </option>
                ))}
            </select>
          </div>

          <div className="filter">
            <label>Filter by sentiment:</label>
            <select 
              value={filterSentiment} 
              onChange={(e) => setFilterSentiment(e.target.value)}
            >
              <option value="all">All Reviews</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>

          <div className="sort">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Most Recent</option>
              <option value="sentiment">Sentiment Score</option>
            </select>
          </div>
        </div>

        <div className="reviews-list">
          {filteredAndSortedReviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <h4>{review.text}</h4>
                <span className="sentiment">
                  {getSentimentEmoji(review.Sentiment_score)}
                  {' '}
                  {(parseFloat(review.Sentiment_score) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="review-text">{review.review_text}</p>
              <div className="review-meta">
                <span className="date">{formatDate(review.published_date)}</span>
                <span className="rating">★ {review.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .content {
          flex: 1;
          padding: 30px;
          margin-top: 60px;
        }

        h1 {
          color: #2c3e50;
          margin-bottom: 30px;
        }

        .controls {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .filter, .sort {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          min-width: 180px;
        }

        .reviews-list {
          display: grid;
          gap: 20px;
        }

        .review-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .review-header h4 {
          margin: 0;
          color: #2c3e50;
        }

        .sentiment {
          font-size: 1.1rem;
        }

        .review-text {
          color: #34495e;
          margin: 10px 0;
          line-height: 1.5;
        }

        .review-meta {
          display: flex;
          justify-content: space-between;
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        .rating {
          color: #f1c40f;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #666;
        }

        .error {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .content {
            margin-left: 0;
            margin-top: 60px;
            padding: 15px;
          }

          .controls {
            flex-direction: column;
            gap: 10px;
          }

          .reviews-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Reviews;
