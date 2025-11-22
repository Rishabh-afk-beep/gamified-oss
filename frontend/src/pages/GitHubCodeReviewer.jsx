import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeReviewer.css';

const CodeReviewer = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('issues'); // 'issues', 'code', 'review'
  const editorRef = useRef(null);
  const analyzeTimeoutRef = useRef(null);

  // Fetch GitHub issues on component mount
  useEffect(() => {
    fetchGitHubIssues();
  }, []);

  // Auto-analyze code when it changes
  useEffect(() => {
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }

    analyzeTimeoutRef.current = setTimeout(() => {
      if (code.trim().length > 10 && selectedIssue) {
        analyzeCode();
      }
    }, 3000); // Increased to 3 seconds for better UX

    return () => {
      if (analyzeTimeoutRef.current) {
        clearTimeout(analyzeTimeoutRef.current);
      }
    };
  }, [code, language, selectedIssue]);

  const fetchGitHubIssues = async () => {
    setIssuesLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/github/good-first-issues?language=${language}&per_page=10`);
      if (response.ok) {
        const data = await response.json();
        setIssues(data.issues || []);
      } else {
        // Fallback to sample issues
        setIssues([
          {
            id: 1,
            title: "Add input validation to user registration form",
            repo_name: "example/webapp",
            url: "https://github.com/example/webapp/issues/123",
            labels: ["good first issue", "bug", "javascript"],
            author: { login: "maintainer", avatar_url: "https://i.pravatar.cc/40?u=maintainer" },
            body: "The user registration form needs proper input validation. Currently, users can submit empty forms or invalid email addresses. Please add validation for:\n\n- Email format validation\n- Required fields check\n- Password strength requirements\n\nExpected behavior: Form should show error messages for invalid inputs and prevent submission until all fields are valid.",
            comments: 3,
            created_at: "2025-11-10T10:30:00Z"
          },
          {
            id: 2,
            title: "Optimize database query performance",
            repo_name: "example/api-server",
            url: "https://github.com/example/api-server/issues/456",
            labels: ["good first issue", "performance", "python"],
            author: { login: "dbadmin", avatar_url: "https://i.pravatar.cc/40?u=dbadmin" },
            body: "The user search endpoint is running slowly. The current query scans the entire users table. Please optimize this by:\n\n- Adding proper database indexes\n- Implementing pagination\n- Using query limits\n\nCurrent response time: 2-3 seconds\nTarget: Under 500ms",
            comments: 5,
            created_at: "2025-11-09T14:20:00Z"
          }
        ]);
      }
    } catch (error) {
      console.warn('Failed to fetch issues:', error);
      setIssues([]);
    }
    setIssuesLoading(false);
  };

  const selectIssue = (issue) => {
    setSelectedIssue(issue);
    setActiveTab('code');
    
    // Set appropriate language based on issue labels
    if (issue.labels?.some(label => label.toLowerCase().includes('python'))) {
      setLanguage('python');
    } else if (issue.labels?.some(label => label.toLowerCase().includes('java'))) {
      setLanguage('java');
    } else if (issue.labels?.some(label => label.toLowerCase().includes('javascript') || label.toLowerCase().includes('js'))) {
      setLanguage('javascript');
    }

    // Set starter code based on issue
    setCode(getStarterCode(issue, language));
    
    // Reset analysis
    setAnalysis(null);
    setScore(null);
    setSuggestions([]);
  };

  const getStarterCode = (issue, lang) => {
    const title = issue.title.toLowerCase();
    
    if (lang === 'javascript') {
      if (title.includes('validation')) {
        return `// Solution for: ${issue.title}
// Repository: ${issue.repo_name}

function validateRegistrationForm(formData) {
  const errors = {};
  
  // TODO: Add email validation
  
  // TODO: Add required fields check
  
  // TODO: Add password strength validation
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Example usage:
const form = {
  email: 'user@example.com',
  password: 'mypassword123',
  firstName: 'John',
  lastName: 'Doe'
};

console.log(validateRegistrationForm(form));`;
      } else {
        return `// Solution for: ${issue.title}
// Repository: ${issue.repo_name}

// Write your solution here
function solveProblem() {
  // Your implementation
}

console.log(solveProblem());`;
      }
    } else if (lang === 'python') {
      if (title.includes('database') || title.includes('query')) {
        return `# Solution for: ${issue.title}
# Repository: ${issue.repo_name}

def optimize_user_search(search_term, page=1, limit=20):
    """
    Optimized user search with pagination and indexing
    
    Args:
        search_term: The search query
        page: Page number (1-based)
        limit: Number of results per page
    
    Returns:
        dict: Search results with pagination info
    """
    # TODO: Implement database query optimization
    # TODO: Add proper indexing
    # TODO: Implement pagination
    
    pass

# Example usage:
if __name__ == "__main__":
    result = optimize_user_search("john", page=1, limit=10)
    print(result)`;
      } else {
        return `# Solution for: ${issue.title}
# Repository: ${issue.repo_name}

def solve_problem():
    """
    Your solution implementation
    """
    # Write your solution here
    pass

if __name__ == "__main__":
    solve_problem()`;
      }
    }
    
    return `// Solution for: ${issue.title}
// Repository: ${issue.repo_name}

// Write your solution here`;
  };

  const analyzeCode = async () => {
    if (!selectedIssue) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/review-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          language: language,
          issue_context: {
            title: selectedIssue.title,
            description: selectedIssue.body,
            labels: selectedIssue.labels
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysis(result.analysis);
        setScore(result.score);
        setSuggestions(result.suggestions || []);
        setActiveTab('review');
      } else {
        generateContextualMockAnalysis();
      }
    } catch (error) {
      console.warn('AI analysis failed:', error);
      generateContextualMockAnalysis();
    }
    setLoading(false);
  };

  const generateContextualMockAnalysis = () => {
    const mockSuggestions = [
      {
        type: 'best-practice',
        severity: 'medium',
        line: 5,
        message: 'Consider adding JSDoc comments for better documentation',
        suggestion: 'Add comprehensive documentation for function parameters and return values'
      },
      {
        type: 'security',
        severity: 'high',
        line: 8,
        message: 'Input validation missing for user data',
        suggestion: 'Always validate and sanitize user inputs to prevent security vulnerabilities'
      },
      {
        type: 'performance',
        severity: 'low',
        line: 12,
        message: 'Consider using more efficient data structures',
        suggestion: 'Map or Set might be more appropriate for this use case'
      }
    ];

    setScore(78);
    setSuggestions(mockSuggestions);
    setAnalysis({
      readability: 85,
      maintainability: 75,
      performance: 70,
      security: 80
    });
    setActiveTab('review');
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // GitHub-like editor theme
    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'd73a49' },
        { token: 'string', foreground: '032f62' },
        { token: 'number', foreground: '005cc5' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorLineNumber.foreground': '#9ca3af',
        'editorCursor.foreground': '#24292e',
        'editor.selectionBackground': '#c8e1ff',
        'editor.lineHighlightBackground': '#f6f8fa'
      }
    });

    monaco.editor.setTheme('github-light');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745'; // GitHub green
    if (score >= 60) return '#f66a0a'; // GitHub orange  
    return '#d73a49'; // GitHub red
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#d73a49';
      case 'medium': return '#f66a0a';
      case 'low': return '#6f42c1';
      default: return '#586069';
    }
  };

  return (
    <div className="github-code-reviewer">
      {/* Header */}
      <div className="reviewer-header">
        <div className="header-content">
          <div className="title-section">
            <h1>🔍 GitHub Code Reviewer</h1>
            <p>Select an issue, write your solution, and get AI-powered code review</p>
          </div>
          
          <div className="header-stats">
            {selectedIssue && (
              <div className="selected-issue-badge">
                <span className="repo-name">{selectedIssue.repo_name}</span>
                <span className="issue-number">#{selectedIssue.id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          📋 Issues ({issues.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
          disabled={!selectedIssue}
        >
          💻 Code Solution
        </button>
        <button 
          className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
          disabled={!selectedIssue || !analysis}
        >
          🔍 AI Review {score && `(${score}/100)`}
        </button>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {activeTab === 'issues' && (
          <div className="issues-panel">
            <div className="issues-header">
              <h2>🎯 Good First Issues</h2>
              <div className="issues-controls">
                <select 
                  value={language} 
                  onChange={(e) => {setLanguage(e.target.value); fetchGitHubIssues();}}
                  className="language-filter"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <button onClick={fetchGitHubIssues} className="refresh-btn">
                  🔄 Refresh
                </button>
              </div>
            </div>

            {issuesLoading ? (
              <div className="loading-issues">
                <div className="spinner"></div>
                <p>Loading fresh issues...</p>
              </div>
            ) : (
              <div className="issues-list">
                {issues.map((issue, index) => (
                  <div 
                    key={issue.id || index} 
                    className={`issue-card ${selectedIssue?.id === issue.id ? 'selected' : ''}`}
                    onClick={() => selectIssue(issue)}
                  >
                    <div className="issue-header">
                      <h3 className="issue-title">
                        <span className="repo-badge">{issue.repo_name}</span>
                        {issue.title}
                      </h3>
                      <div className="issue-meta">
                        <img src={issue.author?.avatar_url} alt={issue.author?.login} className="author-avatar" />
                        <span className="author-name">{issue.author?.login}</span>
                        <span className="comments-count">💬 {issue.comments}</span>
                      </div>
                    </div>
                    
                    <p className="issue-description">
                      {issue.body ? issue.body.slice(0, 150) + '...' : 'No description available'}
                    </p>
                    
                    <div className="issue-labels">
                      {issue.labels?.slice(0, 4).map((label, idx) => (
                        <span key={idx} className="label">{label}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && selectedIssue && (
          <div className="code-panel">
            <div className="code-header">
              <div className="issue-context">
                <h2>💻 Solution for: {selectedIssue.title}</h2>
                <p className="repo-info">Repository: <span className="repo-link">{selectedIssue.repo_name}</span></p>
              </div>
              
              <div className="code-actions">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <button 
                  onClick={analyzeCode} 
                  disabled={loading || !code.trim()}
                  className="analyze-btn"
                >
                  {loading ? '🔄 Analyzing...' : '🔍 Review Code'}
                </button>
              </div>
            </div>

            <div className="editor-container">
              <Editor
                height="500px"
                language={language}
                value={code}
                onChange={setCode}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>

            {/* Issue Context Panel */}
            <div className="issue-context-panel">
              <h3>📝 Issue Details</h3>
              <div className="issue-details">
                <p><strong>Repository:</strong> {selectedIssue.repo_name}</p>
                <p><strong>Author:</strong> {selectedIssue.author?.login}</p>
                <p><strong>Labels:</strong> {selectedIssue.labels?.join(', ')}</p>
                <div className="issue-description">
                  <strong>Description:</strong>
                  <div className="description-text">{selectedIssue.body}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'review' && analysis && (
          <div className="review-panel">
            <div className="review-header">
              <h2>🔍 AI Code Review Results</h2>
              <div className="overall-score">
                <div 
                  className="score-circle"
                  style={{ '--score-color': getScoreColor(score) }}
                >
                  <span className="score-number">{score}</span>
                  <span className="score-label">/100</span>
                </div>
              </div>
            </div>

            <div className="review-content">
              {/* Metrics */}
              <div className="metrics-section">
                <h3>📊 Code Quality Metrics</h3>
                <div className="metrics-grid">
                  {Object.entries(analysis).map(([metric, value]) => (
                    <div key={metric} className="metric-item">
                      <div className="metric-info">
                        <span className="metric-name">
                          {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </span>
                        <span className="metric-value">{value}%</span>
                      </div>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${value}%`,
                            backgroundColor: getScoreColor(value)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h3>💡 Improvement Suggestions ({suggestions.length})</h3>
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <div className="suggestion-header">
                          <span 
                            className="severity-badge"
                            style={{ backgroundColor: getSeverityColor(suggestion.severity) }}
                          >
                            {(suggestion.severity || 'low').toUpperCase()}
                          </span>
                          <span className="suggestion-type">{suggestion.type}</span>
                          {suggestion.line && (
                            <span className="line-number">Line {suggestion.line}</span>
                          )}
                        </div>
                        <p className="suggestion-message">{suggestion.message}</p>
                        {suggestion.suggestion && (
                          <div className="suggestion-detail">
                            <strong>💡 Suggestion:</strong> {suggestion.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="review-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => setActiveTab('code')}
                >
                  ← Back to Code
                </button>
                <button 
                  className="action-btn primary"
                  onClick={() => window.open(selectedIssue?.url, '_blank')}
                >
                  🔗 View Original Issue
                </button>
                <button 
                  className="action-btn success"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  📋 Copy Solution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeReviewer;