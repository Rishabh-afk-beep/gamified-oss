import React, { useState } from 'react';
import './GitHubIntegration.css';
import GoodFirstIssues from '../components/GoodFirstIssues';

export default function GitHubIntegration() {
  // Keep the old quick-profile UI for power users but show Good First Issues by default
  const [showProfileControls, setShowProfileControls] = useState(false);

  return (
    <div className="gh-page">
      <header className="gh-header">
        <div className="gh-title">GitHub — Good First Issues</div>
        <div className="gh-sub">Discover beginner-friendly issues across languages and repositories</div>
        <div className="gh-actions">
          <button className="btn ghost" onClick={() => setShowProfileControls(s => !s)}>
            {showProfileControls ? 'Hide' : 'Profile'}
          </button>
        </div>
      </header>

      <main className="gh-main">
        <aside className="gh-left">
          <div className="panel">
            <h4>Filters</h4>
            <p className="muted">Choose a language category or search by keyword.</p>
            <ul className="gh-categories">
              <li>All</li>
              <li>JavaScript</li>
              <li>Python</li>
              <li>Rust</li>
              <li>Go</li>
              <li>Documentation</li>
            </ul>
          </div>
          <div className="panel small-note">
            Tip: Click "Open" to jump to the issue on GitHub. Use the star to save locally.
          </div>
        </aside>

        <section className="gh-content">
          <GoodFirstIssues />
        </section>

        <aside className="gh-right">
          {showProfileControls && (
            <div className="panel">
              <h4>Legacy Controls</h4>
              <p className="muted">Profile & tracking (kept for compatibility)</p>
              {/* kept intentionally simple - backend endpoints available */}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
