import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Politics', 'Sports', 'Technology', 'Business', 'Entertainment'];

  useEffect(() => {
    fetchNews();
  }, [category, search]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      
      const response = await axios.get('http://localhost:5000/api/news', { params });
      setNews(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleNewsClick = (id) => {
    navigate(`/news/${id}`);
  };

  if (loading) return <div className="container loading">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <div className="search-filter">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search news by title..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="category-filter">
          <select value={category} onChange={handleCategoryChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          No news found
        </div>
      ) : (
        <div className="news-grid">
          {news.map(item => (
            <NewsCard 
              key={item._id} 
              news={item} 
              onClick={() => handleNewsClick(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;