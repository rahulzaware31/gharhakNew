import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

const STORAGE_KEY = 'gharhak_possession_v1';

const CHECKLIST = [
  // ── Category 1: Documents to Demand ────────────────────────────────────
  {
    id: 'oc_copy',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'Critical',
    title: 'Obtain original Occupancy Certificate (OC) copy from builder',
    why: 'Without OC, the building is an unauthorised structure. You cannot get permanent utility connections, the society cannot be registered, and banks may recall home loans.',
    how: 'Demand a copy of OC issued by the Municipal Authority / PMRDA / Gram Panchayat. Check it covers your wing and floor. Do not accept possession without OC.',
  },
  {
    id: 'completion_cert',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'High',
    title: 'Completion Certificate (CC) received',
    why: 'CC confirms the building is complete as per approved plans. It is required for property tax assessment and final mortgage release.',
    how: 'Ask the builder for CC issued by the local authority. For Pune, this is PMC or PMRDA. Check it mentions your building/wing number.',
  },
  {
    id: 'registered_agreement',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'Critical',
    title: 'Registered Sale Agreement / Allotment Letter in hand',
    why: 'The registered agreement is your primary proof of ownership. Without it you have no legal basis to claim possession or title.',
    how: 'Ensure the agreement is registered (has Sub-Registrar seal and barcode), not just on stamp paper. Your name, flat number, carpet area, and floor must match exactly.',
  },
  {
    id: 'noc_bank',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'High',
    title: 'NOC from builder\'s lender (bank/NBFC) for your flat',
    why: 'If the builder mortgaged the land/building to a bank, that bank has a first charge. Without NOC, the lender can repossess your flat if the builder defaults.',
    how: 'Demand a No-Objection Certificate from the builder\'s construction finance lender specifically for your flat number. It should say the flat is free from any lien.',
  },
  {
    id: 'share_cert',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'High',
    title: 'Share Certificate issued (or timeline committed in writing)',
    why: 'Share certificate is proof of society membership. Without it, selling or transferring the flat later becomes complicated.',
    how: 'If the society is formed, share certificate should be issued at possession. If society is not yet formed, get a written commitment from the builder for issue within 3 months of society registration.',
  },
  {
    id: 'title_docs',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'High',
    title: 'Title documents chain — Sale Deed / Index II for original plot',
    why: 'You should be able to trace the ownership history of the land to ensure no future disputes.',
    how: 'Ask the builder for a copy of the title documents. Your advocate can also download Index II from the IGR Maharashtra portal (igrmaharashtra.gov.in) using survey/plot number.',
  },
  {
    id: 'rera_possession_letter',
    cat: 'Documents to Demand',
    catIcon: '📄',
    risk: 'Medium',
    title: 'Possession letter mentions RERA-registered date',
    why: 'Under RERA, possession must be on or before the registered date. If possession is after that date, you are entitled to compensation — but only if you can prove the date.',
    how: 'Cross-check the possession letter date with the possession date on MahaRERA portal. Keep the RERA possession date screenshot as evidence for any future compensation claim.',
  },

  // ── Category 2: Financial Clearances ───────────────────────────────────
  {
    id: 'no_dues_cert',
    cat: 'Financial Clearances',
    catIcon: '💰',
    risk: 'Critical',
    title: 'No-Dues Certificate from builder — all payments settled',
    why: 'Builder can refuse to register the flat or hand over documents if they claim pending dues later. Get this in writing before taking possession.',
    how: 'Get a signed letter from the builder on their letterhead confirming full and final payment received, zero dues pending, and no further claims against you.',
  },
  {
    id: 'corpus_fund',
    cat: 'Financial Clearances',
    catIcon: '💰',
    risk: 'Medium',
    title: 'Corpus fund / sinking fund details disclosed',
    why: 'Builders often collect corpus fund at possession. Verify the amount is as agreed in the sale agreement and that it will be transferred to the society.',
    how: 'Check your sale agreement for the corpus fund clause. Confirm the amount being collected matches. Get a receipt. Ask when and how it will be transferred to the society.',
  },
  {
    id: 'stamp_duty_done',
    cat: 'Financial Clearances',
    catIcon: '💰',
    risk: 'Critical',
    title: 'Stamp duty and registration of Sale Deed completed',
    why: 'The flat is legally yours only after the Sale Deed is registered. Without registration, you have no ownership title.',
    how: 'The Sale Deed (not just sale agreement) must be executed and registered at the Sub-Registrar\'s office after possession. Ensure you receive the registered deed with document number.',
  },
  {
    id: 'property_tax_name',
    cat: 'Financial Clearances',
    catIcon: '💰',
    risk: 'Medium',
    title: 'Property tax transfer initiated in your name',
    why: 'Property tax remaining in the builder\'s name can create issues with ownership records and may lead to penalties accumulating without your knowledge.',
    how: 'Visit the Municipal Corporation / Gram Panchayat office with your Sale Deed and OC to transfer property tax records to your name. This should be done within 3 months.',
  },
  {
    id: 'gst_receipt',
    cat: 'Financial Clearances',
    catIcon: '💰',
    risk: 'Medium',
    title: 'GST paid receipt obtained (for under-construction purchase)',
    why: 'GST is applicable on under-construction flats. Ensure you have receipts for all GST paid — this is needed for home loan tax benefits and future resale.',
    how: 'Collect GST payment receipts for all installments. If not received, ask builder for a GST invoice/receipt for each payment with their GSTIN number.',
  },

  // ── Category 3: Physical Inspection ────────────────────────────────────
  {
    id: 'flat_inspection',
    cat: 'Physical Inspection',
    catIcon: '🔍',
    risk: 'High',
    title: 'Thorough flat inspection done — defects noted before signing',
    why: 'Once you sign the possession letter, it is very difficult to get the builder to fix defects. Document everything before accepting possession.',
    how: 'Walk through every room. Check walls (cracks, damp patches), floors (tiles cracked, uneven), windows (open/close properly, glass intact), doors (fit, lock, handle), and plumbing (leaks, water pressure). Photograph all defects.',
  },
  {
    id: 'carpet_area_verified',
    cat: 'Physical Inspection',
    catIcon: '🔍',
    risk: 'High',
    title: 'Carpet area measured and matches the sale agreement',
    why: 'Under RERA, builders must deliver the exact carpet area mentioned in the agreement. Short delivery entitles you to proportional refund under Section 18 RERA.',
    how: 'Use a tape measure or hire a surveyor. Measure the internal dimensions of each room (excluding walls). Compare with the carpet area in your agreement. A variance of more than 3% is actionable.',
  },
  {
    id: 'amenities_ready',
    cat: 'Physical Inspection',
    catIcon: '🔍',
    risk: 'Medium',
    title: 'Promised amenities are actually available and functional',
    why: 'Builders often take possession payment before amenities are complete. Once you accept possession, getting unfulfilled amenities becomes much harder.',
    how: 'Check your sale agreement for the list of promised amenities (gym, clubhouse, parking, garden, lift, etc.). Physically inspect each one. Note what is incomplete on the possession letter.',
  },
  {
    id: 'parking_allotted',
    cat: 'Physical Inspection',
    catIcon: '🔍',
    risk: 'High',
    title: 'Parking slot allotted, numbered, and matches the agreement',
    why: 'Parking disputes are among the most common housing society complaints. Your parking slot should be specifically numbered and documented.',
    how: 'The sale agreement should mention a specific parking number (not just "one parking"). Physically verify the slot exists, is accessible, and is not encroached. Get a written allotment letter.',
  },
  {
    id: 'common_areas',
    cat: 'Physical Inspection',
    catIcon: '🔍',
    risk: 'Medium',
    title: 'Common areas, lobby, and staircase in usable condition',
    why: 'As a new resident, you should receive a building with functional common areas. Existing deficiencies become the society\'s expense later.',
    how: 'Check lobbies, corridors, staircases, terrace access, and compound walls. Look for waterproofing, flooring, lighting, and signage. Photograph issues before accepting possession.',
  },

  // ── Category 4: Utility Connections ────────────────────────────────────
  {
    id: 'electricity_connection',
    cat: 'Utility Connections',
    catIcon: '⚡',
    risk: 'Critical',
    title: 'Individual electricity meter installed and connection active',
    why: 'Without an individual electricity meter, you are at the builder\'s mercy for power and billing. Builders sometimes charge excessive rates on a master meter.',
    how: 'Check if an individual electricity meter with your flat number is installed. For Pune, connection is from MSEDCL. Meter number should be in your name or transferred to your name post-Sale Deed.',
  },
  {
    id: 'water_connection',
    cat: 'Utility Connections',
    catIcon: '💧',
    risk: 'High',
    title: 'Water connection from municipal supply active and tested',
    why: 'Municipal water connection requires OC. Without it, you are dependent on tanker water at the builder\'s rates — which is expensive and unregulated.',
    how: 'Turn on all taps and check water pressure and quality. Ask the builder if municipal water connection has been applied for and confirm the expected date. This should be confirmed before accepting possession.',
  },
  {
    id: 'gas_piped',
    cat: 'Utility Connections',
    catIcon: '🔥',
    risk: 'Medium',
    title: 'Piped Natural Gas (PNG) connection available or date committed',
    why: 'If your agreement mentions piped gas, the builder must arrange the connection. Otherwise you are dependent on cylinders indefinitely.',
    how: 'Check if PNG lines are laid. For Pune, MGL (Mahanagar Gas Limited) provides PNG. If not connected, get a written commitment from the builder with a date.',
  },
  {
    id: 'lift_operational',
    cat: 'Utility Connections',
    catIcon: '🛗',
    risk: 'High',
    title: 'Lift(s) are operational with valid inspection certificate',
    why: 'Operating a lift without a valid inspection certificate is illegal. It is also a safety risk. Maintenance liability falls on whoever has possession.',
    how: 'Test all lifts. Ask for the lift inspection certificate from the Maharashtra Factory & Boilers Inspector. Check the validity date. This must be renewed annually.',
  },

  // ── Category 5: Society & Handover ─────────────────────────────────────
  {
    id: 'society_formed_check',
    cat: 'Society & Handover',
    catIcon: '🏢',
    risk: 'High',
    title: 'Co-operative Housing Society formed (or builder has applied)',
    why: 'Without a society, the builder controls all common areas and maintenance. You have no collective legal standing against builder misconduct.',
    how: 'Ask for the society registration certificate from the builder. If not yet formed, check if at least the application has been submitted to the District Deputy Registrar.',
  },
  {
    id: 'maintenance_charges_disclosed',
    cat: 'Society & Handover',
    catIcon: '🏢',
    risk: 'Medium',
    title: 'Maintenance charge amount and basis is clearly disclosed',
    why: 'Builders often charge arbitrary maintenance before the society takes over. Model bye-laws cap this and it should be disclosed upfront.',
    how: 'Get a written breakdown of monthly maintenance charges — what does it include (security, lift, water, electricity of common areas, etc.). Compare with the sale agreement if maintenance was mentioned.',
  },
  {
    id: 'defect_liability',
    cat: 'Society & Handover',
    catIcon: '🏢',
    risk: 'High',
    title: 'Defect liability period clause noted (5 years under RERA)',
    why: 'Under RERA Section 14(3), builder is liable to rectify structural defects reported within 5 years from possession date at no extra cost.',
    how: 'Note the possession date carefully — this is the start of your 5-year defect liability window. For any structural defect, complaint to MahaRERA within 5 years. Keep a list of all defects observed at possession.',
  },
  {
    id: 'maintenance_advance',
    cat: 'Society & Handover',
    catIcon: '🏢',
    risk: 'Medium',
    title: 'Any advance maintenance collected will be transferred to society',
    why: 'Builders collect months of advance maintenance. This money belongs to the society once formed. Ensure there is a commitment to transfer it.',
    how: 'Get a written undertaking from the builder that all advance maintenance collected from all flat owners will be transferred to the society bank account within 30 days of society registration.',
  },
];

