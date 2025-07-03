import React, { useEffect, useState } from 'react';

const styles = {
  topRestaurants: {
    background: 'var(--card-background)',
    padding: '1.5rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-md)',
    height: '100%'
  },
  title: {
    margin: '0 0 1.5rem 0',
    color: 'var(--text-primary)',
    fontSize: '1.25rem',
    fontWeight: 600,
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--primary-color)'
  },
  restaurantList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '600px',
    overflowY: 'auto',
    paddingRight: '0.5rem'
  },
  message: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--text-secondary)',
    background: 'var(--background-color)',
    borderRadius: 'var(--border-radius)',
    border: '1px dashed var(--border-color)'
  },
  messageError: {
    color: 'var(--error-color, #e74c3c)',
    borderColor: 'var(--error-color, #e74c3c)'
  },
  messageText: {
    margin: '0 0 0.5rem 0',
    fontWeight: 500
  },
  messageSmall: {
    opacity: 0.8
  },
  restaurantCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem',
    background: 'var(--background-color)',
    borderRadius: 'var(--border-radius)',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    cursor: 'pointer',
    outline: 'none'
  },
  rank: {
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-color)',
    color: 'white',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    boxShadow: '0 2px 4px rgba(52, 152, 219, 0.2)'
  },
  info: {
    flex: 1,
    minWidth: 0
  },
  restaurantName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
    fontWeight: 600
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem'
  },
  rating: {
    color: '#f1c40f',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  reviews: {
    color: 'var(--text-secondary)'
  },
  cuisines: {
    color: 'var(--text-primary)',
    fontStyle: 'italic'
  },
  details: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  address: {
    color: 'var(--text-secondary)'
  },
  phone: {
    color: 'var(--text-secondary)'
  },
  sentiment: {
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500
  }
};

const TopRestaurants = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and parse top 15 data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('/top_15.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load top restaurants data');
        }
        return response.text();
      })
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const parsedData = rows
          .filter(row => row.trim())
          .map(row => {
            // Parse CSV line while handling quoted fields with commas
            const values = [];
            let currentValue = '';
            let insideQuotes = false;
            
            for (let i = 0; i < row.length; i++) {
              const char = row[i];
              
              if (char === '"') {
                if (!insideQuotes) {
                  insideQuotes = true;
                } else if (i + 1 < row.length && row[i + 1] === '"') {
                  // Handle escaped quotes
                  currentValue += '"';
                  i++; // Skip next quote
                } else {
                  insideQuotes = false;
                }
              } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
              } else {
                currentValue += char;
              }
            }
            // Push the last value
            values.push(currentValue.trim());
            
            // Clean the values: remove surrounding quotes and unescape double quotes
            const cleanValues = values.map(val => {
              val = val.trim();
              if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
              }
              return val.replace(/""/g, '"');
            });
            
            const [
              locationId,
              name,
              fullAddress,
              rating,
              reviewCount,
              telephone,
              _url, // Unused
              avgSentiment,
              sentimentLabel,
              cuisines
            ] = cleanValues;

            return {
              locationId: locationId || '',
              name: name || '',
              fullAddress: fullAddress || '',
              rating: Number(rating) || 0,
              reviewCount: Number(reviewCount) || 0,
              telephone: telephone || '',
              avgSentiment: avgSentiment ? parseFloat(avgSentiment) : null,
              sentimentLabel: sentimentLabel || '',
              cuisines: cuisines ? 
                cuisines.split(',')
                  .map(c => c.trim())
                  .filter(c => c && c !== 'null' && c !== 'undefined')
                : []
            };
          });
        setRestaurants(parsedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading top restaurants data:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const getSentimentEmoji = (score) => {
    if (!score && score !== 0) return '❓';
    score = parseFloat(score);
    if (score > 0.8) return '😊';
    if (score > 0.6) return '😃';
    if (score > 0.4) return '😐';
    return '😕';
  };

  if (isLoading) {
    return (
      <div style={styles.topRestaurants}>
        <h2 style={styles.title}>Top Rated Restaurants</h2>
        <div style={styles.message}>Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.topRestaurants}>
        <h2 style={styles.title}>Top Rated Restaurants</h2>
        <div style={{...styles.message, ...styles.messageError}}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.topRestaurants}>
      <h2 style={styles.title}>Top Rated Restaurants</h2>
      
      <div style={styles.restaurantList}>
        {restaurants.length === 0 ? (
          <div style={styles.message}>
            <p style={styles.messageText}>No restaurants found.</p>
            <small style={styles.messageSmall}>Please ensure the restaurant data is properly loaded.</small>
          </div>
        ) : (
          restaurants.map((restaurant, index) => (
            <div 
              key={restaurant.locationId} 
              style={styles.restaurantCard}
              onClick={() => onSelectRestaurant(restaurant)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.rank}>{index + 1}</div>
              <div style={styles.info}>
                <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                <div style={styles.meta}>
                  <span style={styles.rating}>
                    ★ {restaurant.rating.toFixed(1)}
                  </span>
                  <span style={styles.reviews}>
                    ({restaurant.reviewCount} reviews)
                  </span>
                  {restaurant.cuisines.length > 0 && (
                    <span style={styles.cuisines}>
                      {restaurant.cuisines.join(', ')}
                    </span>
                  )}
                </div>
                <div style={styles.details}>
                  <div style={styles.address}>{restaurant.fullAddress}</div>
                  {restaurant.telephone && (
                    <div style={styles.phone}>📞 {restaurant.telephone}</div>
                  )}
                </div>
                <div style={styles.sentiment}>
                  Sentiment: {getSentimentEmoji(restaurant.avgSentiment)}{' '}
                  {restaurant.avgSentiment !== null ? (restaurant.avgSentiment * 100).toFixed(1) + '%' : 'N/A'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .restaurant-list {
            max-height: 400px;
          }

          .restaurant-card {
            padding: 1rem;
          }

          .rank {
            min-width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .info h3 {
            font-size: 1rem;
          }

          .meta {
            gap: 0.75rem;
            font-size: 0.8125rem;
          }

          .details {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TopRestaurants;
