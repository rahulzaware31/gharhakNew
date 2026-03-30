import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES } from '../data/issues';

const HERO_PROBLEM_CARDS = [
  { icon: '🏛️', border: '#e74c3c', text: 'Builder hasn\'t given conveyance deed in 8 years' },
  { icon: '📋', border: '#27ae60', text: 'OC pending 3 years. Builder says "next month" every month.' },
  { icon: '🚗', border: '#f39c12', text: 'Someone locked our open parking. MC ignores complaints.' },
  { icon: '💰', border: '#e67e22', text: 'Maintenance raised 40% without AGM. No accounts shared.' },
  { icon: '🗳️', border: '#e74c3c', text: 'Same MC for 7 years. Elections never held.' },
  { icon: '📜', border: '#2980b9', text: 'Society refusing NOC. Can\'t sell my flat.' },
];

const TOOLS = [
  { id: 'wizard',     icon: '🧭', title: 'Complaint Wizard',     desc: '5 questions → personalised action plan' },
  { id: 'docs',       icon: '📄', title: 'Document Generator',   desc: 'Legal notices, RTI, RERA complaints ready to send' },
  { id: 'awareness',  icon: '🏘️', title: 'Society Rights Guide', desc: '8 common CHS violations explained step-by-step' },
  { id: 'conveyance', icon: '📐', title: 'FSI Calculator',        desc: 'Calculate land entitlement, detect FSI fraud' },
  { id: 'checklist',  icon: '✅', title: 'Buyer Checklist',       desc: '25 checks before signing any property deal' },
  { id: 'possession', icon: '🔑', title: 'Possession Checklist',  desc: '33 checks before accepting flat possession' },
  { id: 'cases',      icon: '🏆', title: 'Real Cases',            desc: 'Court judgments where residents won' },
];

const SOUND_FAMILIAR = [
  { emoji: '🏗️', title: 'Builder won\'t give conveyance deed',   sub: 'Your society is legally entitled to the land. Builder cannot refuse.' },
  { emoji: '📋', title: 'No OC after years of possession',        sub: 'Living without OC is illegal. Builder must obtain it — or pay compensation.' },
  { emoji: '🚗', title: 'Open parking sold or locked',            sub: 'Supreme Court ruling: open parking cannot be sold by anyone.' },
  { emoji: '💰', title: 'Maintenance hiked without AGM',          sub: 'Any increase without AGM resolution is illegal. You can withhold the excess.' },
  { emoji: '🗳️', title: 'MC elections never held',               sub: 'After 5 years, MC has no legal authority. DDR can remove them.' },
  { emoji: '📜', title: 'NOC for flat sale refused',              sub: 'Society can refuse only for specific legal reasons. Arbitrary refusal is illegal.' },
];

const REAL_CASES = [
  {
    court: 'Supreme Court, 2010',
    outcome: 'Open parking declared common area. Builder ordered to return all sold parking slots.',
    tag: 'Parking Rights',
  },
  {
    court: 'MahaRERA, 2023',
    outcome: 'Builder penalised ₹8.2 lakh for 4-year possession delay. Interest awarded to flat owner.',
    tag: 'Possession Delay',
  },
  {
    court: 'Bombay High Court, 2019',
    outcome: 'DDR directed to pass conveyance order within 3 months. Society got land after 6 years.',
    tag: 'Conveyance',
  },
];

