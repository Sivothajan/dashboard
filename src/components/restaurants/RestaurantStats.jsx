import React from 'react';

const RestaurantStats = ({ data }) => {
  const [cuisineStats, setCuisineStats] = React.useState({ totalCuisines: 0, topCuisines: [] });
  const totalRestaurants = data.length;

  React.useEffect(() => {
    const fetchCuisineData = async () => {
      try {
        const response = await fetch('/cuisine_counts.csv');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        const cuisines = lines.slice(1).map(line => {
          const [cuisine, count] = line.split(',');
          return [cuisine, parseInt(count)];
        });
        
        setCuisineStats({
          totalCuisines: cuisines.length,
          topCuisines: cuisines.slice(0, 5)
        });
      } catch (error) {
        console.error('Error loading cuisine data:', error);
      }
    };

    fetchCuisineData();
  }, []);

  // Cuisine data is now loaded from cuisine_counts.csv

  return (
    <div className="stats">
      <div className="stat-card">
        <h3>Total Restaurants</h3>
        <p className="stat-value">{totalRestaurants}</p>
      </div>
      
      <div className="stat-card">
        <h3>Unique Cuisines</h3>
        <p className="stat-value">{cuisineStats.totalCuisines}</p>
      </div>
      
      <div className="stat-card wide">
        <h3>Top Cuisines</h3>
        <ul className="cuisine-list">
          {cuisineStats.topCuisines.map(([cuisine, count]) => (
            <li key={cuisine}>
              <span>{cuisine}</span>
              <span className="count">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--card-background);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary-color);
          opacity: 0.7;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .wide {
          grid-column: 1 / -1;
        }

        h3 {
          margin: 0 0 1rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
          line-height: 1;
        }

        .cuisine-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .cuisine-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--background-color);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .cuisine-list li:hover {
          background: var(--primary-color);
          color: white;
        }

        .count {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .stat-value {
            font-size: 2rem;
          }

          .cuisine-list {
            gap: 0.5rem;
          }

          .cuisine-list li {
            padding: 0.375rem 0.75rem;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RestaurantStats;
