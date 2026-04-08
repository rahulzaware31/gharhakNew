import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { chatCompletion } from '../utils/groqClient';

// Key provisions from Maharashtra Model Bye-Laws 2014 for Co-operative Housing Societies
const MODEL_BYE_LAWS = [
  {
    no: "70",
    topic: "Maintenance Charges Calculation",
    text: "Maintenance charges shall be fixed by the General Body and calculated on an equal or carpet-area-proportionate basis. No member shall be charged more than their proportionate share. Committee cannot unilaterally change the maintenance formula.",
    remedy: "Demand an itemised maintenance bill from the secretary. File complaint with the District Deputy Registrar (DDR) under MCS Act Section 79A for excess or arbitrary charging.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "73",
    topic: "Sinking Fund",
    text: "Every society must collect a Sinking Fund at 0.25% of construction cost per flat per annum. This fund is exclusively for major repairs and structural work — it cannot be used for regular maintenance, committee expenses, or any other purpose.",
    remedy: "Request a written account of sinking fund balance and usage. If misused, file complaint with DDR and demand a special audit.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "75",
    topic: "Non-Occupancy Charges",
    text: "Non-occupancy charges (for flats not self-occupied) shall not exceed 10% of service charges (maintenance). Charging any amount above 10% is a direct violation of Model Bye-Laws.",
    remedy: "Demand reduction to 10% in writing. Approach Consumer Forum for refund of excess amounts collected in the past.",
    authority: "District Deputy Registrar / Consumer Forum",
  },
  {
    no: "76",
    topic: "Parking Charges",
    text: "Parking charges must be fixed by the General Body and should be reasonable. Open parking cannot be sold or charged for exclusively. Stilt/covered parking allocation must follow the agreement.",
    remedy: "Challenge arbitrary parking charges at AGM. Approach MahaRERA if builder-related, or Consumer Forum for refund.",
    authority: "MahaRERA / Consumer Forum",
  },
  {
    no: "88",
    topic: "Duties and Powers of Managing Committee",
    text: "The Managing Committee must manage society affairs in the interest of all members, maintain proper accounts, enforce bye-laws, and act within its powers. Acting beyond powers (ultra vires), showing favouritism, or acting negligently is a violation.",
    remedy: "File complaint with DDR. Approach Co-operative Court under MCS Act Section 91 for disputes arising from committee decisions.",
    authority: "District Deputy Registrar / Co-operative Court",
  },
  {
    no: "96",
    topic: "Annual General Meeting (AGM) — Timing",
    text: "Every society must hold an AGM within 6 months from the close of the financial year (by 30 September). Notice must be given at least 14 days in advance, along with the agenda and audited accounts.",
    remedy: "Send a written demand for AGM to the secretary. If not held within 30 days of demand, file complaint with DDR to convene the meeting.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "97",
    topic: "AGM Agenda — Accounts & Budget",
    text: "The AGM must include: adoption of audited accounts, budget approval for the next year, fixing of maintenance charges, and election of committee if due. Passing resolutions outside the circulated agenda is invalid.",
    remedy: "Challenge invalid AGM resolutions in writing. Approach DDR or Co-operative Court if the committee acts on resolutions not on the agenda.",
    authority: "District Deputy Registrar / Co-operative Court",
  },
  {
    no: "101",
    topic: "Special General Meeting (SGM)",
    text: "At least 1/3rd of members can requisition an SGM in writing. The Managing Committee must convene the SGM within 30 days of receiving the requisition. Ignoring the requisition is a violation.",
    remedy: "Submit signed requisition (1/3rd members) to the secretary by registered post. If no meeting in 30 days, approach DDR to call the meeting.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "114(A)",
    topic: "Election of Managing Committee",
    text: "Managing Committee elections must be held every 5 years under the Maharashtra Co-operative Election Authority (MCEA). A committee continuing beyond its term without election is acting illegally and has no valid authority.",
    remedy: "File complaint with the Maharashtra Co-operative Election Authority (MCEA) and DDR demanding elections be conducted immediately.",
    authority: "MCEA / District Deputy Registrar",
  },
  {
    no: "117",
    topic: "Managing Committee Meetings",
    text: "The Managing Committee must meet at least once a month. Decisions must be recorded in a minutes book, signed, and maintained. Decisions taken informally or via WhatsApp without proper meetings are not binding.",
    remedy: "Demand inspection of the minutes book. File complaint with DDR if no proper meetings are being held or minutes are not maintained.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "137",
    topic: "Maintenance of Books of Accounts",
    text: "The society must maintain proper books of accounts including cash book, ledger, bank statements, vouchers, and receipt/payment accounts. All transactions must be documented. Every member has the right to inspect these.",
    remedy: "Make a written request for inspection or copies. If denied, file complaint with DDR. DDR can order an inspection under MCS Act Section 83.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "138",
    topic: "Audit of Accounts",
    text: "Annual statutory audit must be completed within 6 months of the financial year end (by 30 September). The audit must be done by an auditor empanelled by the State Government. Audit report must be submitted to DDR.",
    remedy: "Demand audit report at AGM. If audit not conducted, file complaint with DDR for compulsory audit under MCS Act Section 81.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "145",
    topic: "Issuance of Share Certificate",
    text: "The society must issue a Share Certificate to every member within 6 months of admission or registration. The certificate must state the member's name, flat number, and number of shares held.",
    remedy: "Send a registered letter demanding share certificate. Approach DDR or file a civil suit for mandatory injunction if the society refuses.",
    authority: "District Deputy Registrar / Civil Court",
  },
  {
    no: "38",
    topic: "Transfer Fee (Sale / Transfer of Flat)",
    text: "Transfer fee payable to the society on transfer of a flat shall not exceed ₹25,000 (as per Government notification). The society cannot demand premium, goodwill, or any other amount beyond ₹25,000.",
    remedy: "Pay only ₹25,000 and demand a receipt. Approach Consumer Forum or DDR for refund if more was charged. File RTI with the office of the Registrar for official transfer fee notification.",
    authority: "District Deputy Registrar / Consumer Forum",
  },
  {
    no: "43",
    topic: "Admission of Transferee as Member",
    text: "The Managing Committee must admit the purchaser/transferee as a member within 3 months of the application. Unreasonable delay or refusal without valid legal grounds is a violation.",
    remedy: "Send a formal application with all documents by registered post. If no response in 3 months, approach DDR for direction under MCS Act Section 22.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "160",
    topic: "Member's Right to Inspect Records",
    text: "Every member has the right to inspect books of accounts, minutes of meetings, register of members, audit reports, and any other society records during working hours. The secretary must facilitate inspection within 3 days of written request.",
    remedy: "Submit a written request for inspection by hand or registered post. If denied within 3 days, file complaint with DDR. DDR can order inspection under MCS Act Section 83.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "168",
    topic: "Special Levy / Extraordinary Expenses",
    text: "Any special levy or extraordinary expenditure beyond the approved budget must be approved by the General Body (AGM or SGM). The Managing Committee cannot unilaterally impose special charges on members without members' approval.",
    remedy: "Refuse to pay in writing with reasons. Demand an SGM to ratify the levy. File complaint with DDR if committee coerces payment without General Body approval.",
    authority: "District Deputy Registrar (DDR)",
  },
  {
    no: "174",
    topic: "Dispute Resolution",
    text: "Any dispute between a member and the society, or between members, must be referred to the Co-operative Court under MCS Act Section 91. The committee cannot take unilateral punitive action (e.g., cutting water, restricting access) to settle disputes.",
    remedy: "File a dispute petition at the Co-operative Court under MCS Act Section 91. Seek interim injunction to stop punitive actions by the committee.",
    authority: "Co-operative Court (Section 91 MCS Act)",
  },
];