export default function HomePage({ navigate }) {
  const { setSelectedIssue } = useContext(AppContext);
  const heroCardsRef = useRef(null);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate('issue', issue);
  };

  return (
    <>
      {/* ── SECTION 1: Hero ──────────────────────────────────────────────── */}
      <section className="hp2-hero">
        <div className="hp2-hero-inner container">
          {/* Left */}
          <div className="hp2-hero-left">
            <div className="hp2-badge-pill">🇮🇳 Maharashtra · Free · निःशुल्क सेवा</div>

            <h1 className="hp2-headline">
              Your flat. Your rights.
              <br />
              <span className="hp2-headline-teal">Know both.</span>
            </h1>

            <p className="hp2-hero-mr mr">घरमालकांचे हक्क जाणा, न्याय मागा</p>

            <p className="hp2-hero-body">
              Most Maharashtra flat owners don't know what they're legally entitled to —
              or what to do when builders and committees break the rules.
              GharHak gives you the exact steps, the exact laws, and the exact letters to send.
            </p>

            <button
              className="hp2-cta-btn"
              onClick={() => navigate('wizard')}
            >
              What is your problem? →
            </button>

            <div className="hp2-trust-pills">
              <span className="hp2-trust-pill">✓ No login required</span>
              <span className="hp2-trust-pill">✓ Always free</span>
              <span className="hp2-trust-pill">✓ English + मराठी</span>
            </div>
          </div>

          {/* Right — floating problem cards */}
          <div className="hp2-hero-right" ref={heroCardsRef}>
            <div className="hp2-float-stack">
              {HERO_PROBLEM_CARDS.map((card, i) => (
                <div
                  key={i}
                  className="hp2-float-card"
                  style={{
                    '--card-border': card.border,
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  <span className="hp2-float-card-icon">{card.icon}</span>
                  <p className="hp2-float-card-text">{card.text}</p>
                  <span className="hp2-float-card-link">See what to do →</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hp2-stats-bar">
          <div className="container">
            <div className="hp2-stats-inner">
              {[
                { num: '9+',  label: 'Issue Types' },
                { num: '16+', label: 'Document Templates' },
                { num: '15+', label: 'Laws Covered' },
                { num: '₹0',  label: 'Always Free' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="hp2-stats-divider" />}
                  <div className="hp2-stat">
                    <div className="hp2-stat-num">{s.num}</div>
                    <div className="hp2-stat-label">{s.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: What's your problem? ──────────────────────────────── */}
      <section className="hp2-section hp2-section-white">
        <div className="container">
          <h2 className="hp2-section-headline">What is your problem?</h2>
          <p className="hp2-section-sub">Select your issue — get the exact laws, authorities, and steps to resolve it.</p>

          <div className="hp2-issue-grid">
            {ISSUE_CATEGORIES.map((issue) => (
              <div
                key={issue.id}
                className="hp2-issue-tile"
                style={{ '--tile-color': issue.color }}
                onClick={() => handleIssueClick(issue)}
              >
                <div className="hp2-issue-tile-icon">{issue.icon}</div>
                <div className="hp2-issue-tile-title">{issue.title}</div>
                <div className="hp2-issue-tile-mr mr">{issue.titleMr}</div>
                <div className="hp2-issue-tile-desc">{issue.description}</div>
                <div className="hp2-issue-tile-cta" style={{ color: issue.color }}>→ See steps</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Tools ─────────────────────────────────────────────── */}
      <section className="hp2-section hp2-section-dark">
        <div className="container">
          <h2 className="hp2-section-headline hp2-headline-light">Free tools for every situation</h2>
          <p className="hp2-section-sub hp2-sub-muted">Not sure where to start? Each tool solves a specific problem.</p>

          <div className="hp2-tools-grid">
            {TOOLS.map((tool) => (
              <div
                key={tool.id}
                className="hp2-tool-tile"
                onClick={() => navigate(tool.id)}
              >
                <div className="hp2-tool-icon">{tool.icon}</div>
                <div className="hp2-tool-title">{tool.title}</div>
                <div className="hp2-tool-desc">{tool.desc}</div>
                <span className="hp2-tool-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Sound Familiar? ───────────────────────────────────── */}
      <section className="hp2-section hp2-section-gray">
        <div className="container">
          <h2 className="hp2-section-headline">Sound familiar?</h2>
          <p className="hp2-section-sub">These are the most common problems faced by Maharashtra flat owners.</p>

          <div className="hp2-familiar-grid">
            {SOUND_FAMILIAR.map((item, i) => (
              <div key={i} className="hp2-familiar-card">
                <div className="hp2-familiar-emoji">{item.emoji}</div>
                <div className="hp2-familiar-title">{item.title}</div>
                <div className="hp2-familiar-sub">{item.sub}</div>
                <button
                  className="hp2-familiar-link"
                  onClick={() => navigate('wizard')}
                >
                  See what to do →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Real Cases ────────────────────────────────────────── */}
      <section className="hp2-section hp2-section-white">
        <div className="container">
          <h2 className="hp2-section-headline">Real cases. Real outcomes.</h2>
          <p className="hp2-section-sub">Maharashtra flat owners who knew their rights — and used them.</p>

          <div className="hp2-cases-grid">
            {REAL_CASES.map((c, i) => (
              <div key={i} className="hp2-case-card">
                <div className="hp2-case-court">🏆 {c.court}</div>
                <p className="hp2-case-outcome">{c.outcome}</p>
                <span className="hp2-case-tag">{c.tag}</span>
              </div>
            ))}
          </div>

          <div className="hp2-cases-cta">
            <button className="hp2-outline-btn" onClick={() => navigate('cases')}>
              See all cases →
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Bottom CTA ────────────────────────────────────────── */}
      <section className="hp2-cta-section">
        <div className="container">
          <h2 className="hp2-cta-headline">Don't wait. Know your rights today.</h2>
          <p className="hp2-cta-sub">Free. No signup. Works in English and Marathi. Takes 2 minutes.</p>
          <button className="hp2-cta-white-btn" onClick={() => navigate('wizard')}>
            Find Your Solution →
          </button>
          <p className="hp2-cta-disclaimer">
            ⚠️ GharHak provides legal information, not legal advice.
          </p>
        </div>
      </section>
    </>
  );
}
