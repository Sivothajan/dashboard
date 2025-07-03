import React from "react";
import Navigator from "../../components/navigator/Navigator";

const Home = () => {
  const visualizations = [
    { src: "/images/restaurant_rating.png", title: "Restaurant Ratings" },
    { src: "/images/Number_cuisine.png", title: "Cuisine Analysis" },
    { src: "/images/pie_cuisins.png", title: "Cuisine Distribution" },
    { src: "/images/top10_restaurant.png", title: "Top 10 Restaurants" },
    { src: "/images/review_rating.png", title: "Review Ratings Distribution" },
    { src: "/images/platform.png", title: "Review Platforms" },
    { src: "/images/trip_type.png", title: "Trip Types" },
    { src: "/images/year.png", title: "Yearly Trends" },
    { src: "/images/number_language.png", title: "Review Languages" },
  ];

  return (
    <div className="dashboard">
      <Navigator />

      <div className="content">
        <h1>Kandy Restaurants Analysis</h1>
        <p className="intro">
          Welcome to the Kandy Restaurants Dashboard! Explore comprehensive
          analytics and insights about restaurants in Kandy, including ratings,
          reviews, cuisines, and more.
        </p>

        <div className="pic-card">
          <img src="kandy.jpg" alt="Kandy Restaurants" loading="lazy" style={{ maxWidth: '800px', width: '100%' }}/>
        </div>

        <div className="visualization-grid">
          {visualizations.map((viz, index) => (
            <div key={index} className="viz-card">
              <h3>{viz.title}</h3>
              <div className="img-container">
                <img src={viz.src} alt={viz.title} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pic-card {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 2rem auto;
          width: 100%;
          text-align: center;
        }

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
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--primary-color);
        }

        .intro {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 800px;
        }

        .visualization-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          padding: 1rem 0;
        }

        .viz-card {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .viz-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .viz-card h3 {
          color: var(--text-primary);
          font-size: 1.2rem;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .img-container {
          position: relative;
          width: 100%;
          background: white;
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .img-container img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .viz-card:hover .img-container img {
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .content {
            padding: 1rem;
          }

          h1 {
            font-size: 1.5rem;
          }

          .intro {
            font-size: 1rem;
          }

          .visualization-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .viz-card {
            padding: 1rem;
          }

          .viz-card h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
