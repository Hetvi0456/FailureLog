import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const Dashboard = () => {
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFailures = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/failures');
      setFailures(data);
    } catch (err) {
      setError(err.message || 'Failed to load failure entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFailures();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await apiFetch(`/failures/${id}`, { method: 'DELETE' });
      setFailures((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete failure');
    }
  };

  const totalFailures = failures.length;
  const openFailures = failures.filter((f) => f.status === 'open').length;
  const inProgressFailures = failures.filter((f) => f.status === 'in_progress').length;
  const resolvedFailures = failures.filter((f) => f.status === 'resolved').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Debugging Dashboard</h2>
          <p className="subtitle">Overview of your recorded failures & root cause memory</p>
        </div>
        <Link to="/failures/new" className="btn-primary">
          + Log New Failure
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Failures</span>
          <span className="metric-value">{loading ? '-' : totalFailures}</span>
        </div>
        <div className="metric-card open">
          <span className="metric-label">Open</span>
          <span className="metric-value">{loading ? '-' : openFailures}</span>
        </div>
        <div className="metric-card in-progress">
          <span className="metric-label">In Progress</span>
          <span className="metric-value">{loading ? '-' : inProgressFailures}</span>
        </div>
        <div className="metric-card resolved">
          <span className="metric-label">Resolved</span>
          <span className="metric-value">{loading ? '-' : resolvedFailures}</span>
        </div>
      </div>

      <div className="section-title">
        <h3>Recent Failures</h3>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading failures...</p>
        </div>
      ) : failures.length === 0 ? (
        <div className="empty-state">
          <p>No failure entries logged yet.</p>
          <Link to="/failures/new" className="btn-secondary">
            Log your first failure
          </Link>
        </div>
      ) : (
        <div className="failures-list">
          {failures.map((failure) => (
            <div key={failure._id} className="failure-card">
              <div className="failure-header">
                <div className="failure-title-area">
                  <Link to={`/failures/${failure._id}`} className="failure-title">
                    {failure.title}
                  </Link>
                  <div className="tags">
                    {failure.project && <span className="tag project">{failure.project}</span>}
                    {failure.technology && <span className="tag tech">{failure.technology}</span>}
                    {failure.category && <span className="tag category">{failure.category}</span>}
                  </div>
                </div>
                <span className={`status-pill ${failure.status}`}>
                  {failure.status.replace('_', ' ')}
                </span>
              </div>

              {failure.errorMessage && (
                <div className="failure-snippet">
                  <code>{failure.errorMessage.slice(0, 150)}{failure.errorMessage.length > 150 ? '...' : ''}</code>
                </div>
              )}

              <div className="failure-footer">
                <span className="date-info">
                  Logged: {new Date(failure.createdAt).toLocaleDateString()}
                </span>
                <div className="action-buttons">
                  <Link to={`/failures/${failure._id}`} className="btn-sm outline">
                    View
                  </Link>
                  <Link to={`/failures/${failure._id}/edit`} className="btn-sm secondary">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(failure._id, failure.title)}
                    className="btn-sm danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