const BYE_LAWS_CONTEXT = MODEL_BYE_LAWS
  .map(b => `Bye-Law ${b.no} (${b.topic}): ${b.text}`)
  .join('\n');

const SEVERITY_CONFIG = {
  High: { bg: '#fef2f2', border: '#fca5a5', badge: '#dc2626', label: 'High Severity' },
  Medium: { bg: '#fffbeb', border: '#fcd34d', badge: '#d97706', label: 'Medium Severity' },
  Low: { bg: '#f0fdf4', border: '#86efac', badge: '#16a34a', label: 'Low Severity' },
};

const EXAMPLE_COMPLAINTS = [
  "Committee raised maintenance by 40% without holding AGM or getting members' approval",
  "Secretary is refusing to share audited accounts and minutes of meetings",
  "Society charged ₹1,00,000 transfer fee when we sold our flat",
  "Non-occupancy charges are 50% of maintenance — higher than others",
  "Special levy of ₹50,000 per flat imposed by WhatsApp message without any meeting",
  "Committee term ended 2 years ago but no elections held and they are still functioning",
];

export default function ByeLawCheckerPage() {
  const { navigate } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkViolations = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `You are a Maharashtra Co-operative Housing Society law expert specialising in Model Bye-Laws 2014.

A society member has described what their Managing Committee did. Analyse the description and identify which specific Model Bye-Laws were violated.

REFERENCE — KEY MODEL BYE-LAWS 2014:
${BYE_LAWS_CONTEXT}

MEMBER'S DESCRIPTION:
"${input}"

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "violations": [
    {
      "byeLawNo": "96",
      "topic": "Annual General Meeting",
      "violation": "Specific explanation of how this bye-law was violated based on the member's description",
      "severity": "High",
      "remedy": "Specific actionable remedy citing the correct authority",
      "authority": "District Deputy Registrar (DDR)"
    }
  ],
  "summary": "One or two sentence plain-language summary of the overall situation and urgency",
  "noViolation": false
}

Rules:
- If no clear violation found, set noViolation: true and violations: []
- severity must be exactly "High", "Medium", or "Low"
- Only cite bye-laws from the reference list above
- Be specific — quote what exactly in the description triggers each bye-law
- Maximum 4 violations`;

    try {
      const data = await chatCompletion({
        maxTokens: 1200,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You are a Maharashtra housing law expert. Always respond with valid JSON only — no markdown fences, no explanation outside the JSON object.' },
          { role: 'user', content: prompt },
        ],
      });
      const content = data.choices?.[0]?.message?.content || '';
      const parsed = JSON.parse(content);
      setResult(parsed);
    } catch {
      setError('Could not connect to AI service. Please check your API key configuration or try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  return (
    <div>
      <div className="page-header-band">
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to Home</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: '#fff7ed' }}>📋</div>
            <div className="page-header-text">
              <div className="page-header-title">Bye-Law Violation Checker</div>
              <div className="page-header-desc">Describe what your MC did — AI identifies violated bye-laws and your remedy</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
      <div className="container">

        {!result ? (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Input card */}
            <div className="byelaw-input-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 28 }}>📋</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>What did your MC / Committee do?</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Describe in plain English or Marathi — the more detail, the better</div>
                </div>
              </div>

              <textarea
                className="form-input form-textarea"
                style={{ minHeight: 140, fontSize: 15 }}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="e.g. Our committee raised maintenance charges by 50% suddenly without calling any AGM or taking members' approval. They also refused to share the audited accounts when we asked..."
              />

              {/* Example chips */}
              <div style={{ marginTop: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Or try an example:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {EXAMPLE_COMPLAINTS.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(ex)}
                      style={{
                        background: 'var(--teal-light)',
                        border: '1px solid var(--teal)',
                        borderRadius: 20,
                        padding: '5px 12px',
                        fontSize: 12,
                        color: 'var(--teal)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textAlign: 'left',
                        lineHeight: 1.4,
                      }}
                    >
                      {ex.length > 55 ? ex.slice(0, 55) + '…' : ex}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={checkViolations}
                disabled={loading || !input.trim()}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? '⏳ Analysing bye-law violations...' : '🔍 Check for Bye-Law Violations'}
              </button>

              {error && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>
                  {error}
                </div>
              )}
            </div>

            {/* Reference panel */}
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Key Bye-Laws in our database
              </div>
              <div className="byelaw-ref-grid">
                {MODEL_BYE_LAWS.map(b => (
                  <div key={b.no} className="byelaw-ref-chip">
                    <span className="byelaw-no">#{b.no}</span>
                    <span>{b.topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <button
              onClick={reset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Check another complaint
            </button>

            {/* Summary banner */}
            <div className="byelaw-summary">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{result.noViolation ? '✅' : '⚠️'}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
                    {result.noViolation
                      ? 'No clear bye-law violation detected'
                      : `${result.violations?.length || 0} Bye-Law violation${result.violations?.length !== 1 ? 's' : ''} identified`}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{result.summary}</div>
                </div>
              </div>
            </div>

            {/* Your complaint */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)' }}>Your complaint: </strong>{input}
            </div>

            {/* Violation cards */}
            {result.violations?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                {result.violations.map((v, i) => {
                  const sev = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.Medium;
                  return (
                    <div
                      key={i}
                      className="byelaw-violation-card"
                      style={{ background: sev.bg, borderColor: sev.border }}
                    >
                      {/* Card header */}
                      <div className="byelaw-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className="byelaw-badge">Bye-Law #{v.byeLawNo}</span>
                          <span style={{ fontWeight: 800, fontSize: 15 }}>{v.topic}</span>
                        </div>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            background: sev.badge,
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {sev.label}
                        </span>
                      </div>

                      {/* Violation explanation */}
                      <div className="byelaw-section">
                        <div className="byelaw-section-label">🚨 Violation</div>
                        <div className="byelaw-section-text">{v.violation}</div>
                      </div>

                      {/* Remedy */}
                      <div className="byelaw-section">
                        <div className="byelaw-section-label">✅ Remedy Available</div>
                        <div className="byelaw-section-text">{v.remedy}</div>
                      </div>

                      {/* Authority */}
                      <div style={{ marginTop: 10 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Approach: </span>
                        <span className="doc-card-cat">{v.authority}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ padding: '14px 18px', background: '#fffbf0', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              ⚠️ <strong>Disclaimer:</strong> This platform provides general legal information only. It is not a substitute for professional legal advice. Bye-law numbers reference Maharashtra Model Bye-Laws 2014 — actual applicable bye-laws may vary based on your society's registered bye-laws. For formal proceedings, consult a qualified advocate.
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
