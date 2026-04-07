import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { COMPLAINT_STEPS } from '../data/issues';
import { postAI } from '../utils/aiClient';

const OUTCOME_CONFIG = {
  win:     { label: 'Residents Won',    bg: '#d1fae5', color: '#065f46', icon: '✅' },
  loss:    { label: 'Residents Lost',   bg: '#fee2e2', color: '#991b1b', icon: '❌' },
  neutral: { label: 'Partial / Mixed',  bg: '#fef3c7', color: '#92400e', icon: '⚖️' },
};

const TYPE_ICONS = {
  'Supreme Court': '🏛️',
  'Bombay High Court': '⚖️',
  'MahaRERA': '🏛️',
  'Consumer Forum': '🧑‍⚖️',
  'Co-operative Court': '👨‍⚖️',
  'DDR': '📋',
  'News Report': '📰',
};

export default function IssuePage() {
  const { selectedIssue, navigate } = useContext(AppContext);
  const [liveCases, setLiveCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!selectedIssue) return;
    fetchLiveCases();
    setExpanded({});
    // eslint-disable-next-line
  }, [selectedIssue?.id]);

  const fetchLiveCases = async () => {
    setCasesLoading(true);
    setLiveCases([]);
    try {
      const prompt = `Give me 3 real, specific landmark cases, court judgments, tribunal orders, or notable news from Maharashtra related to the housing issue: "${selectedIssue.title}".
Applicable laws: ${selectedIssue.laws.join(', ')}.
Authorities involved: ${selectedIssue.authorities.join(', ')}.

Focus on actual cases from: Supreme Court, Bombay High Court, MahaRERA orders, Consumer Forum / NCDRC, Co-operative Court Maharashtra, DDR orders.

Return ONLY a JSON array with no markdown, no code blocks, no explanation:
[
  {
    "type": "Supreme Court|Bombay High Court|MahaRERA|Consumer Forum|Co-operative Court|DDR|News Report",
    "year": "20XX",
    "title": "Descriptive case title (max 80 chars)",
    "summary": "2-3 sentences: who filed, what was the dispute, what was at stake",
    "outcome": "Specific ruling/order — what was decided and what relief was granted",
    "outcomeType": "win|loss|neutral",
    "takeaway": "One-line key lesson for Maharashtra flat owners or housing society members"
  }
]`;

      const data = await postAI({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1400,
        messages: [
          {
            role: 'system',
            content: 'You are a Maharashtra housing law expert with deep knowledge of case law. Always return valid JSON arrays only — no markdown, no code fences, no explanation text.',
          },
          { role: 'user', content: prompt },
        ],
      });
      const text = data.choices?.[0]?.message?.content || '[]';
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const cases = JSON.parse(clean);
      setLiveCases(Array.isArray(cases) ? cases : []);
    } catch {
      setLiveCases([]);
    } finally {
      setCasesLoading(false);
    }
  };

  if (!selectedIssue) {
    navigate('home');
    return null;
  }

  const steps = COMPLAINT_STEPS[selectedIssue.id];

  return (
    <div>
      <div className="page-header-band" style={{ borderLeft: `4px solid ${selectedIssue.color}` }}>
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to all issues</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: `${selectedIssue.color}18`, fontSize: 28 }}>
              {selectedIssue.icon}
            </div>
            <div className="page-header-text">
              <div className="page-header-title">{selectedIssue.title}</div>
              <div className="page-header-desc mr" style={{ fontFamily: 'inherit' }}>
                <span className="mr">{selectedIssue.titleMr} · </span>{selectedIssue.description}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
      <div className="container" style={{ maxWidth: 880 }}>

        {/* Two column layout */}
        <div className="issue-detail-grid" style={{ marginBottom: 32 }}>
          {/* Laws */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚖️ Applicable Laws
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedIssue.laws.map((law, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--dark)', borderRadius: 8 }}>
                  <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>§</span>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{law}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authorities */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              🏛️ Authorities to Approach
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedIssue.authorities.map((auth, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--teal-light)', borderRadius: 8 }}>
                  <span style={{ color: 'var(--teal)', fontSize: 14 }}>→</span>
                  <span style={{ color: 'var(--dark)', fontSize: 13, fontWeight: 600 }}>{auth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔍 Common Issues in This Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {selectedIssue.commonIssues.map((issue, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 10 }}>
                <span style={{ color: 'var(--teal)', marginTop: 2, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Steps */}
        {steps && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🗺️ Step-by-Step Action Plan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, paddingBottom: 24, position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div style={{ position: 'absolute', left: 14, top: 30, width: 2, height: 'calc(100% - 10px)', background: 'var(--border)' }} />
                  )}
                  <div style={{
                    width: 30, height: 30, background: 'var(--teal)', color: '#fff',
                    borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, flexShrink: 0, position: 'relative', zIndex: 1,
                  }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{s.action}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Real Cases */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                📰 Real Cases & Judgments
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--teal)', color: '#fff', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em' }}>AI LIVE</span>
              </h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Relevant cases from Maharashtra courts, MahaRERA, and Consumer Forums</div>
            </div>
            {!casesLoading && (
              <button
                onClick={fetchLiveCases}
                style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ↻ Refresh
              </button>
            )}
          </div>

          {casesLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="live-case-skeleton">
                  <div className="skeleton-line" style={{ width: '60%', height: 16, marginBottom: 8 }} />
                  <div className="skeleton-line" style={{ width: '90%', height: 12, marginBottom: 6 }} />
                  <div className="skeleton-line" style={{ width: '75%', height: 12 }} />
                </div>
              ))}
            </div>
          )}

          {!casesLoading && liveCases.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              No cases loaded yet.{' '}
              <span>If this keeps happening, please retry in a few minutes.</span>
            </div>
          )}

          {!casesLoading && liveCases.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {liveCases.map((c, i) => {
                const cfg = OUTCOME_CONFIG[c.outcomeType] || OUTCOME_CONFIG.neutral;
                const isOpen = !!expanded[i];
                return (
                  <div key={i} className="live-case-card" style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    {/* Card header — always visible */}
                    <button
                      onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                      style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>
                        {TYPE_ICONS[c.type] || '⚖️'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'var(--dark)', color: '#fff' }}>{c.type}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{c.year}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: cfg.bg, color: cfg.color }}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{c.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{c.summary}</div>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0, marginTop: 4 }}>{isOpen ? '▲' : '▼'}</span>
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px 18px 56px', background: 'var(--bg)' }}>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>Ruling / Outcome</div>
                          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{c.outcome}</div>
                        </div>
                        <div style={{ background: 'var(--teal-light)', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>💡</span>
                          <div style={{ fontSize: 13, color: 'var(--teal-dark)', fontWeight: 600, lineHeight: 1.5 }}>{c.takeaway}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            ⚠️ AI-generated case summaries are for general awareness. Verify details through official sources (Indian Kanoon, MahaRERA portal) before citing in proceedings.
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('wizard')}>
            🧭 Start Complaint Wizard for This Issue
          </button>
          <button className="btn-outline" style={{ border: '1.5px solid var(--border)', color: 'var(--text)' }} onClick={() => navigate('chat')}>
            💬 Ask AI Advisor
          </button>
          <button className="btn-outline" style={{ border: '1.5px solid var(--border)', color: 'var(--text)' }} onClick={() => navigate('docs')}>
            📄 Draft a Document
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
