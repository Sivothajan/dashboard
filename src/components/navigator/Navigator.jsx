import { useNavigate, useLocation } from "react-router-dom";
import { useRestaurantData } from "../../hooks/useRestaurantData";

const Navigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useRestaurantData();

  return (
    <nav className="navigator">
      <div className="logo" onClick={() => navigate("/")} role="button" tabIndex={0}>
        <h2>Kandy Restaurants</h2>
      </div>
      <ul className="nav-list">
        <li>
          <button 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            <span className="icon">🏠</span>
            Home {isLoading && <span className="loading-dot">•</span>}
          </button>
        </li>
        <li>
          <button 
            className={`nav-item ${location.pathname === '/restaurants' ? 'active' : ''}`}
            onClick={() => navigate("/restaurants")}
            disabled={isLoading}
          >
            <span className="icon">🍽️</span>
            Restaurants {isLoading && <span className="loading-dot">•</span>}
          </button>
        </li>
        <li>
          <button 
            className={`nav-item ${location.pathname === '/reviews' ? 'active' : ''}`}
            onClick={() => navigate("/reviews")}
            disabled={isLoading}
          >
            <span className="icon">⭐</span>
            Reviews {isLoading && <span className="loading-dot">•</span>}
          </button>
        </li>
      </ul>

      <style jsx>{`
        .navigator {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #2c3e50;
          color: white;
          padding: 0 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          z-index: 1000;
        }

        .logo {
          margin-right: 40px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .logo:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .logo:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .logo h2 {
          color: #ecf0f1;
          margin: 0;
          font-size: 1.5rem;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: none;
          background: none;
          color: #bdc3c7;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #34495e;
          color: white;
        }

        .nav-item.active {
          background: #3498db;
          color: white;
        }

        .icon {
          margin-right: 8px;
          font-size: 1.2rem;
        }

        .loading-dot {
          display: inline-block;
          margin-left: 8px;
          animation: pulse 1s infinite;
          color: rgba(255, 255, 255, 0.7);
        }

        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }

        .nav-item:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .navigator {
            padding: 0 10px;
          }

          .logo h2 {
            font-size: 1.2rem;
          }

          .nav-item {
            padding: 6px 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigator;