const CATEGORIES = [...new Set(CHECKLIST.map(c => c.cat))];

const RISK_COLORS = {
  Critical: { bg: '#fef2f2', border: '#fca5a5', dot: '#dc2626', label: 'Critical' },
  High: { bg: '#fff1f0', border: '#f1948a', dot: '#c0392b', label: 'High Risk' },
  Medium: { bg: '#fffbeb', border: '#fcd34d', dot: '#d97706', label: 'Medium Risk' },
  Low: { bg: '#f0fdf4', border: '#86efac', dot: '#16a34a', label: 'Low Risk' },
};

export default function PossessionChecklistPage() {
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
            <div className="page-header-icon" style={{ background: '#f0fdf4' }}>🔑</div>
            <div className="page-header-text">
              <div className="page-header-title">Possession Checklist</div>
              <div className="page-header-desc">Before accepting possession of your flat · {total} points to verify · Progress saves automatically</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>

            {/* Info banner */}
            <div style={{ padding: '14px 18px', background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: 12, marginBottom: 24, fontSize: 13, color: '#1d4ed8', lineHeight: 1.6 }}>
              <strong>📌 Important:</strong> Do NOT sign the possession letter until you have verified all Critical and High Risk points. Once you sign, it is legally considered that you accepted the flat in its current condition.
            </div>

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
                    ✅ All {total} points verified — safe to accept possession!
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
                    <div key={cat} style={{ flex: 1, minWidth: 100, textAlign: 'center' }}>
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
              {visible.map((item) => {
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
                      <div className={`checklist-checkbox ${isChecked ? 'checked' : ''}`}>
                        {isChecked && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: isChecked ? '#16a34a' : 'var(--text)', textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.7 : 1 }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: risk.dot, color: '#fff' }}>
                            {risk.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.cat}</div>
                      </div>
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

            {/* Summary CTA */}
            {done > 0 && (
              <div style={{ marginTop: 28, padding: '20px 24px', background: 'var(--teal-light)', border: '1.5px solid var(--teal)', borderRadius: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                  {pct === 100
                    ? `🎉 All ${total} checks complete — you're ready to accept possession!`
                    : `${done}/${total} verified — complete all checks before signing the possession letter.`}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Your progress is saved automatically in your browser. Come back and continue where you left off.
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ marginTop: 20, padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              ⚠️ This platform provides general legal information only. It is not a substitute for professional legal advice. For court proceedings or if the builder refuses possession, consult a qualified advocate. Laws and regulations may change.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
