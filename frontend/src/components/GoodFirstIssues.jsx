import React, { useEffect, useState } from 'react';
import './GoodFirstIssues.css';

const SAMPLE_ISSUES = [
  {
    id: 's1',
    title: 'Add CONTRIBUTING.md for newcomers',
    repo: 'example/repo-one',
    url: 'https://github.com/example/repo-one/issues/12',
    labels: ['documentation', 'good first issue', 'help wanted'],
    author: { login: 'alice', avatar_url: 'https://i.pravatar.cc/40?u=alice' },
    comments: 2,
    created_at: '2025-11-01',
    body: 'We need a comprehensive contributing guide to help newcomers get started with the project...'
  },
  {
    id: 's2',
    title: 'Fix off-by-one error in array helper function',
    repo: 'example/repo-two',
    url: 'https://github.com/example/repo-two/issues/33',
    labels: ['javascript', 'good first issue', 'bug'],
    author: { login: 'bob', avatar_url: 'https://i.pravatar.cc/40?u=bob' },
    comments: 5,
    created_at: '2025-10-25',
    body: 'There\'s a small off-by-one error in the array utility function that needs fixing...'
  },
  {
    id: 's3',
    title: 'Add TypeScript definitions for API responses',
    repo: 'example/typescript-project',
    url: 'https://github.com/example/typescript-project/issues/45',
    labels: ['typescript', 'good first issue', 'enhancement'],
    author: { login: 'charlie', avatar_url: 'https://i.pravatar.cc/40?u=charlie' },
    comments: 1,
    created_at: '2025-11-05',
    body: 'We need proper TypeScript definitions for our API response objects...'
  }
];

