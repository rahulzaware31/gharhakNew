import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES } from '../data/issues';

const PROBLEM_CARDS = [
  { emoji: '🏗️', quote: '"Builder promised conveyance 8 years ago. Still waiting."' },
  { emoji: '📋', quote: '"Our OC is pending for 3 years. Builder keeps saying \'next month\'."' },
  { emoji: '🚗', quote: '"Someone has locked our open parking. MC does nothing."' },
  { emoji: '💰', quote: '"Maintenance increased 40% without any AGM."' },
  { emoji: '🗳️', quote: '"Same MC for 7 years. No elections ever held."' },
  { emoji: '📜', quote: '"Can\'t sell my flat. Society won\'t give NOC."' },
];

const TOOL_CARDS = [
  {
    id: 'wizard',
    icon: '🧭',
    title: 'Complaint Wizard',
    desc: 'Answer 5 questions → Get your personal action plan',
    tag: 'Most Popular',
    tagClass: 'gh-tag-popular',
    features: ['Step-by-step guidance', 'Know exactly who to approach', 'Printable action plan'],
    featured: true,
  },
  {
    id: 'chat',
    icon: '🤖',
    title: 'AI Legal Advisor',
    desc: 'Chat in English or Marathi → Instant legal guidance',
    tag: '24/7 Available',
    tagClass: 'gh-tag-ai',
    features: ['English + मराठी', 'Cite applicable laws', 'Instant answers'],
    featured: false,
  },
  {
    id: 'docs',
    icon: '📄',
    title: 'Document Generator',
    desc: 'Select template → Fill details → Ready to send',
    tag: '16+ Templates',
    tagClass: 'gh-tag-docs',
    features: ['Legal notices', 'RTI applications', 'RERA complaints'],
    featured: false,
  },
];

const TOOL_CHIPS = [
  { id: 'byelaw',     icon: '📋', label: 'Bye-Law Checker' },
  { id: 'rera',       icon: '⚖️', label: 'RERA Checker' },
  { id: 'checklist',  icon: '✅', label: 'Buyer Checklist' },
  { id: 'conveyance', icon: '📐', label: 'Conveyance Calculator' },
  { id: 'possession', icon: '🔑', label: 'Possession Checklist' },
  { id: 'awareness',  icon: '📣', label: 'Society Rights Guide' },
  { id: 'cases',      icon: '🏆', label: 'Real Cases' },
];

const HERO_CHIPS = [
  { label: 'Conveyance Deed',    color: '#e74c3c' },
  { label: 'RERA Complaint',     color: '#2980b9' },
  { label: 'OC Pending',         color: '#27ae60' },
  { label: 'Parking Rights',     color: '#f39c12' },
  { label: 'Maintenance Dispute',color: '#e67e22' },
  { label: 'Illegal Construction',color: '#c0392b' },
];

const REAL_CASES = [
  {
    court: 'Supreme Court',
    year: '2010',
    title: 'Open Parking CANNOT Be Sold by Builder',
    outcome: 'Builder ordered to return all open parking spaces to residents.',
    id: 'cases',
  },
  {
    court: 'MahaRERA',
    year: '2023',
    title: 'Flat Buyers Awarded 10.05% Interest on 4-Year Delay',
    outcome: 'Builder directed to pay interest from promised possession date.',
    id: 'cases',
  },
  {
    court: 'Bombay High Court',
    year: '2019',
    title: 'Society Gets Deemed Conveyance Despite Builder\'s Objections',
    outcome: 'DDR ordered to process conveyance — builder cannot block it.',
    id: 'cases',
  },
];

