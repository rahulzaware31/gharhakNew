import React, { useState, useRef, useEffect } from 'react';
import { ISSUE_CATEGORIES, DOCUMENT_TEMPLATES } from '../data/issues';
import BrandLogo from './BrandLogo';

const TOOLS = [
  { id: 'wizard', label: 'Complaint Wizard', description: 'Step-by-step complaint filing guide', icon: '🧭' },
  { id: 'chat', label: 'AI Legal Advisor', description: 'Get instant legal answers via AI chat', icon: '💬' },
  { id: 'docs', label: 'Document Generator', description: 'Draft legal notices and complaints', icon: '📄' },
  { id: 'byelaw', label: 'Bye-Law Checker', description: 'Check if committee violated bye-laws', icon: '📋' },
  { id: 'rera', label: 'RERA Checker', description: 'Verify RERA registration of a project', icon: '⚖️' },
  { id: 'checklist', label: 'Pre-Purchase Checklist', description: '25-point buyer safety checklist', icon: '✅' },
  { id: 'conveyance', label: 'Conveyance Calculator', description: 'Calculate FSI and conveyance area', icon: '🏛️' },
  { id: 'possession', label: 'Possession Checklist',          description: '33-point checklist before accepting flat', icon: '🔑' },
  { id: 'handover',   label: 'Society Handover Checklist',   description: 'Society checklist before accepting developer handover', icon: '🏘️' },
  { id: 'cases',      label: 'Real Cases',                   description: 'Court judgments and RERA orders won by residents', icon: '🏆' },
  { id: 'awareness',  label: 'Society Awareness',            description: 'Plain-language guides for common society problems', icon: '📣' },
];

const MAIN_LINKS = [
  { id: 'home',   label: 'Home',             icon: '🏠' },
  { id: 'wizard', label: 'Complaint Wizard', icon: '🧭' },
  { id: 'chat',   label: 'AI Advisor',       icon: '💬' },
  { id: 'docs',   label: 'Documents',        icon: '📄' },
];

const MORE_LINKS = [
  { id: 'byelaw',     label: 'Bye-Law Checker',   icon: '📋' },
  { id: 'rera',       label: 'RERA Checker',       icon: '⚖️' },
  { id: 'checklist',  label: 'Buy Checklist',      icon: '✅' },
  { id: 'conveyance', label: 'Conveyance Calc',    icon: '🏛️' },
  { id: 'possession', label: 'Possession List',    icon: '🔑' },
  { id: 'handover',   label: 'Society Handover',   icon: '🏘️' },
  { id: 'cases',      label: 'Real Cases',         icon: '🏆' },
  { id: 'awareness',  label: 'Society Awareness',  icon: '📣' },
];

export default function Navbar({ currentPage, navigate }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Build unified search index
  const searchIndex = [
    ...TOOLS.map(t => ({
      type: 'Tool', icon: t.icon, label: t.label, description: t.description,
      action: () => { navigate(t.id); closeSearch(); },
    })),
    ...ISSUE_CATEGORIES.map(c => ({
      type: 'Issue', icon: c.icon, label: c.title, description: c.description,
      action: () => { navigate('issue', c); closeSearch(); },
    })),
    ...DOCUMENT_TEMPLATES.map(t => ({
      type: 'Document', icon: '📄', label: t.title, description: `${t.authority} document`,
      action: () => { navigate('docs'); closeSearch(); },
    })),
  ];

  const results = searchQuery.trim().length >= 2
    ? searchIndex.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 7)
    : [];

  const closeSearch = () => {
    setSearchActive(false);
    setSearchQuery('');
  };

  const handleNav = (id) => {
    navigate(id);
    setOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchIconClick = () => {
    setSearchActive(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const TYPE_COLORS = { Tool: '#00c896', Issue: '#e74c3c', Document: '#2980b9' };

  return (
    <>
      <nav className="nav">
        <a className="nav-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <BrandLogo />
        </a>

        {/* Desktop nav — only 4 key links */}
        <div className="nav-links">
          {MAIN_LINKS.map(l => (
            <button
              key={l.id}
              className={`nav-link ${currentPage === l.id ? 'active' : ''}`}
              onClick={() => navigate(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="nav-search" ref={searchRef}>
          {searchActive ? (
            <div className="nav-search-box">
              <span className="nav-search-icon-inner">🔍</span>
              <input
                ref={inputRef}
                className="nav-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search issues, documents, tools..."
                onKeyDown={e => e.key === 'Escape' && closeSearch()}
              />
              <button className="nav-search-close" onClick={closeSearch}>✕</button>
              {results.length > 0 && (
                <div className="nav-search-dropdown">
                  {results.map((r, i) => (
                    <button key={i} className="nav-search-result" onClick={r.action}>
                      <span className="nav-search-result-icon">{r.icon}</span>
                      <div className="nav-search-result-text">
                        <div className="nav-search-result-label">{r.label}</div>
                        <div className="nav-search-result-desc">{r.description}</div>
                      </div>
                      <span className="nav-search-result-type" style={{ background: TYPE_COLORS[r.type] + '20', color: TYPE_COLORS[r.type] }}>{r.type}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.trim().length >= 2 && results.length === 0 && (
                <div className="nav-search-dropdown">
                  <div className="nav-search-empty">No results found for "{searchQuery}"</div>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-search-trigger" onClick={handleSearchIconClick} aria-label="Search">
              🔍
            </button>
          )}
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
            <BrandLogo compact />
            <button className="nav-mobile-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Mobile search */}
          <div className="nav-mobile-search">
            <span className="nav-search-icon-inner">🔍</span>
            <input
              className="nav-mobile-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search issues, documents, tools..."
            />
          </div>
          {searchQuery.trim().length >= 2 && (
            <div className="nav-mobile-search-results">
              {results.length > 0 ? results.map((r, i) => (
                <button key={i} className="nav-search-result" onClick={() => { r.action(); setOpen(false); }}>
                  <span className="nav-search-result-icon">{r.icon}</span>
                  <div className="nav-search-result-text">
                    <div className="nav-search-result-label">{r.label}</div>
                    <div className="nav-search-result-desc">{r.description}</div>
                  </div>
                  <span className="nav-search-result-type" style={{ background: TYPE_COLORS[r.type] + '20', color: TYPE_COLORS[r.type] }}>{r.type}</span>
                </button>
              )) : (
                <div className="nav-search-empty">No results found</div>
              )}
            </div>
          )}

          <div className="nav-mobile-links">
            {/* Main section */}
            <div className="nav-mobile-section-label">Main</div>
            {MAIN_LINKS.map(l => (
              <button
                key={l.id}
                className={`nav-mobile-link ${currentPage === l.id ? 'active' : ''}`}
                onClick={() => handleNav(l.id)}
              >
                <span className="nav-mobile-link-icon">{l.icon}</span>
                {l.label}
              </button>
            ))}

            {/* Specialised tools section */}
            <div className="nav-mobile-section-label" style={{ marginTop: 12 }}>Specialised Tools</div>
            {MORE_LINKS.map(l => (
              <button
                key={l.id}
                className={`nav-mobile-link ${currentPage === l.id ? 'active' : ''}`}
                onClick={() => handleNav(l.id)}
              >
                <span className="nav-mobile-link-icon">{l.icon}</span>
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav-mobile-cta">
            <button onClick={() => handleNav('wizard')}>🧭 File Complaint →</button>
          </div>
        </div>
      </div>
    </>
  );
}
