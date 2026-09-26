import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const FailureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [failure, setFailure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Attempt Form State
  const [attemptAction, setAttemptAction] = useState('');
  const [attemptResult, setAttemptResult] = useState('');
  const [attemptNotes, setAttemptNotes] = useState('');
  const [attemptSubmitting, setAttemptSubmitting] = useState(false);
  const [attemptError, setAttemptError] = useState('');
  const [attemptSuccess, setAttemptSuccess] = useState('');

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

  useEffect(() => {
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

  const handleAddAttempt = async (e) => {
    e.preventDefault();
    setAttemptError('');
    setAttemptSuccess('');

    if (!attemptAction.trim()) {
      setAttemptError('Please specify the action taken');
      return;
    }
    if (!attemptResult.trim()) {
      setAttemptError('Please specify the outcome/result of the attempt');
      return;
    }

    setAttemptSubmitting(true);
    try {
      const updated = await apiFetch(`/failures/${id}/attempts`, {
        method: 'POST',
        body: JSON.stringify({
          action: attemptAction,
          result: attemptResult,
          notes: attemptNotes
        })
      });
      setFailure(updated);
      setAttemptAction('');
      setAttemptResult('');
      setAttemptNotes('');
      setAttemptSuccess('Debugging attempt logged successfully!');
      setTimeout(() => setAttemptSuccess(''), 3000);
    } catch (err) {
      setAttemptError(err.message || 'Failed to record attempt');
    } finally {
      setAttemptSubmitting(false);
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
      <div className="details-container">
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
        {/* Title & Status Header */}
        <div className="title-row">
          <h1>{failure.title}</h1>
          <span className={`status-pill ${failure.status}`}>
            {failure.status.replace('_', ' ')}
          </span>
        </div>

        {/* Classification Tags */}
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

        {/* Error Message Section */}
        {failure.errorMessage && (
          <div className="detail-section">
            <h3>Error Message / Stack Trace</h3>
            <div className="code-block">
              <pre>{failure.errorMessage}</pre>
            </div>
          </div>
        )}

        {/* Debugging Timeline Section */}
        <div className="detail-section timeline-container">
          <div className="timeline-header">
            <h3>Debugging Timeline ({failure.attempts?.length || 0})</h3>
          </div>

          {failure.attempts && failure.attempts.length > 0 ? (
            <div className="attempts-timeline">
              {failure.attempts.map((attempt, index) => (
                <div key={index} className="attempt-item">
                  <div className="attempt-header">
                    <span className="attempt-number">Attempt #{index + 1}</span>
                    <span className="attempt-time">
                      {new Date(attempt.timestamp || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <p className="attempt-action">
                    <strong>Action:</strong> {attempt.action}
                  </p>
                  <p className="attempt-result">
                    <strong>Result:</strong> {attempt.result}
                  </p>
                  {attempt.notes && (
                    <p className="attempt-notes">
                      <strong>Notes:</strong> {attempt.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="placeholder-text empty-timeline-msg">
              No debugging attempts recorded yet for this failure.
            </p>
          )}

          {/* Form to Log New Attempt */}
          <div className="add-attempt-card">
            <h4>Log Debugging Attempt</h4>
            {attemptError && <div className="alert error">{attemptError}</div>}
            {attemptSuccess && <div className="alert success">{attemptSuccess}</div>}

            <form onSubmit={handleAddAttempt} className="attempt-form">
              <div className="form-group">
                <label htmlFor="attemptAction">
                  Action <span className="required">*</span>
                </label>
                <input
                  id="attemptAction"
                  type="text"
                  placeholder="e.g. Restarted redis service / Updated connection string"
                  value={attemptAction}
                  onChange={(e) => setAttemptAction(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="attemptResult">
                  Result <span className="required">*</span>
                </label>
                <input
                  id="attemptResult"
                  type="text"
                  placeholder="e.g. Error persisted / Threw ECONNREFUSED"
                  value={attemptResult}
                  onChange={(e) => setAttemptResult(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="attemptNotes">Notes (Optional)</label>
                <textarea
                  id="attemptNotes"
                  rows={2}
                  placeholder="Observations or console snippet..."
                  value={attemptNotes}
                  onChange={(e) => setAttemptNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={attemptSubmitting}
              >
                {attemptSubmitting ? 'Logging Attempt...' : '+ Add Debugging Attempt'}
              </button>
            </form>
          </div>
        </div>

        {/* Resolution Section */}
        <div className={`resolution-box-wrapper ${failure.status === 'resolved' ? 'resolved-active' : ''}`}>
          <div className="resolution-header">
            <h3>Resolution</h3>
            {failure.resolvedAt && (
              <span className="resolved-date-badge">
                ✅ Resolved on {new Date(failure.resolvedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="detail-grid">
            <div className="detail-section">
              <span className="box-sublabel">Root Cause</span>
              <div className="content-box">
                {failure.rootCause ? (
                  <p>{failure.rootCause}</p>
                ) : (
                  <p className="placeholder-text">No root cause recorded yet.</p>
                )}
              </div>
            </div>

            <div className="detail-section">
              <span className="box-sublabel">Solution</span>
              <div className="content-box solution-box">
                {failure.solution ? (
                  <p>{failure.solution}</p>
                ) : (
                  <p className="placeholder-text">No solution recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps Footer */}
        <div className="timestamps-footer">
          <span>Created: {new Date(failure.createdAt).toLocaleString()}</span>
          <span>Last Updated: {new Date(failure.updatedAt).toLocaleString()}</span>
          {failure.resolvedAt && (
            <span className="resolved-date">
              Resolved At: {new Date(failure.resolvedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FailureDetails;
