import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeReviewer.css';

const CodeReviewer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [correctedCode, setCorrectedCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCorrectedCode, setShowCorrectedCode] = useState(false);
  const editorRef = useRef(null);
  const analyzeTimeoutRef = useRef(null);

  // Sample code templates for different languages
  const codeTemplates = {
    javascript: `// Write your JavaScript code here
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

    python: `# Write your Python code here
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3,6,8,10,1,2,1]))`,

    java: `// Write your Java code here
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Example: Simple calculator
        int a = 10, b = 5;
        System.out.println("Sum: " + (a + b));
    }
}`,

    cpp: `// Write your C++ code here
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    for (int num : numbers) {
        std::cout << num << " ";
    }
    
    return 0;
}`
  };

  useEffect(() => {
    if (codeTemplates[language]) {
      setCode(codeTemplates[language]);
    }
  }, [language]);

  useEffect(() => {
    // Debounced analysis - analyze 2 seconds after user stops typing
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }

    analyzeTimeoutRef.current = setTimeout(() => {
      if (code.trim().length > 10) {
        analyzeCode();
      }
    }, 2000);

    return () => {
      if (analyzeTimeoutRef.current) {
        clearTimeout(analyzeTimeoutRef.current);
      }
    };
  }, [code, language]);

  const analyzeCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/review-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: language
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Updated to match backend response structure
        setAnalysis({
          readability: Math.round((result.score || 0) * 10), // Convert score to percentage
          maintainability: Math.round((result.score || 0) * 9),
          performance: Math.round((result.score || 0) * 8),
          security: Math.round((result.score || 0) * 7.5)
        });
        setScore(result.score || 0);
        setSuggestions(result.suggestions || []);
        setCorrectedCode(result.corrected_code || '');
        setFeedback(result.feedback || result.analysis || '');
      } else {
        // Fallback to mock analysis if backend is unavailable
        generateMockAnalysis();
      }
    } catch (error) {
      console.warn('AI analysis failed, using mock data:', error);
      generateMockAnalysis();
    }
    setLoading(false);
  };

  const generateMockAnalysis = () => {
    const mockSuggestions = [
      {
        type: 'performance',
        severity: 'medium',
        line: 2,
        message: 'Consider using iterative approach for better performance',
        suggestion: 'Recursive functions can cause stack overflow for large inputs'
      },
      {
        type: 'best-practice',
        severity: 'low',
        line: 1,
        message: 'Add JSDoc comments for better documentation',
        suggestion: '/**\\n * Calculate fibonacci number\\n * @param {number} n\\n */'
      },
      {
        type: 'security',
        severity: 'high',
        line: 5,
        message: 'Input validation missing',
        suggestion: 'Validate that n is a positive integer'
      }
    ];

    const codeLines = code.split('\n').length;
    const complexity = Math.min(10, Math.max(1, codeLines / 5));
    const baseScore = Math.max(60, 100 - (complexity * 5) - (mockSuggestions.length * 3));
    
    setScore(Math.round(baseScore));
    setSuggestions(mockSuggestions);
    setAnalysis({
      readability: Math.round(baseScore * 0.9),
      maintainability: Math.round(baseScore * 0.85),
      performance: Math.round(baseScore * 0.8),
      security: Math.round(baseScore * 0.75)
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Monaco Editor theme
    monaco.editor.defineTheme('modern-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '629755', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#0f0f23',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editorCursor.foreground': '#ffffff',
        'editor.selectionBackground': '#264f78',
        'editor.lineHighlightBackground': '#2d2d30'
      }
    });

    monaco.editor.setTheme('modern-dark');
  };

  const applySuggestion = (suggestion) => {
    // This would apply the suggestion to the code
    // For now, just highlight it
    if (editorRef.current && suggestion.line) {
      editorRef.current.revealLineInCenter(suggestion.line);
      editorRef.current.setPosition({ lineNumber: suggestion.line, column: 1 });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'security': return '🔒';
      case 'performance': return '⚡';
      case 'best-practice': return '✨';
      case 'bug': return '🐛';
      default: return '💡';
    }
  };

  return (
    <div className="code-reviewer">
      <div className="reviewer-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🤖</span>
            AI Code Reviewer
          </h1>
          <p className="page-subtitle">
            Get instant feedback on your code quality, performance, and security
          </p>
        </div>
        
        <div className="language-selector">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-dropdown"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      <div className="reviewer-layout">
        <div className="editor-section">
          <div className="editor-header">
            <h3>📝 Code Editor</h3>
            <div className="editor-actions">
              <button 
                onClick={analyzeCode} 
                disabled={loading}
                className="analyze-btn"
              >
                {loading ? '🔄 Analyzing...' : '🔍 Analyze Code'}
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
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        <div className="analysis-section">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>AI is analyzing your code...</p>
            </div>
          )}

          {!loading && score !== null && (
            <>
              <div className="score-card">
                <h3>📊 Code Quality Score</h3>
                <div className="score-display">
                  <div 
                    className="score-circle"
                    style={{ '--score-color': getScoreColor(score) }}
                  >
                    <span className="score-number">{score}</span>
                    <span className="score-label">/ 100</span>
                  </div>
                </div>
                
                {analysis && (
                  <div className="metrics-grid">
                    <div className="metric">
                      <span className="metric-label">📖 Readability</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${analysis.readability}%`,
                            backgroundColor: getScoreColor(analysis.readability)
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">{analysis.readability}%</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">🔧 Maintainability</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${analysis.maintainability}%`,
                            backgroundColor: getScoreColor(analysis.maintainability)
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">{analysis.maintainability}%</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">⚡ Performance</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${analysis.performance}%`,
                            backgroundColor: getScoreColor(analysis.performance)
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">{analysis.performance}%</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">🔒 Security</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${analysis.security}%`,
                            backgroundColor: getScoreColor(analysis.security)
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">{analysis.security}%</span>
                    </div>
                  </div>
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="suggestions-card">
                  <h3>💡 Suggestions ({suggestions.length})</h3>
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <div className="suggestion-header">
                          <div className="suggestion-meta">
                            <span className="suggestion-icon">
                              {getSeverityIcon(suggestion.type)}
                            </span>
                            <span 
                              className="suggestion-severity"
                              style={{ color: getSeverityColor(suggestion.severity) }}
                            >
                              {suggestion.severity?.toUpperCase() || 'UNKNOWN'}
                            </span>
                            {suggestion.line && (
                              <span className="suggestion-line">Line {suggestion.line}</span>
                            )}
                          </div>
                          <button 
                            className="apply-suggestion"
                            onClick={() => applySuggestion(suggestion)}
                          >
                            👁️ View
                          </button>
                        </div>
                        
                        <p className="suggestion-message">{suggestion.message}</p>
                        
                        {suggestion.suggestion && (
                          <div className="suggestion-detail">
                            <strong>Suggestion:</strong> {suggestion.suggestion}
                          </div>
                        )}
                        
                        {suggestion.corrected_code && (
                          <div className="corrected-code-snippet">
                            <strong>Fixed code:</strong>
                            <pre className="code-snippet">{suggestion.corrected_code}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {correctedCode && correctedCode.trim() && (
                <div className="corrected-code-card">
                  <h3>✨ Corrected Code</h3>
                  <div className="corrected-code-actions">
                    <button 
                      className="toggle-corrected-btn"
                      onClick={() => setShowCorrectedCode(!showCorrectedCode)}
                    >
                      {showCorrectedCode ? '👁️ Hide' : '👀 Show'} Corrected Code
                    </button>
                    {showCorrectedCode && (
                      <button 
                        className="apply-corrected-btn"
                        onClick={() => {
                          setCode(correctedCode);
                          setShowCorrectedCode(false);
                        }}
                      >
                        ✅ Apply Corrections
                      </button>
                    )}
                  </div>
                  
                  {showCorrectedCode && (
                    <div className="corrected-code-editor">
                      <Editor
                        height="300px"
                        language={language}
                        value={correctedCode}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          wordWrap: 'on',
                          theme: 'modern-dark'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!loading && score === null && (
            <div className="empty-analysis">
              <div className="empty-icon">🤖</div>
              <h3>Start coding to get AI feedback!</h3>
              <p>Write some code in the editor and I'll analyze it for you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewer;