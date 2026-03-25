import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

const STORAGE_KEY = 'gharhak_checklist_v1';

const CHECKLIST = [
  // ── Category 1: RERA Registration ──────────────────────────────────────
  {
    id: 'rera_registered',
    cat: 'RERA Registration',
    catIcon: '⚖️',
    risk: 'Critical',
    title: 'Project is registered on MahaRERA',
    why: 'Selling without RERA registration is illegal under RERA Section 3. You have zero legal protection if the project is unregistered.',
    how: 'Go to maharera.maharashtra.gov.in → Registered Projects → search project name. Demand RERA Reg. No. (format: P52100XXXXX) from the builder.',
  },
  {
    id: 'rera_active',
    cat: 'RERA Registration',
    catIcon: '⚖️',
    risk: 'Critical',
    title: 'RERA registration is active — not lapsed or cancelled',
    why: 'A lapsed registration means the builder cannot legally take new bookings or advances. Payments to a lapsed builder are at your risk.',
    how: 'On MahaRERA, check the "Status" column of the project. It must say "New Project" or "Renewed". "Lapsed" = stop.',
  },
  {
    id: 'rera_name_match',
    cat: 'RERA Registration',
    catIcon: '⚖️',
    risk: 'High',
    title: 'Builder name on RERA matches name on sale agreement',
    why: 'A mismatch may indicate a proxy company or fraudulent entity. You could lose legal remedies if names don\'t match.',
    how: 'Compare the "Promoter Name" on the RERA portal with the developer name on the draft agreement letter for letter.',
  },
  {
    id: 'rera_completion_date',
    cat: 'RERA Registration',
    catIcon: '⚖️',
    risk: 'High',
    title: 'Project completion date is not overdue by more than 1 year',
    why: 'An overdue project without extension is a strong indicator of a stalled or troubled project. You risk delayed possession and EMI burden without possession.',
    how: 'Check "Proposed Date of Completion" on RERA. If it has passed, check if the builder applied for extension and the new date.',
  },
  {
    id: 'rera_quarterly_updates',
    cat: 'RERA Registration',
    catIcon: '⚖️',
    risk: 'Medium',
    title: 'Builder has uploaded quarterly progress reports (last 6 months)',
    why: 'Non-compliance with quarterly reporting is an early warning sign of a builder trying to avoid transparency.',
    how: 'On the project\'s RERA page → "Quarterly Reports" tab. There should be recent uploads. Gaps longer than 6 months are red flags.',
  },

  // ── Category 2: Land & Title ────────────────────────────────────────────
  {
    id: 'title_search',
    cat: 'Land & Title',
    catIcon: '🗺️',
    risk: 'Critical',
    title: 'Independent advocate has done a title search',
    why: 'A title search is non-negotiable. Without it, you may be buying land with disputed ownership, court cases, or encumbrances.',
    how: 'Engage your own independent advocate (not the builder\'s panel lawyer) to do a 30-year title search. Cost: ₹5,000–₹15,000 — worth every rupee.',
  },
  {
    id: 'encumbrance_free',
    cat: 'Land & Title',
    catIcon: '🗺️',
    risk: 'Critical',
    title: 'Land is free from mortgages and encumbrances (7/12 and Property Card verified)',
    why: 'If the builder mortgaged the land to a bank, the bank can repossess the land and your flat if the builder defaults on the loan.',
    how: 'Check 7/12 extract (for agricultural land) or Property Card (for urban land) at your tehsil/taluka office or bhulekh.mahabhumi.gov.in. Look for any "charge" entries.',
  },
  {
    id: 'na_order',
    cat: 'Land & Title',
    catIcon: '🗺️',
    risk: 'High',
    title: 'NA (Non-Agricultural) order obtained for the plot',
    why: 'Construction on agricultural land without NA conversion is illegal and buildings can be demolished by authorities.',
    how: 'Demand copy of NA order from the builder. Check that it is issued by the Collector\'s office and specifically permits residential use.',
  },
  {
    id: 'zone_residential',
    cat: 'Land & Title',
    catIcon: '🗺️',
    risk: 'High',
    title: 'Land use zone permits residential construction',
    why: 'Plots zoned for industrial, no-development, or reservation use cannot legally have residential buildings. Such buildings can be demolished.',
    how: 'Check the Development Plan (DP) for the area. Ask the builder for the DP remark from municipal authority or PMRDA.',
  },
  {
    id: 'no_litigation',
    cat: 'Land & Title',
    catIcon: '🗺️',
    risk: 'High',
    title: 'No pending litigation on the title / land (civil court check)',
    why: 'Court cases on title can freeze sale/transfer and tie up your investment for years.',
    how: 'Ask your advocate to search the District Court and High Court databases for any suits filed on the survey/plot number.',
  },

  // ── Category 3: Approvals & Construction ───────────────────────────────
  {
    id: 'cc_obtained',
    cat: 'Approvals & Construction',
    catIcon: '🏗️',
    risk: 'Critical',
    title: 'Commencement Certificate (CC) obtained from Municipal Authority / PMRDA',
    why: 'Without a CC, construction is illegal from day one. Such buildings are liable for demolition and you cannot get OC or register the flat.',
    how: 'Demand a copy of the CC from the builder. For Pune projects, verify with PMC or PMRDA building department. CC shows the approved floors and FSI.',
  },
  {
    id: 'plan_matches',
    cat: 'Approvals & Construction',
    catIcon: '🏗️',
    risk: 'High',
    title: 'Sanctioned building plan matches what is being sold to you',
    why: 'If the floor plan you are buying is not in the sanctioned plan (extra floors, larger units, different layout), that portion is illegal and cannot get OC.',
    how: 'Ask builder for sanctioned plan copy. Check if your floor number, wing, and unit type exist in the plan. Compare carpet area carefully.',
  },
  {
    id: 'oc_obtained',
    cat: 'Approvals & Construction',
    catIcon: '🏗️',
    risk: 'Critical',
    title: 'Occupancy Certificate (OC) obtained (mandatory for ready possession)',
    why: 'Without OC, the building is technically an unauthorized structure. You cannot get municipal water, electricity connection, or register the society. Banks may refuse home loans.',
    how: 'Demand the OC copy. For ready possession, there is NO excuse for no OC. For under-construction, the builder must commit to obtaining OC by possession date in the agreement.',
  },
  {
    id: 'fire_noc',
    cat: 'Approvals & Construction',
    catIcon: '🏗️',
    risk: 'Medium',
    title: 'Fire NOC and other statutory clearances obtained',
    why: 'Missing fire NOC is a safety hazard and also prevents OC issuance. Buildings above 15 metres require Fire Department NOC.',
    how: 'For buildings above 15m (roughly 5+ floors), ask for Fire Department NOC. Also check for Environment clearance if project is above a certain size.',
  },
  {
    id: 'no_deviation',
    cat: 'Approvals & Construction',
    catIcon: '🏗️',
    risk: 'High',
    title: 'No unauthorised construction or plan deviation visible',
    why: 'Deviations from sanctioned plan can result in penalty, partial demolition, or refusal of OC for entire building — affecting all residents.',
    how: 'Visit the site and compare visible construction with sanctioned plan. Look for extra floors, encroachments on setbacks, or changes in common areas.',
  },

  // ── Category 4: Society & Conveyance ───────────────────────────────────
  {
    id: 'society_formed',
    cat: 'Society & Conveyance',
    catIcon: '🏢',
    risk: 'High',
    title: 'Co-operative Housing Society formed and registered',
    why: 'Without a registered society, the builder retains management control. Maintenance is at builder\'s whim and you have no collective legal standing.',
    how: 'Ask for the society\'s registration certificate (issued by District Deputy Registrar). Also check society registration number on co-op registrar\'s portal.',
  },
  {
    id: 'conveyance_done',
    cat: 'Society & Conveyance',
    catIcon: '🏢',
    risk: 'High',
    title: 'Conveyance deed executed — land transferred to the society',
    why: 'Without conveyance, the builder legally owns the land your building stands on. They can mortgage, sell, or develop it further. Your investment is at risk.',
    how: 'Ask for the conveyance deed / Index II registered in the society\'s name from the Sub-Registrar office. If not done, demand a timeline commitment.',
  },
  {
    id: 'conveyance_applied',
    cat: 'Society & Conveyance',
    catIcon: '🏢',
    risk: 'Medium',
    title: 'If conveyance not done — deemed conveyance application filed with DDR',
    why: 'Even without builder cooperation, the society can apply for deemed conveyance to the District Deputy Registrar under Section 11 MCS Act.',
    how: 'If conveyance is pending for 3+ years after OC, the society should have filed for deemed conveyance. Check DDR office or ask society secretary.',
  },
  {
    id: 'share_certificates',
    cat: 'Society & Conveyance',
    catIcon: '🏢',
    risk: 'Medium',
    title: 'Share certificates issued to all existing members',
    why: 'Share certificates are proof of membership in the society and ownership. Without them, selling or transferring the flat is complicated.',
    how: 'Ask to see the share certificate for at least the flat you are buying (if resale). For new purchase, confirm the builder will transfer it within 6 months.',
  },
  {
    id: 'society_manages',
    cat: 'Society & Conveyance',
    catIcon: '🏢',
    risk: 'Medium',
    title: 'Society — not the builder — managing amenities and maintenance',
    why: 'Builder-controlled maintenance means arbitrary charges, no accountability, and no recourse. Model Bye-Laws require society control after registration.',
    how: 'Talk to existing residents. Is an elected committee managing the society? Are audited accounts shared annually? These are signs of a healthy society.',
  },

  // ── Category 5: Agreement & Financials ─────────────────────────────────
  {
    id: 'agreement_registered',
    cat: 'Agreement & Financials',
    catIcon: '💰',
    risk: 'Critical',
    title: 'Sale agreement is registered (not just on stamp paper)',
    why: 'An unregistered agreement is not legally enforceable for possession, title, or refund claims. Registration protects you as a buyer.',
    how: 'The agreement must be stamped and registered at the Sub-Registrar office. You should have a document bearing the Sub-Registrar\'s seal and barcode.',
  },
  {
    id: 'stamp_duty_correct',
    cat: 'Agreement & Financials',
    catIcon: '💰',
    risk: 'Medium',
    title: 'Stamp duty paid at correct circle rate (not undervalued)',
    why: 'If stamp duty is paid on a lower value, the registration department can raise a demand later. The buyer is liable, not the builder.',
    how: 'Check the circle rate for the area on IGR Maharashtra website (igrmaharashtra.gov.in). Ensure the agreement value ≥ circle rate.',
  },
  {
    id: 'milestone_linked',
    cat: 'Agreement & Financials',
    catIcon: '💰',
    risk: 'High',
    title: 'Payment schedule is linked to construction milestones — not dates',
    why: 'Time-based payment means you keep paying even if construction stalls. Milestone-based payment (plinth, slab, etc.) protects you.',
    how: 'Read the payment schedule in the agreement carefully. Each installment should say "on completion of [slab / brickwork / plaster]" — not "on [date]".',
  },
  {
    id: 'possession_penalty',
    cat: 'Agreement & Financials',
    catIcon: '💰',
    risk: 'High',
    title: 'Possession date with penalty clause mentioned in agreement',
    why: 'Without a clear possession date and penalty clause, you have no legal basis to claim compensation for delayed possession.',
    how: 'Check the agreement for a specific possession date and a clause that says "if delayed beyond X date, builder pays interest at Y% per annum on your paid amount".',
  },
  {
    id: 'dues_disclosed',
    cat: 'Agreement & Financials',
    catIcon: '💰',
    risk: 'High',
    title: 'All builder dues, loans, and encumbrances on property disclosed',
    why: 'If the builder has taken a construction loan against this property, the lending bank has a first charge. You could lose your flat if the builder defaults.',
    how: 'Ask the builder for a No Dues / No Lien certificate. Check the property card and 7/12 for any bank charges. Ask if there is a tripartite agreement with the construction lender.',
  },
];

