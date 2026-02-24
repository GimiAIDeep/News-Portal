import React from 'react';

const NewsCard = ({ news, onClick }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="news-card" onClick={onClick}>
      <img 
        src={`http://localhost:5000${news.image}`} 
        alt={news.title}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      <div className="news-content">
        <span className="news-category">{news.category}</span>
        <h3 className="news-title">{news.title}</h3>
        <div className="news-date">{formatDate(news.createdAt)}</div>
        <p className="news-description">{news.shortDesc}</p>
      </div>
    </div>
  );
};

export default NewsCard;