import React from 'react';

export default function Navbar({ currentPage, navigate }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'wizard', label: 'Complaint Wizard' },
    { id: 'chat', label: 'AI Advisor' },
    { id: 'docs', label: 'Draft Documents' },
    { id: 'byelaw', label: 'Bye-Law Checker' },
  ];

  return (
    <nav className="nav">
      <a className="nav-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
        <div className="nav-logo-icon">🏠</div>
        <div className="nav-logo-text">Ghar<span>Hak</span></div>
      </a>
      <div className="nav-links">
        {links.map(l => (
          <button
            key={l.id}
            className={`nav-link ${currentPage === l.id ? 'active' : ''}`}
            onClick={() => navigate(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <button className="nav-cta" onClick={() => navigate('wizard')}>
        File Complaint →
      </button>
    </nav>
  );
}
