import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES } from '../data/issues';

export default function HomePage({ navigate }) {
  const { setSelectedIssue } = useContext(AppContext);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate('issue', issue);
  };

  const allTools = [
    { id: 'docs',       icon: '📄', title: 'Document Generator',          desc: 'Generate legal notices, RTI applications, RERA complaints' },
    { id: 'byelaw',     icon: '📋', title: 'Bye-Law Checker',             desc: 'Check if your committee violated society bye-laws' },
    { id: 'rera',       icon: '⚖️', title: 'RERA Checker',                desc: 'Verify builder registration on MahaRERA' },
    { id: 'checklist',  icon: '✅', title: 'Buyer Checklist',             desc: '25 points to verify before buying a flat' },
    { id: 'conveyance', icon: '📐', title: 'Conveyance Calc',             desc: "Calculate your society's land entitlement" },
    { id: 'possession', icon: '🔑', title: 'Possession Checklist',        desc: 'Verify before accepting flat possession' },
    { id: 'handover',   icon: '🏘️', title: 'Society Handover Checklist', desc: 'Society checklist before accepting developer handover' },
    { id: 'cases',      icon: '🏆', title: 'Real Cases',                  desc: 'Court judgments and RERA orders won by residents' },
    { id: 'awareness',  icon: '📣', title: 'Society Awareness',           desc: 'Plain-language guides for 10 common society problems' },
    { id: 'wizard',     icon: '🧭', title: 'Complaint Wizard',            desc: 'Step-by-step guide to file a complaint' },
    { id: 'chat',       icon: '🤖', title: 'AI Legal Advisor',            desc: 'Get instant legal answers via AI chat' },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-badge">🇮🇳 Maharashtra Housing Rights · निःशुल्क सेवा</div>
        <h1>Know Your <span>Housing Rights</span></h1>
        <div className="hero-mr mr">घरमालकांचे हक्क जाणा, न्याय मागा</div>
        <p className="hero-sub">
          Free guidance for Maharashtra flat owners — AI advice, complaint wizard,
          and ready-to-use legal documents in English and Marathi.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('docs')}>
            📄 Browse Documents
          </button>
          <button className="btn-outline" onClick={() => navigate('byelaw')}>
            📋 Bye-Law Checker
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">9+</div>
            <div className="hero-stat-label">Issue Categories</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">16+</div>
            <div className="hero-stat-label">Document Templates</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">15+</div>
            <div className="hero-stat-label">Laws Covered</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">₹0</div>
            <div className="hero-stat-label">Always Free</div>
          </div>
        </div>
      </section>

      {/* ── All Tools ────────────────────────────────────────────────────── */}
      <section className="section section-teal-light" style={{ paddingTop: 36, paddingBottom: 48 }}>
        <div className="container">
          <div className="tools-label">All Tools</div>
          <div className="section-title" style={{ marginBottom: 6 }}>Everything in <span>One Place</span></div>
          <p className="section-sub">All legal tools available — pick what you need.</p>
          <div className="secondary-tools-grid">
            {allTools.map(tool => (
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
              <div
                key={issue.id}
                className="issue-card"
                style={{ '--card-color': issue.color }}
                onClick={() => handleIssueClick(issue)}
              >
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
          <button className="cta-btn" onClick={() => navigate('wizard')}>
            Get Started Free →
          </button>
        </div>
      </section>
    </>
  );
}
