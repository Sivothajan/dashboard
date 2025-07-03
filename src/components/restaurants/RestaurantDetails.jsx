const RestaurantDetails = ({ restaurant, onClose }) => {
  if (!restaurant) {
    return (
      <div className="restaurant-details">
        <div className="empty-state">
          <h3>No Restaurant Selected</h3>
          <p>Click on a restaurant from the list to view details</p>
        </div>

        <style jsx>{`
          .restaurant-details {
            background: var(--card-background);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .empty-state h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }

          .empty-state p {
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  // Format the TripAdvisor URL to a proper web URL
  const getWebsiteUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://www.tripadvisor.com${url}`;
  };

  // Format cuisines list
  const cuisinesList = restaurant.combined_cuisines
    ? restaurant.combined_cuisines.split(',').map(c => c.trim()).filter(c => c)
    : [];

  // Format rating display
  const formattedRating = restaurant.rating 
    ? parseFloat(restaurant.rating).toFixed(1)
    : 'N/A';

  // Format review count
  const formattedReviewCount = restaurant.reviewCount
    ? new Intl.NumberFormat().format(parseInt(restaurant.reviewCount))
    : '0';

  // Get sentiment emoji
  const getSentimentEmoji = (score) => {
    if (!score || isNaN(parseFloat(score))) return '😐';
    const sentimentScore = parseFloat(score);
    return sentimentScore > 0.6 ? "😊" : sentimentScore > 0.3 ? "😐" : "😕";
  };

  return (
    <div className="restaurant-details">
      <button className="close-button" onClick={onClose} aria-label="Close details">×</button>
      <h2>{restaurant.name || 'Unknown Restaurant'}</h2>
      
      <div className="details-grid">
        <div className="detail-item">
          <span className="label">Rating</span>
          <span className="value rating">
            ★ {formattedRating}
          </span>
        </div>

        <div className="detail-item">
          <span className="label">Reviews</span>
          <span className="value">{formattedReviewCount}</span>
        </div>

        <div className="detail-item">
          <span className="label">Sentiment</span>
          <span className="value sentiment">
            {getSentimentEmoji(restaurant.Sentiment_score)}
            <span className="sentiment-score">
              {restaurant.Sentiment_score 
                ? `(${parseFloat(restaurant.Sentiment_score).toFixed(2)})`
                : '(N/A)'}
            </span>
          </span>
        </div>

        <div className="detail-item full-width">
          <span className="label">Address</span>
          <span className="value">
            {restaurant.fullAddress || restaurant.address || 'Address not available'}
          </span>
        </div>

        {(restaurant.telephone || restaurant.phone) && (
          <div className="detail-item full-width">
            <span className="label">Phone</span>
            <span className="value">
              <a href={`tel:${restaurant.telephone || restaurant.phone}`} className="link">
                {restaurant.telephone || restaurant.phone}
              </a>
            </span>
          </div>
        )}

        {restaurant.url && (
          <div className="detail-item full-width">
            <span className="label">Website</span>
            <a 
              href={getWebsiteUrl(restaurant.url)}
              target="_blank" 
              rel="noopener noreferrer"
              className="value link"
            >
              Visit on TripAdvisor
            </a>
          </div>
        )}

        {cuisinesList.length > 0 && (
          <div className="detail-item full-width">
            <span className="label">Cuisines</span>
            <div className="cuisines-list">
              {cuisinesList.map((cuisine, index) => (
                <span key={index} className="cuisine-tag">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        )}

        {restaurant.priceLevel && (
          <div className="detail-item">
            <span className="label">Price Level</span>
            <span className="value price-level">
              {restaurant.priceLevel}
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .restaurant-details {
          background: var(--card-background);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          height: 100%;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: var(--background-color);
          color: var(--text-primary);
        }

        h2 {
          color: var(--text-primary);
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--primary-color);
          padding-right: 2rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .value {
          color: var(--text-primary);
          font-size: 1rem;
        }

        .rating {
          color: #f1c40f;
          font-weight: 600;
        }

        .link {
          color: var(--primary-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .link:hover {
          color: var(--primary-color-dark);
          text-decoration: underline;
        }

        .cuisines-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .cuisine-tag {
          background: var(--background-color);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .sentiment {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
        }

        .sentiment-score {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .price-level {
          color: #27ae60;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          h2 {
            font-size: 1.25rem;
          }

          .cuisine-tag {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RestaurantDetails;