import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/news/${id}`);
      setNews(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="container loading">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!news) return <div className="container">News not found</div>;

  return (
    <div className="container">
      <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>
        ← Back to Home
      </button>
      
      <div className="news-detail">
        <img 
          src={`http://localhost:5000${news.image}`}
          alt={news.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
          }}
        />
        
        <h1>{news.title}</h1>
        
        <div className="news-meta">
          <span className="news-category">{news.category}</span>
          <span>{formatDate(news.createdAt)}</span>
        </div>
        
        <div className="news-content-full">
          {news.content}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;