import React from 'react';

const ReviewTrends = ({ data }) => {
  // Group reviews by month and calculate average sentiment
  const monthlyTrends = data.reduce((acc, review) => {
    if (!review.published_date || !review.Sentiment_score) return acc;
    
    const date = new Date(review.published_date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        count: 0,
        totalSentiment: 0
      };
    }
    
    acc[monthYear].count++;
    acc[monthYear].totalSentiment += parseFloat(review.Sentiment_score);
    
    return acc;
  }, {});

  // Convert to array and sort by date
  const trendData = Object.entries(monthlyTrends)
    .map(([month, data]) => ({
      month,
      averageSentiment: data.totalSentiment / data.count,
      reviewCount: data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Get last 6 months

  const maxCount = Math.max(...trendData.map(d => d.reviewCount));

  return (
    <div className="review-trends">
      <h2>Review Trends</h2>
      
      <div className="chart">
        {trendData.map(data => (
          <div key={data.month} className="bar-group">
            <div className="bar-container">
              <div 
                className="bar"
                style={{
                  height: `${(data.reviewCount / maxCount) * 100}%`,
                  backgroundColor: data.averageSentiment > 0.6 ? '#27ae60' :
                                 data.averageSentiment > 0.3 ? '#f39c12' : '#e74c3c'
                }}
              />
            </div>
            <div className="label">
              {data.month.split('-')[1]}
              /{data.month.split('-')[0].slice(2)}
            </div>
            <div className="count">{data.reviewCount}</div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="color-box" style={{backgroundColor: '#27ae60'}}></div>
          <span>Positive</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{backgroundColor: '#f39c12'}}></div>
          <span>Neutral</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{backgroundColor: '#e74c3c'}}></div>
          <span>Negative</span>
        </div>
      </div>

      <style jsx>{`
        .review-trends {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex: 1;
        }

        h2 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .chart {
          height: 200px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 30px;
          margin-bottom: 20px;
        }

        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .bar-container {
          width: 30px;
          height: 150px;
          display: flex;
          align-items: flex-end;
          margin-bottom: 10px;
        }

        .bar {
          width: 100%;
          background-color: #3498db;
          transition: height 0.3s;
        }

        .label {
          font-size: 0.8em;
          color: #666;
          margin-bottom: 5px;
        }

        .count {
          font-size: 0.8em;
          color: #999;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9em;
          color: #666;
        }

        .color-box {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default ReviewTrends;
