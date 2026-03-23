import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { ISSUE_CATEGORIES, COMPLAINT_STEPS } from '../data/issues';

const TOTAL_STEPS = 4;

export default function WizardPage() {
  const { navigate } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [details, setDetails] = useState({ name: '', city: '', description: '' });
  const [result, setResult] = useState(null);

  const goNext = () => {
    if (step === 3) generateResult();
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const generateResult = () => {
    const cat = ISSUE_CATEGORIES.find(c => c.id === selectedCategory);
    const steps = COMPLAINT_STEPS[selectedCategory] || getGenericSteps(cat);
    setResult({ category: cat, steps, urgency });
  };

  const getGenericSteps = (cat) => [
    { step: 1, action: 'Gather Documents', detail: 'Collect: Sale Deed, Index II, builder correspondence, photographs of the issue, society registration certificate.' },
    { step: 2, action: 'Send Legal Notice', detail: `Send a registered legal notice to the builder/society citing: ${cat?.laws?.join(', ')}. Give 15-day time to respond.` },
    { step: 3, action: 'File Complaint', detail: `Approach: ${cat?.authorities?.join(' → ')}. File a written complaint with acknowledgment.` },
    { step: 4, action: 'Follow Up', detail: 'If no response in 30 days, escalate to Consumer Forum or High Court Writ Petition for mandamus.' },
    { step: 5, action: 'Consult Advocate', detail: 'For court matters, engage a qualified advocate familiar with Maharashtra housing law.' },
  ];

  const canProceed = () => {
    if (step === 1) return !!selectedCategory;
    if (step === 2) return !!urgency;
    if (step === 3) return details.city.trim().length > 0;
    return true;
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="section-title">Complaint <span>Wizard</span></h1>
          <p className="section-sub">Answer 3 questions — get your personalised action plan</p>
        </div>

        <div className="wizard-container">
          {/* Progress */}
          <div className="wizard-progress">
            <div className="wizard-steps">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div key={i} className={`wizard-step-dot ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`} />
              ))}
            </div>
            <div className="wizard-label">Step {step} of {TOTAL_STEPS}</div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="wizard-card">
              <div className="wizard-step-title">What is your issue?</div>
              <div className="wizard-step-sub">Select the category that best describes your problem</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {ISSUE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`option-btn ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>
                ))}
              </div>
              <div className="wizard-actions">
                <div />
                <button className="btn-next" onClick={goNext} disabled={!canProceed()}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="wizard-card">
              <div className="wizard-step-title">How urgent is this?</div>
              <div className="wizard-step-sub">This helps us prioritize your action steps</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'critical', label: '🚨 Critical — builder actively constructing / registering sales illegally', color: '#e74c3c' },
                  { id: 'high', label: '⚠️ High — ongoing violation, no court order yet', color: '#e67e22' },
                  { id: 'medium', label: '📋 Medium — violation exists but not escalating', color: '#f39c12' },
                  { id: 'low', label: '💡 Low — seeking general information / future planning', color: '#27ae60' },
                ].map(u => (
                  <button
                    key={u.id}
                    className={`option-btn ${urgency === u.id ? 'selected' : ''}`}
                    onClick={() => setUrgency(u.id)}
                    style={{ textAlign: 'left', padding: '16px 20px' }}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
              <div className="wizard-actions">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canProceed()}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="wizard-card">
              <div className="wizard-step-title">A few details</div>
              <div className="wizard-step-sub">Optional — helps personalise your action plan</div>
              <div className="form-field">
                <label className="form-label">Your city / area *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Pune, Wagholi, Thane, Mumbai..."
                  value={details.city}
                  onChange={e => setDetails(d => ({ ...d, city: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Briefly describe your situation (optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="e.g. Builder not giving conveyance deed despite 10 years. Society formed in 2014. 80 flats. Builder sold open parking slots..."
                  value={details.description}
                  onChange={e => setDetails(d => ({ ...d, description: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Society / Project name (optional)</label>
                <input
                  className="form-input"
                  placeholder="e.g. Solacia E1 E2 CHS, RMC Garden Phase 3..."
                  value={details.name}
                  onChange={e => setDetails(d => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div className="wizard-actions">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canProceed()}>Get Action Plan →</button>
              </div>
            </div>
          )}

          {/* Step 4 — Result */}
          {step === 4 && result && (
            <div className="wizard-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ fontSize: 40 }}>{result.category.icon}</div>
                <div>
                  <div className="wizard-step-title" style={{ marginBottom: 2 }}>Your Action Plan</div>
                  <div style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 600 }}>
                    {result.category.title} · {details.city}
                  </div>
                </div>
              </div>

              {urgency === 'critical' && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#991b1b', fontWeight: 600 }}>
                  🚨 Critical Case: Consider filing a Writ Petition in Bombay High Court for interim injunction immediately. Do not delay.
                </div>
              )}

              <div className="result-card">
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Step-by-Step Action Plan
                </div>
                {result.steps.map((s, i) => (
                  <div key={i} className="result-step">
                    <div className="result-step-num">{s.step}</div>
                    <div className="result-step-body">
                      <div className="result-step-action">{s.action}</div>
                      <div className="result-step-detail">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Applicable Laws */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚖️ Laws That Apply to Your Case</div>
                <div className="law-badges">
                  {result.category.laws.map((law, i) => (
                    <span key={i} className="law-badge">{law}</span>
                  ))}
                </div>
              </div>

              {/* Authorities */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏛️ Authorities to Approach</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.category.authorities.map((auth, i) => (
                    <span key={i} style={{ padding: '6px 14px', background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                      {i + 1}. {auth}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => { setStep(1); setSelectedCategory(null); setUrgency(null); setDetails({ name: '', city: '', description: '' }); setResult(null); }}>
                  Start New Complaint
                </button>
                <button className="btn-outline" style={{ border: '1.5px solid var(--border)', color: 'var(--text)' }} onClick={() => window.print()}>
                  🖨️ Print / Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
