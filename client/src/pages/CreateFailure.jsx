import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const CreateFailure = () => {
  const [formData, setFormData] = useState({
    title: '',
    errorMessage: '',
    project: '',
    technology: '',
    category: '',
    environment: '',
    status: 'open',
    rootCause: '',
    solution: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    try {
      const created = await apiFetch('/failures', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      navigate(`/failures/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create failure entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h2>Log New Failure</h2>
      </div>

      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit} className="failure-form">
        <div className="form-section">
          <h3>Failure Summary</h3>

          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. MongoDB connection timeout in production"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="errorMessage">Error Message / Stack Trace</label>
            <textarea
              id="errorMessage"
              name="errorMessage"
              rows={4}
              placeholder="Paste raw error message or console logs here..."
              value={formData.errorMessage}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Context & Classification</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="project">Project</label>
              <input
                id="project"
                name="project"
                type="text"
                placeholder="e.g. FailureLog"
                value={formData.project}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="technology">Technology Stack</label>
              <input
                id="technology"
                name="technology"
                type="text"
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.technology}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                placeholder="e.g. Database, Auth, Build, Runtime"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="environment">Environment</label>
              <input
                id="environment"
                name="environment"
                type="text"
                placeholder="e.g. Local Dev, Staging, Windows 11"
                value={formData.environment}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Resolution Details</h3>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rootCause">Root Cause</label>
            <textarea
              id="rootCause"
              name="rootCause"
              rows={3}
              placeholder="Why did this failure happen? (Can be updated later)"
              value={formData.rootCause}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="solution">Definitive Solution</label>
            <textarea
              id="solution"
              name="solution"
              rows={3}
              placeholder="What worked to solve this? (Can be updated later)"
              value={formData.solution}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving Failure...' : 'Create Failure Log'}
          </button>
          <Link to="/dashboard" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateFailure;
