import { useState, useEffect } from 'react';
import { apiClient } from './api/client';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.get('/api/hello');
        setMessage(data);
      } catch (err) {
        setError('Failed to connect to API');
        console.error('API Error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full-Stack App</h1>
        <p>API Response: {error ? error : message}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </header>
    </div>
  );
}

export default App;
