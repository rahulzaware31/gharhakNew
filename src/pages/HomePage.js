import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES } from '../data/issues';

export default function HomePage({ navigate }) {
  const { setSelectedIssue } = useContext(AppContext);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate('issue', issue);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🇮🇳 Maharashtra Housing Rights Platform · निःशुल्क सेवा</div>
        <h1>Know Your <span>Housing Rights</span></h1>
        <div className="hero-mr mr">घरमालकांचे हक्क जाणा, न्याय मागा</div>
        <p className="hero-sub">
          Free guidance for Maharashtra flat owners. AI-powered advice, step-by-step complaint wizard,
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

      {/* Three Features */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-title" style={{ color: '#fff', marginBottom: 8 }}>
            Six Ways to Get <span>Help</span>
          </div>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
            Pick what works best for your situation
          </p>
          <div className="feature-grid">
            <div className="feature-card" onClick={() => navigate('chat')}>
              <div className="feature-num">01</div>
              <div className="feature-icon">🤖</div>
              <div className="feature-title">AI Legal Advisor</div>
              <div className="feature-desc">
                Chat with an AI trained on Maharashtra housing law. Describe your issue in plain language —
                get instant, actionable guidance on what laws apply and what to do next.
              </div>
              <span className="feature-tag">Ask in English or Marathi →</span>
            </div>
            <div className="feature-card" onClick={() => navigate('wizard')}>
              <div className="feature-num">02</div>
              <div className="feature-icon">🧭</div>
              <div className="feature-title">Complaint Wizard</div>
              <div className="feature-desc">
                Answer a few questions about your issue. Get a personalised step-by-step action plan
                listing which authority to approach, which law to cite, and in what order.
              </div>
              <span className="feature-tag">5-minute guided flow →</span>
            </div>
            <div className="feature-card" onClick={() => navigate('docs')}>
              <div className="feature-num">03</div>
              <div className="feature-icon">📄</div>
              <div className="feature-title">Document Generator</div>
              <div className="feature-desc">
                Generate ready-to-use legal notices, RTI applications, RERA complaints, PMC/DDR complaints,
                and more. Fill details once — get a formatted document.
              </div>
              <span className="feature-tag">16 document templates →</span>
            </div>
            <div className="feature-card" onClick={() => navigate('byelaw')}>
              <div className="feature-num">04</div>
              <div className="feature-icon">📋</div>
              <div className="feature-title">Bye-Law Violation Checker</div>
              <div className="feature-desc">
                Describe what your Managing Committee did — AI cross-checks it against Model Bye-Laws 2014
                and flags which specific bye-law was violated and what remedy is available.
              </div>
              <span className="feature-tag">Instant bye-law analysis →</span>
            </div>
            <div className="feature-card" onClick={() => navigate('rera')}>
              <div className="feature-num">05</div>
              <div className="feature-icon">⚖️</div>
              <div className="feature-title">RERA Registration Checker</div>
              <div className="feature-desc">
                Verify if your builder or project is registered on MahaRERA. Step-by-step guide with
                red flags to watch out for and green signals to look for.
              </div>
              <span className="feature-tag">Check builder on MahaRERA →</span>
            </div>
            <div className="feature-card" onClick={() => navigate('checklist')}>
              <div className="feature-num">06</div>
              <div className="feature-icon">✅</div>
              <div className="feature-title">Pre-Purchase Checklist</div>
              <div className="feature-desc">
                25 things to verify before buying a flat in Maharashtra — RERA, title, approvals,
                society, and financials. Track progress and save your checklist automatically.
              </div>
              <span className="feature-tag">25-point buyer's checklist →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Issue Categories */}
      <section className="section">
        <div className="container">
          <div className="section-title">Browse by <span>Issue Type</span></div>
          <p className="section-sub">Select your category to see applicable laws, authorities, and action steps</p>
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

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, #00c896, #00a87d)', padding: '60px 24px', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: -1 }}>
            Is your builder violating your rights?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
            Start the complaint wizard — takes 5 minutes. Get a clear action plan.
          </p>
          <button
            onClick={() => navigate('wizard')}
            style={{ background: '#fff', color: '#00a87d', padding: '16px 40px', borderRadius: 12, border: 'none', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}
          >
            Get Started Free →
          </button>
        </div>
      </section>
    </>
  );
}
