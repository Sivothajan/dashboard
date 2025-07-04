import { useState, useEffect } from "react";
import Navigator from "../../components/navigator/Navigator";
import { useRestaurantData } from "../../hooks/useRestaurantData";
import styles from "./Reviews.module.css";

const Reviews = () => {
  const { reviewData, isLoading, error } = useRestaurantData();
  const [sortBy, setSortBy] = useState("date");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [filterRestaurant, setFilterRestaurant] = useState("all");
  const [top10Restaurants, setTop10Restaurants] = useState([]);

  // Get unique restaurants from review data
  useEffect(() => {
    if (reviewData.length > 0) {
      // Extract unique restaurant names from the review data
      const uniqueRestaurants = Array.from(
        new Set(
          reviewData
            .map((review) => review.restaurant_name)
            .filter((name) => name && name.trim()), // Filter out empty names
        ),
      ).sort(); // Sort alphabetically

      // Convert to the format we need
      const restaurantsList = uniqueRestaurants.map((name) => ({
        name: name.trim(),
        reviewCount: reviewData.filter((r) => r.restaurant_name === name)
          .length,
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
    if (score > 0.6) return "😊";
    if (score > 0.3) return "😐";
    return "😕";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const filteredAndSortedReviews = reviewData
    .filter((review) => {
      // Filter by sentiment
      const sentimentMatch =
        filterSentiment === "all"
          ? true
          : filterSentiment === "positive"
            ? parseFloat(review.Sentiment_score) > 0.6
            : filterSentiment === "neutral"
              ? parseFloat(review.Sentiment_score) > 0.3 &&
                parseFloat(review.Sentiment_score) <= 0.6
              : filterSentiment === "negative"
                ? parseFloat(review.Sentiment_score) <= 0.3
                : true;

      // Filter by restaurant - case insensitive and trimmed comparison
      const restaurantName = (review.restaurant_name || "")
        .toLowerCase()
        .trim();
      const filterName = (filterRestaurant || "").toLowerCase().trim();
      const restaurantMatch =
        filterRestaurant === "all" || restaurantName === filterName;

      return sentimentMatch && restaurantMatch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.published_date) - new Date(a.published_date);
      }
      if (sortBy === "sentiment") {
        return parseFloat(b.Sentiment_score) - parseFloat(a.Sentiment_score);
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <Navigator />
        <div className={styles.content}>
          <div className={styles.loading}>Loading reviews...</div>
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
      <div className={styles.content}></div>
      <div className={styles.descriptionContainer}>
        <h1>Restaurant Reviews Analysis</h1>
        <p className={styles.descriptionText}></p>
        <div className={styles.controls}>
          <div className={styles.filter}>
            <label>Filter by restaurant:</label>
            <select
              value={filterRestaurant}
              onChange={(e) => setFilterRestaurant(e.target.value)}
            >
              <option value="all">All Restaurants</option>
              {top10Restaurants
                .filter(
                  (restaurant) => restaurant.name && restaurant.name.trim(),
                )
                .map((restaurant, index) => (
                  <option key={index} value={restaurant.name.trim()}>
                    {restaurant.name.trim()}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.filter}>
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

          <div className={styles.sort}>
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Most Recent</option>
              <option value="sentiment">Sentiment Score</option>
            </select>
          </div>
        </div>

        <div className={styles.reviewsList}>
          {filteredAndSortedReviews.map((review, index) => (
            <div key={index} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <h4>{review.text}</h4>
                <span className={styles.sentiment}>
                  {getSentimentEmoji(review.Sentiment_score)}{" "}
                  {(parseFloat(review.Sentiment_score) * 100).toFixed(0)}%
                </span>
              </div>
              <p className={styles.reviewText}>{review.review_text}</p>
              <div className={styles.reviewMeta}>
                <span className={styles.date}>
                  {formatDate(review.published_date)}
                </span>
                <span className={styles.rating}>★ {review.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
