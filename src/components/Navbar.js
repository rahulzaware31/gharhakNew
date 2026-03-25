import React, { useState } from 'react';

export default function Navbar({ currentPage, navigate }) {
  const [open, setOpen] = useState(false);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'wizard', label: 'Complaint Wizard' },
    { id: 'chat', label: 'AI Advisor' },
    { id: 'docs', label: 'Draft Documents' },
    { id: 'byelaw', label: 'Bye-Law Checker' },
    { id: 'rera', label: 'RERA Checker' },
    { id: 'checklist', label: 'Buy Checklist' },
    { id: 'conveyance', label: 'Conveyance Calc' },
  ];

  const handleNav = (id) => {
    navigate(id);
    setOpen(false);
  };

  return (
    <>
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
        <button className="nav-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer${open ? ' open' : ''}`}>
        <div className="nav-mobile-overlay" onClick={() => setOpen(false)} />
        <div className="nav-mobile-panel">
          <div className="nav-mobile-header">
            <div className="nav-logo-text" style={{ fontSize: 20 }}>Ghar<span style={{ color: 'var(--teal)' }}>Hak</span></div>
            <button className="nav-mobile-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="nav-mobile-links">
            {links.map(l => (
              <button
                key={l.id}
                className={`nav-mobile-link ${currentPage === l.id ? 'active' : ''}`}
                onClick={() => handleNav(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="nav-mobile-cta">
            <button onClick={() => handleNav('wizard')}>File Complaint →</button>
          </div>
        </div>
      </div>
    </>
  );
}
