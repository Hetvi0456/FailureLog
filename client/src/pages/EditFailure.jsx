import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const EditFailure = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFailure = async () => {
      try {
        const data = await apiFetch(`/failures/${id}`);
        setFormData({
          title: data.title || '',
          errorMessage: data.errorMessage || '',
          project: data.project || '',
          technology: data.technology || '',
          category: data.category || '',
          environment: data.environment || '',
          status: data.status || 'open',
          rootCause: data.rootCause || '',
          solution: data.solution || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to load failure details');
      } finally {
        setLoading(false);
      }
    };

    fetchFailure();
  }, [id]);

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
      await apiFetch(`/failures/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      navigate(`/failures/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update failure entry');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="form-page-container">
      <div className="page-header">
        <Link to={`/failures/${id}`} className="back-link">
          ← Back to Details
        </Link>
        <h2>Edit Failure Record</h2>
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
              value={formData.solution}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
          <Link to={`/failures/${id}`} className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditFailure;
