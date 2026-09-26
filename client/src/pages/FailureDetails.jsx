import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const FailureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [failure, setFailure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFailure = async () => {
      try {
        const data = await apiFetch(`/failures/${id}`);
        setFailure(data);
      } catch (err) {
        setError(err.message || 'Failed to load failure record');
      } finally {
        setLoading(false);
      }
    };

    fetchFailure();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${failure?.title}"?`)) {
      return;
    }

    try {
      await apiFetch(`/failures/${id}`, { method: 'DELETE' });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to delete failure record');
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading failure details...</p>
      </div>
    );
  }

  if (error || !failure) {
    return (
      <div className="page-container">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <div className="alert error">{error || 'Failure entry not found'}</div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <div className="header-actions">
          <Link to={`/failures/${id}/edit`} className="btn-secondary">
            ✏️ Edit Failure
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="details-card">
        <div className="title-row">
          <h1>{failure.title}</h1>
          <span className={`status-pill ${failure.status}`}>
            {failure.status.replace('_', ' ')}
          </span>
        </div>

        <div className="metadata-row">
          {failure.project && (
            <div className="meta-item">
              <span className="meta-label">Project:</span>
              <span className="tag project">{failure.project}</span>
            </div>
          )}
          {failure.technology && (
            <div className="meta-item">
              <span className="meta-label">Technology:</span>
              <span className="tag tech">{failure.technology}</span>
            </div>
          )}
          {failure.category && (
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="tag category">{failure.category}</span>
            </div>
          )}
          {failure.environment && (
            <div className="meta-item">
              <span className="meta-label">Environment:</span>
              <span className="tag environment">{failure.environment}</span>
            </div>
          )}
        </div>

        {failure.errorMessage && (
          <div className="detail-section">
            <h3>Error Message / Stack Trace</h3>
            <div className="code-block">
              <pre>{failure.errorMessage}</pre>
            </div>
          </div>
        )}

        <div className="detail-grid">
          <div className="detail-section">
            <h3>Root Cause</h3>
            <div className="content-box">
              {failure.rootCause ? (
                <p>{failure.rootCause}</p>
              ) : (
                <p className="placeholder-text">No root cause recorded yet.</p>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Definitive Solution</h3>
            <div className="content-box solution-box">
              {failure.solution ? (
                <p>{failure.solution}</p>
              ) : (
                <p className="placeholder-text">No working solution recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {failure.attempts && failure.attempts.length > 0 && (
          <div className="detail-section">
            <h3>Recorded Debugging Attempts ({failure.attempts.length})</h3>
            <div className="attempts-timeline">
              {failure.attempts.map((attempt, index) => (
                <div key={index} className="attempt-item">
                  <div className="attempt-header">
                    <span className="attempt-number">Attempt #{index + 1}</span>
                    <span className="attempt-time">
                      {new Date(attempt.timestamp || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <p className="attempt-action"><strong>Action:</strong> {attempt.action}</p>
                  {attempt.result && <p className="attempt-result"><strong>Result:</strong> {attempt.result}</p>}
                  {attempt.notes && <p className="attempt-notes"><strong>Notes:</strong> {attempt.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="timestamps-footer">
          <span>Created: {new Date(failure.createdAt).toLocaleString()}</span>
          <span>Last Updated: {new Date(failure.updatedAt).toLocaleString()}</span>
          {failure.resolvedAt && (
            <span className="resolved-date">
              Resolved: {new Date(failure.resolvedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FailureDetails;
