import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const Dashboard = () => {
  // All user failures (used exclusively for overall account metrics)
  const [allFailures, setAllFailures] = useState([]);
  // Filtered failures (displayed in the list below metrics)
  const [filteredFailures, setFilteredFailures] = useState([]);

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // 1. Fetch all user failures once to calculate overall summary metrics
  const fetchAllFailures = async () => {
    setLoadingMetrics(true);
    try {
      const data = await apiFetch('/failures');
      setAllFailures(data);
    } catch (err) {
      setError(err.message || 'Failed to load overall metrics');
    } finally {
      setLoadingMetrics(false);
    }
  };

  // 2. Fetch filtered failures from backend based on query controls
  const fetchFilteredFailures = async () => {
    setLoadingList(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (statusFilter) params.append('status', statusFilter);
      if (projectFilter) params.append('project', projectFilter);
      if (techFilter) params.append('technology', techFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch(`/failures${queryString}`);
      setFilteredFailures(data);
    } catch (err) {
      setError(err.message || 'Failed to search/filter failures');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAllFailures();
  }, []);

  useEffect(() => {
    fetchFilteredFailures();
  }, [searchQuery, statusFilter, projectFilter, techFilter, categoryFilter]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await apiFetch(`/failures/${id}`, { method: 'DELETE' });
      setAllFailures((prev) => prev.filter((f) => f._id !== id));
      setFilteredFailures((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete failure');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setProjectFilter('');
    setTechFilter('');
    setCategoryFilter('');
  };

  // Compute Overall Account Metrics from ALL failures (unaffected by filters)
  const totalFailures = allFailures.length;
  const openFailures = allFailures.filter((f) => f.status === 'open').length;
  const inProgressFailures = allFailures.filter((f) => f.status === 'in_progress').length;
  const resolvedFailures = allFailures.filter((f) => f.status === 'resolved').length;
  const resolutionRate = totalFailures > 0 ? Math.round((resolvedFailures / totalFailures) * 100) : 0;

  // Compute unique filter dropdown options from all failures
  const projectOptions = useMemo(() => {
    const set = new Set(allFailures.map((f) => f.project).filter(Boolean));
    return Array.from(set);
  }, [allFailures]);

  const techOptions = useMemo(() => {
    const set = new Set(allFailures.map((f) => f.technology).filter(Boolean));
    return Array.from(set);
  }, [allFailures]);

  const categoryOptions = useMemo(() => {
    const set = new Set(allFailures.map((f) => f.category).filter(Boolean));
    return Array.from(set);
  }, [allFailures]);

  // Compute Top Technologies & Top Categories summary lists
  const topTechnologies = useMemo(() => {
    const counts = {};
    allFailures.forEach((f) => {
      if (f.technology) {
        counts[f.technology] = (counts[f.technology] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [allFailures]);

  const topCategories = useMemo(() => {
    const counts = {};
    allFailures.forEach((f) => {
      if (f.category) {
        counts[f.category] = (counts[f.category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [allFailures]);

  const isFilterActive = searchQuery || statusFilter || projectFilter || techFilter || categoryFilter;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Debugging Dashboard</h2>
          <p className="subtitle">Overview of your recorded failures & debugging memory</p>
        </div>
        <Link to="/failures/new" className="btn-primary">
          + Log New Failure
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Overall Account Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Failures</span>
          <span className="metric-value">{loadingMetrics ? '-' : totalFailures}</span>
        </div>
        <div className="metric-card open">
          <span className="metric-label">Open</span>
          <span className="metric-value">{loadingMetrics ? '-' : openFailures}</span>
        </div>
        <div className="metric-card in-progress">
          <span className="metric-label">In Progress</span>
          <span className="metric-value">{loadingMetrics ? '-' : inProgressFailures}</span>
        </div>
        <div className="metric-card resolved">
          <span className="metric-label">Resolved</span>
          <span className="metric-value">{loadingMetrics ? '-' : resolvedFailures}</span>
        </div>
        <div className="metric-card rate">
          <span className="metric-label">Resolution Rate</span>
          <span className="metric-value">{loadingMetrics ? '-' : `${resolutionRate}%`}</span>
        </div>
      </div>

      {/* Analytics Breakdown Row */}
      {(topTechnologies.length > 0 || topCategories.length > 0) && (
        <div className="stats-breakdown-row">
          {topTechnologies.length > 0 && (
            <div className="breakdown-card">
              <span className="breakdown-title">Top Technologies</span>
              <div className="chip-group">
                {topTechnologies.map(([tech, count]) => (
                  <span key={tech} className="stat-chip tech" onClick={() => setTechFilter(tech)}>
                    {tech} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {topCategories.length > 0 && (
            <div className="breakdown-card">
              <span className="breakdown-title">Top Categories</span>
              <div className="chip-group">
                {topCategories.map(([cat, count]) => (
                  <span key={cat} className="stat-chip category" onClick={() => setCategoryFilter(cat)}>
                    {cat} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls Bar: Search & Filters */}
      <div className="controls-card">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search title, error message, project, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="">All Projects</option>
            {projectOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select value={techFilter} onChange={(e) => setTechFilter(e.target.value)}>
            <option value="">All Technologies</option>
            {techOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {isFilterActive && (
            <button onClick={handleClearFilters} className="btn-sm outline clear-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Failures List Header */}
      <div className="section-title list-header">
        <h3>
          {isFilterActive
            ? `Matching Failures (${filteredFailures.length})`
            : `Recent Failures (${filteredFailures.length})`}
        </h3>
      </div>

      {/* Failures List */}
      {loadingList ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading failures list...</p>
        </div>
      ) : filteredFailures.length === 0 ? (
        <div className="empty-state">
          {isFilterActive ? (
            <>
              <p>No failure entries match your active search or filters.</p>
              <button onClick={handleClearFilters} className="btn-secondary">
                Reset Filters
              </button>
            </>
          ) : (
            <>
              <p>No failure entries logged yet.</p>
              <Link to="/failures/new" className="btn-secondary">
                Log your first failure
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="failures-list">
          {filteredFailures.map((failure) => (
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
                  <code>
                    {failure.errorMessage.slice(0, 150)}
                    {failure.errorMessage.length > 150 ? '...' : ''}
                  </code>
                </div>
              )}

              <div className="failure-footer">
                <span className="date-info">
                  Logged: {new Date(failure.createdAt).toLocaleDateString()}
                  {failure.attempts && failure.attempts.length > 0 && (
                    <span className="attempts-count-badge">
                      • {failure.attempts.length} {failure.attempts.length === 1 ? 'attempt' : 'attempts'}
                    </span>
                  )}
                </span>
                <div className="action-buttons">
                  <Link to={`/failures/${failure._id}`} className="btn-sm outline">
                    View Details
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
