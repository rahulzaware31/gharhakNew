import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES, REAL_CASES } from '../data/issues';

function RealCasesSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filters = ['All', ...Array.from(new Set(REAL_CASES.map(c => c.issueTag)))];
  const visible = activeFilter === 'All' ? REAL_CASES : REAL_CASES.filter(c => c.issueTag === activeFilter);

  return (
    <section className="section section-cases">
      <div className="container">
        <div className="tools-label">Landmark Cases</div>
        <div className="section-title">Real Cases from <span>Maharashtra Courts</span></div>
        <p className="section-sub">
          Judgments, RERA orders, and news stories — see how others with similar problems won.
        </p>

        {/* Filter tabs */}
        <div className="cases-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`cases-filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => { setActiveFilter(f); setExpanded(null); }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cases grid */}
        <div className="cases-grid">
          {visible.map(c => (
            <div key={c.id} className="case-card">
              <div className="case-card-top">
                <div className="case-badges">
                  <span className="case-type-badge">
                    {c.typeIcon} {c.type}
                  </span>
                  <span className="case-year-badge">{c.year}</span>
                </div>
                <span className="case-issue-tag" style={{ background: c.issueColor + '18', color: c.issueColor }}>
                  {c.issueTag}
                </span>
              </div>

              <div className="case-title">{c.title}</div>
              <div className="case-summary">{c.summary}</div>

              {expanded === c.id && (
                <div className="case-outcome">
                  <div className="case-outcome-label">
                    {c.outcomeType === 'win' ? '✅ Outcome' : 'ℹ️ Outcome'}
                  </div>
                  <div className="case-outcome-text">{c.outcome}</div>
                </div>
              )}

              <div className="case-card-footer">
                <button
                  className="case-expand-btn"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  {expanded === c.id ? '▲ Hide outcome' : '▼ See outcome'}
                </button>
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-source-link"
                >
                  {c.source} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ navigate }) {
  const { setSelectedIssue } = useContext(AppContext);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate('issue', issue);
  };

  const primaryTools = [
    {
      id: 'wizard',
      icon: '🧭',
      label: 'Best for most people',
      title: 'Complaint Wizard',
      desc: 'Answer 5 quick questions and get a personalised, law-cited action plan — exactly which authority to approach and in what order.',
      cta: 'Start Wizard →',
      color: 'var(--teal)',
    },
    {
      id: 'chat',
      icon: '🤖',
      label: 'Ask anything',
      title: 'AI Legal Advisor',
      desc: 'Describe your problem in plain English or Marathi. Get instant guidance on applicable laws and next steps.',
      cta: 'Chat Now →',
      color: '#6366f1',
    },
    {
      id: 'docs',
      icon: '📄',
      label: 'Ready-to-send',
      title: 'Document Generator',
      desc: 'Generate legal notices, RTI applications, RERA complaints, and PMC/DDR letters — fill details once, get a formatted document.',
      cta: 'Browse Templates →',
      color: '#f59e0b',
    },
  ];

  const secondaryTools = [
    { id: 'byelaw', icon: '📋', title: 'Bye-Law Checker', desc: 'Check if your MC violated society bye-laws' },
    { id: 'rera',   icon: '⚖️', title: 'RERA Checker',   desc: 'Verify builder registration on MahaRERA' },
    { id: 'checklist', icon: '✅', title: 'Buyer Checklist', desc: '25 points to verify before buying a flat' },
    { id: 'conveyance', icon: '📐', title: 'Conveyance Calc', desc: 'Calculate your society\'s land entitlement' },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-badge">🇮🇳 Maharashtra Housing Rights Platform · निःशुल्क सेवा</div>
        <h1>Know Your <span>Housing Rights</span></h1>
        <div className="hero-mr mr">घरमालकांचे हक्क जाणा, न्याय मागा</div>
        <p className="hero-sub">
          Free guidance for Maharashtra flat owners. AI advice, step-by-step complaint wizard,
          and ready-to-use legal documents — in English and Marathi.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('wizard')}>
            🧭 Start Complaint Wizard
          </button>
          <button className="btn-outline" onClick={() => navigate('chat')}>
            💬 Ask AI Advisor
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
            <div className="hero-stat-label">Key Laws Covered</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">₹0</div>
            <div className="hero-stat-label">Always Free</div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="section hiw-section">
        <div className="container">
          <div className="hiw-header">
            <div className="section-title" style={{ marginBottom: 4 }}>How <span>GharHak</span> Works</div>
            <p className="section-sub" style={{ marginBottom: 0 }}>Three simple steps to assert your housing rights</p>
          </div>
          <div className="hiw-steps">
            <div className="hiw-step">
              <div className="hiw-num">1</div>
              <div className="hiw-icon">🏠</div>
              <div className="hiw-title">Describe Your Issue</div>
              <div className="hiw-desc">Tell us what happened — maintenance overcharge, builder delay, illegal construction, parking dispute, or anything else.</div>
            </div>
            <div className="hiw-arrow">→</div>
            <div className="hiw-step">
              <div className="hiw-num">2</div>
              <div className="hiw-icon">⚙️</div>
              <div className="hiw-title">Use the Right Tool</div>
              <div className="hiw-desc">Use the Complaint Wizard, AI Advisor, or browse by issue type — GharHak maps your problem to the exact law and authority.</div>
            </div>
            <div className="hiw-arrow">→</div>
            <div className="hiw-step">
              <div className="hiw-num">3</div>
              <div className="hiw-icon">📬</div>
              <div className="hiw-title">Take Action</div>
              <div className="hiw-desc">Get a step-by-step plan, generate ready-to-send complaint letters, and know exactly where to file — PMC, DDR, MahaRERA, or Consumer Forum.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Primary Tools ────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="tools-label">Start Here</div>
          <div className="section-title" style={{ marginBottom: 6 }}>Choose Your <span>Starting Point</span></div>
          <p className="section-sub">Not sure where to begin? The Complaint Wizard works for most situations.</p>

          <div className="primary-tools-grid">
            {primaryTools.map(tool => (
              <div
                key={tool.id}
                className="primary-tool-card"
                style={{ '--tool-color': tool.color }}
                onClick={() => navigate(tool.id)}
              >
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
      <section className="section section-teal-light" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <div className="container">
          <div className="tools-label">Specialised Tools</div>
          <div className="secondary-tools-grid">
            {secondaryTools.map(tool => (
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

      {/* ── Real Cases ──────────────────────────────────────────────────── */}
      <RealCasesSection />

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
