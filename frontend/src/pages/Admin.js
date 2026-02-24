import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Politics',
    shortDesc: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const categories = ['Politics', 'Sports', 'Technology', 'Business', 'Entertainment'];

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchNews();
    }
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setError('');
      fetchNews();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('shortDesc', formData.shortDesc);
    formDataToSend.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/news', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      setSuccess('News added successfully!');
      setFormData({
        title: '',
        content: '',
        category: 'Politics',
        shortDesc: ''
      });
      setImage(null);
      fetchNews();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add news');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await axios.delete(`http://localhost:5000/api/news/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        fetchNews();
      } catch (err) {
        setError('Failed to delete news');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="form-container">
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h2>
          
          {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Login
            </button>
          </form>
          
          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            Default: admin@news.com / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Panel</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

      <div className="form-container">
        <h2 style={{ marginBottom: '2rem' }}>Add News</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Short Description</label>
            <textarea
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Full Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Add News
          </button>
        </form>
      </div>

      <div className="admin-news-list">
        <h2 style={{ marginBottom: '1rem' }}>Manage News</h2>
        
        {news.map(item => (
          <div key={item._id} className="admin-news-item">
            <div>
              <h4>{item.title}</h4>
              <p style={{ color: '#666' }}>{item.category} - {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <button 
              className="btn btn-danger"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </button>
          </div>
        ))}
        
        {news.length === 0 && (
          <p>No news available</p>
        )}
      </div>
    </div>
  );
};

export default Admin;