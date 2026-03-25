import React, { useContext } from 'react';
import { AppContext } from '../App';
import { COMPLAINT_STEPS } from '../data/issues';

export default function IssuePage() {
  const { selectedIssue, navigate } = useContext(AppContext);

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