const CATEGORIES = [...new Set(CHECKLIST.map(c => c.cat))];

const RISK_COLORS = {
  Critical: { bg: '#fef2f2', border: '#fca5a5', dot: '#dc2626', label: 'Critical' },
  High: { bg: '#fff1f0', border: '#f1948a', dot: '#c0392b', label: 'High Risk' },
  Medium: { bg: '#fffbeb', border: '#fcd34d', dot: '#d97706', label: 'Medium Risk' },
  Low: { bg: '#f0fdf4', border: '#86efac', dot: '#16a34a', label: 'Low Risk' },
};

export default function PrePurchaseChecklistPage() {
  const { navigate } = useContext(AppContext);
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [expanded, setExpanded] = useState({});
  const [activecat, setActiveCat] = useState('All');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const total = CHECKLIST.length;
  const done = CHECKLIST.filter(c => checked[c.id]).length;
  const pct = Math.round((done / total) * 100);

  const criticalUnchecked = CHECKLIST.filter(c => c.risk === 'Critical' && !checked[c.id]).length;

  const visible = activecat === 'All' ? CHECKLIST : CHECKLIST.filter(c => c.cat === activecat);

  const reset = () => {
    if (window.confirm('Reset all checklist progress?')) {
      setChecked({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const progressColor = pct === 100 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';

  return (
    <div>
      <div className="page-header-band">
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to Home</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: '#f0fdf4' }}>✅</div>
            <div className="page-header-text">
              <div className="page-header-title">Pre-Purchase Checklist</div>
              <div className="page-header-desc">25 points to verify before buying a flat in Maharashtra · Progress saves automatically</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
      <div className="container">

        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Progress Bar Card */}
          <div className="checklist-progress-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: progressColor }}>{pct}%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{done} of {total} points verified</div>
              </div>
              {criticalUnchecked > 0 && (
                <div style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
                  🚨 {criticalUnchecked} critical point{criticalUnchecked > 1 ? 's' : ''} unchecked
                </div>
              )}
              {pct === 100 && (
                <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, fontSize: 13, color: '#16a34a', fontWeight: 700 }}>
                  ✅ All 25 points verified — safe to proceed!
                </div>
              )}
              <button onClick={reset} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}>
                Reset
              </button>
            </div>
            <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: progressColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
            </div>
            {/* Category mini bars */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => {
                const catItems = CHECKLIST.filter(c => c.cat === cat);
                const catDone = catItems.filter(c => checked[c.id]).length;
                const catPct = Math.round((catDone / catItems.length) * 100);
                return (
                  <div key={cat} style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600 }}>{cat.split(' ')[0]}</div>
                    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${catPct}%`, background: 'var(--teal)', borderRadius: 99 }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{catDone}/{catItems.length}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '24px 0 20px' }}>
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 20,
                  border: '1.5px solid',
                  borderColor: activecat === cat ? 'var(--teal)' : 'var(--border)',
                  background: activecat === cat ? 'var(--teal)' : 'var(--white)',
                  color: activecat === cat ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {cat === 'All' ? `All (${total})` : cat}
              </button>
            ))}
          </div>

          {/* Checklist Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((item, idx) => {
              const isChecked = !!checked[item.id];
              const isExpanded = !!expanded[item.id];
              const risk = RISK_COLORS[item.risk];

              return (
                <div
                  key={item.id}
                  className="checklist-item"
                  style={{
                    borderColor: isChecked ? '#86efac' : risk.border,
                    background: isChecked ? '#f0fdf4' : risk.bg,
                  }}
                >
                  <div className="checklist-item-header" onClick={() => toggle(item.id)}>
                    {/* Checkbox */}
                    <div className={`checklist-checkbox ${isChecked ? 'checked' : ''}`}>
                      {isChecked && '✓'}
                    </div>

                    {/* Title */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: isChecked ? '#16a34a' : 'var(--text)', textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.7 : 1 }}>
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: risk.dot,
                            color: '#fff',
                          }}
                        >
                          {risk.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.cat}</div>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleExpand(item.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, padding: '0 4px', flexShrink: 0 }}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="checklist-item-detail">
                      <div className="checklist-detail-section">
                        <div className="checklist-detail-label">⚠️ Why it matters</div>
                        <div className="checklist-detail-text">{item.why}</div>
                      </div>
                      <div className="checklist-detail-section">
                        <div className="checklist-detail-label">🔍 How to check</div>
                        <div className="checklist-detail-text">{item.how}</div>
                      </div>
                      <button
                        className="btn-primary"
                        onClick={() => toggle(item.id)}
                        style={{ marginTop: 12, padding: '8px 20px', fontSize: 13 }}
                      >
                        {isChecked ? '✗ Mark as not verified' : '✓ Mark as verified'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary / CTA */}
          {done > 0 && (
            <div style={{ marginTop: 28, padding: '20px 24px', background: 'var(--teal-light)', border: '1.5px solid var(--teal)', borderRadius: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                {pct === 100
                  ? '🎉 All 25 checks complete — you\'re making an informed purchase!'
                  : `${done}/${total} verified — keep going before signing anything.`}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Your progress is saved automatically in your browser. Come back and continue where you left off.
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ marginTop: 20, padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
            ⚠️ This platform provides general legal information only. It is not a substitute for professional legal advice. This checklist is a guide — always engage an independent advocate for title verification and agreement review before making any payment. Laws and regulations may change.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