export default function HomePage({ navigate }) {
  const { setSelectedIssue } = useContext(AppContext);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate('issue', issue);
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="gh-hero">
        <div className="gh-hero-inner container">
          {/* Left */}
          <div className="gh-hero-left">
            <div className="gh-hero-badge">🇮🇳 Free · Maharashtra · निःशुल्क</div>

            <h1 className="gh-hero-headline">
              Your Builder<br />
              Has Lawyers.<br />
              <span className="gh-gradient-text">Now You Have GharHak.</span>
            </h1>

            <p className="gh-hero-sub">
              Free AI-powered legal guidance for 5 crore Maharashtra flat owners.
              Know your rights. File complaints. Get justice.
            </p>

            <p className="gh-hero-mr mr">घरमालकांचे हक्क आता सोप्या भाषेत</p>

            <div className="gh-hero-actions">
              <button className="btn-primary gh-btn-hero-primary" onClick={() => navigate('wizard')}>
                🧭 Start Complaint Wizard
              </button>
              <button className="btn-outline gh-btn-hero-ghost" onClick={() => navigate('chat')}>
                💬 Ask AI Advisor
              </button>
            </div>

            <div className="gh-trust-pills">
              <span className="gh-trust-pill">✓ No login</span>
              <span className="gh-trust-pill">✓ Always ₹0</span>
              <span className="gh-trust-pill">✓ English + मराठी</span>
              <span className="gh-trust-pill">✓ AI-powered</span>
            </div>
          </div>

          {/* Right */}
          <div className="gh-hero-right">
            <div className="gh-float-card">
              <div className="gh-float-card-header">
                <span className="gh-pulse-dot"></span>
                <span className="gh-float-card-label">🏆 SC 2010 Judgment</span>
              </div>
              <p className="gh-float-card-text">
                Open parking <strong>CANNOT be sold</strong> by builder — Supreme Court ruling protects your rights
              </p>
            </div>

            <div className="gh-issue-chips">
              {HERO_CHIPS.map((chip) => (
                <div
                  key={chip.label}
                  className="gh-issue-chip"
                  style={{ '--chip-color': chip.color }}
                  onClick={() => navigate('wizard')}
                >
                  <span className="gh-issue-chip-dot" style={{ background: chip.color }}></span>
                  <span className="gh-issue-chip-label">{chip.label}</span>
                  <span className="gh-issue-chip-arrow">→</span>
                </div>
              ))}
            </div>

            <div className="gh-ai-status">
              <span className="gh-ai-dot"></span>
              AI advisor is online
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="gh-stats-bar">
          <div className="container">
            <div className="gh-stats-inner">
              {[
                { num: '9+', label: 'Issue Categories' },
                { num: '16+', label: 'Document Templates' },
                { num: '15+', label: 'Laws Covered' },
                { num: '₹0', label: 'Always Free' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="gh-stats-divider" />}
                  <div className="gh-stat">
                    <div className="gh-stat-num">{s.num}</div>
                    <div className="gh-stat-label">{s.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── "Is This You?" ────────────────────────────────────────────────── */}
      <section className="gh-section gh-section-dark">
        <div className="container">
          <div className="gh-section-label">Sound Familiar?</div>
          <h2 className="gh-section-title gh-title-light">
            Is this <span className="gh-teal">you?</span>
          </h2>
          <div className="gh-problem-grid">
            {PROBLEM_CARDS.map((card) => (
              <div key={card.emoji} className="gh-problem-card">
                <div className="gh-problem-emoji">{card.emoji}</div>
                <p className="gh-problem-quote">{card.quote}</p>
                <button
                  className="gh-problem-help"
                  onClick={() => navigate('wizard')}
                >
                  We can help →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 Ways to Get Help ────────────────────────────────────────────── */}
      <section className="gh-section gh-section-white">
        <div className="container">
          <div className="gh-section-label">Get Started</div>
          <h2 className="gh-section-title">Choose how you want <span>help</span></h2>
          <p className="gh-section-sub">Three powerful tools. All free. No login needed.</p>
          <div className="gh-tool-grid">
            {TOOL_CARDS.map((tool) => (
              <div
                key={tool.id}
                className={`gh-tool-card${tool.featured ? ' gh-tool-card-featured' : ''}`}
                onClick={() => navigate(tool.id)}
              >
                <div className={`gh-tool-tag ${tool.tagClass}`}>{tool.tag}</div>
                <div className="gh-tool-icon">{tool.icon}</div>
                <h3 className="gh-tool-title">{tool.title}</h3>
                <p className="gh-tool-desc">{tool.desc}</p>
                <ul className="gh-tool-features">
                  {tool.features.map((f) => (
                    <li key={f} className="gh-tool-feature">
                      <span className="gh-tool-check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`gh-tool-btn${tool.featured ? ' gh-tool-btn-primary' : ''}`}>
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Issue Grid ────────────────────────────────────────────────────── */}
      <section className="gh-section gh-section-bg">
        <div className="container">
          <div className="gh-section-label">Issue Library</div>
          <h2 className="gh-section-title">What's your <span>issue?</span></h2>
          <p className="gh-section-sub">Select your problem — see applicable laws, authorities, and action steps.</p>
          <div className="gh-issue-grid">
            {ISSUE_CATEGORIES.map((issue) => (
              <div
                key={issue.id}
                className="gh-issue-category-card"
                style={{ '--card-color': issue.color }}
                onClick={() => handleIssueClick(issue)}
              >
                <div className="gh-issue-category-icon">{issue.icon}</div>
                <div className="gh-issue-category-title">{issue.title}</div>
                <div className="gh-issue-category-mr mr">{issue.titleMr}</div>
                <div className="gh-issue-category-desc">{issue.description}</div>
                <div className="gh-issue-category-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialised Tools Strip ───────────────────────────────────────── */}
      <section className="gh-tools-strip">
        <div className="container">
          <div className="gh-tools-strip-header">
            <div className="gh-section-label gh-label-light">Specialised Tools</div>
            <h2 className="gh-section-title gh-title-light">More <span className="gh-teal">Tools</span></h2>
          </div>
          <div className="gh-chips-scroll">
            {TOOL_CHIPS.map((chip) => (
              <button
                key={chip.id}
                className="gh-chip"
                onClick={() => navigate(chip.id)}
              >
                <span className="gh-chip-icon">{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof / Real Cases ─────────────────────────────────────── */}
      <section className="gh-section gh-section-gray">
        <div className="container">
          <div className="gh-section-label">Real Outcomes</div>
          <h2 className="gh-section-title">People Like You <span>Won</span></h2>
          <p className="gh-section-sub">Landmark judgments that protect Maharashtra flat owners.</p>
          <div className="gh-cases-grid">
            {REAL_CASES.map((c) => (
              <div key={c.title} className="gh-case-card" onClick={() => navigate(c.id)}>
                <div className="gh-case-header">
                  <span className="gh-case-court">{c.court}</span>
                  <span className="gh-case-year">{c.year}</span>
                </div>
                <h3 className="gh-case-title">{c.title}</h3>
                <p className="gh-case-outcome">
                  <span className="gh-case-win">🏆 Won</span> {c.outcome}
                </p>
              </div>
            ))}
          </div>
          <div className="gh-cases-cta">
            <button className="btn-outline gh-cases-btn" onClick={() => navigate('cases')}>
              See All Cases →
            </button>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA Banner ─────────────────────────────────────────────── */}
      <section className="gh-cta-banner">
        <div className="container">
          <div className="gh-cta-inner">
            <h2 className="gh-cta-title">Is your builder violating your rights?</h2>
            <p className="gh-cta-sub">Start in 2 minutes. No lawyer needed. Completely free.</p>
            <button className="gh-cta-btn" onClick={() => navigate('wizard')}>
              Get Your Free Action Plan →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