function IssueCard({ issue, onSave, isSaved }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLabelsColors = (labels) => {
    const colorMap = {
      'good first issue': '#22c55e',
      'help wanted': '#3b82f6',
      'bug': '#ef4444',
      'enhancement': '#8b5cf6',
      'documentation': '#f59e0b',
      'javascript': '#f7df1e',
      'typescript': '#3178c6',
      'python': '#3776ab',
      'rust': '#ce422b',
      'go': '#00add8'
    };
    
    return labels.map(label => ({
      name: label,
      color: colorMap[label.toLowerCase()] || '#6b7280'
    }));
  };

  return (
    <div className="modern-issue-card">
      <div className="card-header">
        <div className="issue-meta">
          <div className="author-info">
            <img 
              src={issue.author?.avatar_url || 'https://i.pravatar.cc/40'} 
              alt={issue.author?.login || 'User'} 
              className="author-avatar"
            />
            <div className="author-details">
              <span className="author-name">{issue.author?.login}</span>
              <span className="issue-date">{formatDate(issue.created_at)}</span>
            </div>
          </div>
          <div className="issue-stats">
            <div className="stat">
              <span className="stat-icon">💬</span>
              <span>{issue.comments}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-content">
        <h3 className="issue-title">{issue.title}</h3>
        
        <div className="repo-info">
          <span className="repo-icon">📁</span>
          <span className="repo-name">{issue.repo}</span>
        </div>

        {issue.body && isExpanded && (
          <div className="issue-description">
            {issue.body.slice(0, 150)}
            {issue.body.length > 150 && '...'}
          </div>
        )}

        <div className="labels-container">
          {getLabelsColors(issue.labels?.slice(0, 4) || []).map((label, idx) => (
            <span 
              key={idx} 
              className="modern-label" 
              style={{ backgroundColor: label.color + '20', color: label.color, borderColor: label.color + '40' }}
            >
              {label.name}
            </span>
          ))}
          {(issue.labels?.length || 0) > 4 && (
            <span className="more-labels">+{issue.labels.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="action-btn secondary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '📄 Less' : '📖 More'}
        </button>
        
        <button 
          className={`action-btn ${isSaved ? 'saved' : 'save'}`}
          onClick={() => onSave(issue)}
        >
          {isSaved ? '⭐ Saved' : '🔖 Save'}
        </button>
        
        <a 
          className="action-btn primary"
          href={issue.url} 
          target="_blank" 
          rel="noreferrer"
        >
          🚀 Open Issue
        </a>
      </div>
    </div>
  );
}

export default function GoodFirstIssues() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchIssues();
  }, [category]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      // Use our authenticated backend endpoint
      const params = new URLSearchParams();
      if (category && category !== 'All') {
        params.append('language', category);
      }
      if (query.trim()) {
        params.append('query', query.trim());
      }
      params.append('per_page', '20');

      const backendUrl = `http://localhost:8000/api/v1/github/good-first-issues?${params}`;
      
      try {
        console.log('🔍 Fetching from authenticated backend:', { category, query: query.trim() });
        const resp = await fetch(backendUrl);
        const data = await resp.json();
        
        if (data.error) {
          console.warn('Backend API error:', data.error);
          throw new Error(data.error);
        }
        
        const items = (data.issues || []).map(it => ({
          id: it.id,
          title: it.title,
          repo: it.repo_name,
          url: it.url,
          labels: it.labels || [],
          author: it.author,
          comments: it.comments,
          created_at: it.created_at,
          body: it.body
        }));
        
        console.log(`✅ Got ${items.length} issues from authenticated backend`);
        setIssues(items.length > 0 ? items : SAMPLE_ISSUES);
        return;
        
      } catch (backendError) {
        console.warn('Authenticated backend failed, using sample data:', backendError.message);
        setIssues(SAMPLE_ISSUES);
      }
      
    } catch (err) {
      console.warn('All sources failed, using sample data:', err.message);
      setIssues(SAMPLE_ISSUES);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (issue) => {
    setSaved(prev => {
      const exists = prev.find(i => i.id === issue.id);
      if (exists) {
        return prev.filter(i => i.id !== issue.id);
      }
      return [issue, ...prev];
    });
  };

  const categories = [
    { name: 'All', icon: '🌐', color: '#6b7280' },
    { name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
    { name: 'Python', icon: '🐍', color: '#3776ab' },
    { name: 'Rust', icon: '🦀', color: '#ce422b' },
    { name: 'Go', icon: '🐹', color: '#00add8' },
    { name: 'Documentation', icon: '📚', color: '#f59e0b' }
  ];

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(query.toLowerCase()) ||
    issue.repo.toLowerCase().includes(query.toLowerCase()) ||
    (issue.labels || []).some(label => 
      label.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="modern-gfi-root">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🎯</span>
            Good First Issues
          </h1>
          <p className="page-subtitle">
            Discover beginner-friendly issues across languages and repositories
          </p>
        </div>
        
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ▦
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              className="modern-search"
              placeholder="Search issues, repositories, or technologies..." 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && fetchIssues()}
            />
          </div>
          <button className="search-btn" onClick={fetchIssues}>
            Search
          </button>
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat.name} 
              className={`category-chip ${category === cat.name ? 'active' : ''}`}
              onClick={() => setCategory(cat.name)}
              style={{
                '--category-color': cat.color,
                backgroundColor: category === cat.name ? cat.color + '20' : 'transparent',
                borderColor: category === cat.name ? cat.color : '#e5e7eb',
                color: category === cat.name ? cat.color : '#6b7280'
              }}
            >
              <span className="chip-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              {loading ? 'Loading...' : `${filteredIssues.length} issues found`}
            </span>
            {category !== 'All' && (
              <span className="active-filter">
                Filtered by: <strong>{category}</strong>
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Finding the perfect issues for you...</p>
          </div>
        ) : (
          <div className={`issues-container ${viewMode}`}>
            {filteredIssues.map(issue => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                onSave={handleSave}
                isSaved={saved.some(s => s.id === issue.id)}
              />
            ))}
            
            {filteredIssues.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No issues found</h3>
                <p>Try adjusting your search terms or category filter</p>
                <button className="retry-btn" onClick={() => {setQuery(''); setCategory('All'); fetchIssues();}}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {saved.length > 0 && (
        <div className="saved-section">
          <div className="saved-header">
            <h3>
              <span className="saved-icon">⭐</span>
              Saved Issues ({saved.length})
            </h3>
            <button 
              className="clear-saved"
              onClick={() => setSaved([])}
            >
              Clear All
            </button>
          </div>
          
          <div className="saved-list">
            {saved.map(issue => (
              <div key={issue.id} className="saved-item">
                <div className="saved-info">
                  <a href={issue.url} target="_blank" rel="noreferrer" className="saved-title">
                    {issue.title}
                  </a>
                  <span className="saved-repo">{issue.repo}</span>
                </div>
                <button 
                  className="remove-saved"
                  onClick={() => handleSave(issue)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
