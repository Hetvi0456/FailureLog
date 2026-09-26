import React, { useState, useEffect } from 'react';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>🐞 FailureLog</h1>
        <p>Phase 1 Technical Verification & Health Check</p>
      </div>

      <div className="status-grid">
        <div className="status-card">
          <span className="label">Express API</span>
          <div className="status-indicator">
            <span
              className={`dot ${
                loading
                  ? 'pending'
                  : error
                  ? 'error'
                  : health?.status === 'ok'
                  ? 'ok'
                  : 'error'
              }`}
            ></span>
            <span>
              {loading ? 'Checking...' : error ? 'Offline' : health?.status || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="status-card">
          <span className="label">MongoDB Atlas</span>
          <div className="status-indicator">
            <span
              className={`dot ${
                loading
                  ? 'pending'
                  : error
                  ? 'disconnected'
                  : health?.database === 'connected'
                  ? 'connected'
                  : 'disconnected'
              }`}
            ></span>
            <span>
              {loading
                ? 'Checking...'
                : error
                ? 'Disconnected'
                : health?.database || 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="info-box">
        <p><strong>Response Payload:</strong></p>
        <pre>
          {loading
            ? 'Fetching status...'
            : error
            ? JSON.stringify({ error }, null, 2)
            : JSON.stringify(health, null, 2)}
        </pre>
      </div>

      <button className="refresh-btn" onClick={fetchHealth} disabled={loading}>
        {loading ? 'Refreshing...' : 'Re-check Connection'}
      </button>
    </div>
  );
}

export default App;
