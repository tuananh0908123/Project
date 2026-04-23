import { useState, useEffect } from 'react';
import { apiClient } from './api/client';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/hello');
        setMessage(data.message);
        setError(null);
      } catch (err) {
        setError('Không thể kết nối đến hệ thống Backend');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Hệ Thống Quản Lý Dự Án</h1>
        <div className="divider"></div>
        
        <div className="status-section">
          <p className="label">Trạng thái kết nối API:</p>
          
          {loading ? (
            <div className="loader"></div>
          ) : error ? (
            <div className="status-box error">
              <span className="icon">⚠️</span> {error}
            </div>
          ) : (
            <div className="status-box success">
              <span className="icon">✅</span> {message}
            </div>
          )}
        </div>

        <div className="footer">
          <span className="badge">Môi trường: {process.env.NODE_ENV}</span>
          <p className="copy">&copy; 2026 TuanAnh Developer</p>
        </div>
      </div>
    </div>
  );
}

export default App;