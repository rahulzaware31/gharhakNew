import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES } from '../data/issues';

export default function HomePage({ navigate }) {
  const { setSelectedIssue } = useContext(AppContext);
  const [showAllSecondary, setShowAllSecondary] = useState(false);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate('issue', issue);
  };

  const primaryTools = [
    { id: 'wizard', icon: '🧭', label: 'Best for most people', title: 'Complaint Wizard', desc: 'Answer 5 quick questions and get a personalised, law-cited action plan — exactly which authority to approach and in what order.', cta: 'Start Wizard →', color: 'var(--teal)' },
    { id: 'chat',   icon: '🤖', label: 'Ask anything',         title: 'AI Legal Advisor',  desc: 'Describe your problem in plain English or Marathi. Get instant guidance on applicable laws and next steps.', cta: 'Chat Now →', color: '#6366f1' },
    { id: 'docs',   icon: '📄', label: 'Ready-to-send',        title: 'Document Generator',desc: 'Generate legal notices, RTI applications, RERA complaints, and PMC/DDR letters — fill details once, get a formatted document.', cta: 'Browse Templates →', color: '#f59e0b' },
  ];

  const secondaryTools = [
    { id: 'byelaw',     icon: '📋', title: 'Bye-Law Checker',            desc: 'Check if your MC violated society bye-laws' },
    { id: 'rera',       icon: '⚖️', title: 'RERA Checker',               desc: 'Verify builder registration on MahaRERA' },
    { id: 'checklist',  icon: '✅', title: 'Buyer Checklist',            desc: '25 points to verify before buying a flat' },
    { id: 'conveyance', icon: '📐', title: 'Conveyance Calc',            desc: "Calculate your society's land entitlement" },
    { id: 'possession', icon: '🔑', title: 'Possession Checklist',       desc: 'Verify before accepting flat possession' },
    { id: 'cases',      icon: '🏆', title: 'Real Cases',                 desc: 'Court judgments and RERA orders won by residents' },
    { id: 'awareness',  icon: '📣', title: 'Society Awareness',          desc: 'Plain-language guides for 10 common society problems' },
  ];

  const VISIBLE_COUNT = 4;
  const visibleTools  = showAllSecondary ? secondaryTools : secondaryTools.slice(0, VISIBLE_COUNT);
  const hiddenCount   = secondaryTools.length - VISIBLE_COUNT;

  const CHIPS = [
    { icon: '🏛️', label: 'Conveyance Deed',     color: '#e74c3c' },
    { icon: '⚖️', label: 'RERA Complaint',       color: '#2980b9' },
    { icon: '📋', label: 'OC Pending',           color: '#27ae60' },
    { icon: '🚗', label: 'Parking Rights',       color: '#f39c12' },
    { icon: '🔧', label: 'Maintenance Dispute',  color: '#8e44ad' },
    { icon: '🚧', label: 'Illegal Construction', color: '#c0392b' },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero">

        {/* Glow orbs */}
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />

        <div className="hero-grid">

          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-badge">
              🇮🇳 Maharashtra Housing Rights · निःशुल्क सेवा
            </div>

            <h1 className="hero-h1">
              Know Your<br />
              <span className="hero-h1-accent">Housing Rights</span>
            </h1>

            <p className="hero-mr mr">घरमालकांचे हक्क जाणा, न्याय मागा</p>

            <p className="hero-sub">
              Free guidance for Maharashtra flat owners — AI advice, complaint wizard,
              and ready-to-use legal documents in English and Marathi.
            </p>

            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => navigate('wizard')}>
                🧭 Start Complaint Wizard
              </button>
              <button className="hero-btn-ghost" onClick={() => navigate('chat')}>
                💬 Ask AI Advisor
              </button>
            </div>

            <div className="hero-trust-row">
              <span className="hero-trust-pill">✓ No login</span>
              <span className="hero-trust-pill">✓ Always ₹0</span>
              <span className="hero-trust-pill">✓ English + मराठी</span>
              <span className="hero-trust-pill">✓ AI-powered</span>
            </div>
          </div>

          {/* RIGHT — floating cards */}
          <div className="hero-right" aria-hidden="true">

            {/* Win case badge */}
            <div className="hero-win-card">
              <div className="hero-win-dot" />
              <div>
                <div className="hero-win-title">SC 2010 — Open parking cannot be sold</div>
                <div className="hero-win-sub">Supreme Court · Nahalchand judgment</div>
              </div>
              <span className="hero-win-badge">🏆 WON</span>
            </div>

            {/* Issue chips */}
            <div className="hero-chips">
              {CHIPS.map((c, i) => (
                <button
                  key={i}
                  className="hero-chip"
                  style={{ animationDelay: `${i * 0.08}s`, '--chip-color': c.color }}
                  onClick={() => navigate('wizard')}
                >
                  <span className="hero-chip-icon">{c.icon}</span>
                  <span className="hero-chip-label">{c.label}</span>
                  <span className="hero-chip-arr">→</span>
                </button>
              ))}
            </div>

            {/* Live badge */}
            <div className="hero-live">
              <span className="hero-live-dot" />
              AI advisor is online now
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats-bar">
          {[
            { n: '9+',  l: 'Issue Categories' },
            { n: '16+', l: 'Document Templates' },
            { n: '15+', l: 'Laws Covered' },
            { n: '₹0',  l: 'Always Free' },
          ].map((s, i) => (
            <div key={i} className="hero-stat-item">
              <div className="hero-stat-num">{s.n}</div>
              <div className="hero-stat-label">{s.l}</div>
            </div>
          ))}
        </div>

      </section>

      {/* ── Primary Tools ────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 56, paddingBottom: 48 }}>
        <div className="container">
          <div className="tools-label">Start Here</div>
          <div className="section-title" style={{ marginBottom: 6 }}>Choose Your <span>Starting Point</span></div>
          <p className="section-sub">Not sure where to begin? The Complaint Wizard works for most situations.</p>
          <div className="primary-tools-grid">
            {primaryTools.map(tool => (
              <div key={tool.id} className="primary-tool-card"
                style={{ '--tool-color': tool.color }}
                onClick={() => navigate(tool.id)}>
                <div className="ptc-label">{tool.label}</div>
                <div className="ptc-icon">{tool.icon}</div>
                <div className="ptc-title">{tool.title}</div>
                <div className="ptc-desc">{tool.desc}</div>
                <div className="ptc-cta">{tool.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Secondary Tools ──────────────────────────────────────────────── */}
      <section className="section section-teal-light" style={{ paddingTop: 36, paddingBottom: 48 }}>
        <div className="container">
          <div className="tools-label">Specialised Tools</div>
          <div className="secondary-tools-grid">
            {visibleTools.map(tool => (
              <div key={tool.id} className="secondary-tool-card" onClick={() => navigate(tool.id)}>
                <div className="stc-icon">{tool.icon}</div>
                <div>
                  <div className="stc-title">{tool.title}</div>
                  <div className="stc-desc">{tool.desc}</div>
                </div>
                <div className="stc-arrow">→</div>
              </div>
            ))}
          </div>
          {!showAllSecondary && hiddenCount > 0 && (
            <div className="secondary-tools-toggle">
              <button className="secondary-tools-toggle-btn"
                onClick={() => setShowAllSecondary(true)}>
                Show {hiddenCount} more tools ↓
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Browse by Issue ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="tools-label">Issue Library</div>
          <div className="section-title">Browse by <span>Issue Type</span></div>
          <p className="section-sub">Select your problem category — see applicable laws, authorities, and action steps</p>
          <div className="issue-grid">
            {ISSUE_CATEGORIES.map(issue => (
              <div key={issue.id} className="issue-card"
                style={{ '--card-color': issue.color }}
                onClick={() => handleIssueClick(issue)}>
                <div className="issue-icon">{issue.icon}</div>
                <div className="issue-title">{issue.title}</div>
                <div className="issue-title-mr mr">{issue.titleMr}</div>
                <div className="issue-desc">{issue.description}</div>
                <div className="issue-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container">
          <h2 className="cta-title">Is your builder violating your rights?</h2>
          <p className="cta-sub">Start the complaint wizard — takes 5 minutes. Get a clear action plan.</p>
          <button className="cta-btn" onClick={() => navigate('wizard')}>Get Started Free →</button>
        </div>
      </section>
    </>
  );
}
