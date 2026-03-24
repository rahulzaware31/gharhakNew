import React, { useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SQ_FT_PER_SQ_M = 10.7639;

const BASE_FSI = {
  pmrda: { 9: 1.10, 12: 1.10, 18: 1.30, 24: 1.50, 30: 1.80 },
  pmc:   { 9: 1.10, 12: 1.50, 18: 2.00, 24: 2.50, 30: 3.00 },
  pcmc:  { 9: 1.10, 12: 1.50, 18: 2.00, 24: 2.50, 30: 3.00 },
  other: { 9: 1.00, 12: 1.00, 18: 1.20, 24: 1.50, 30: 1.80 },
};
const PREM_RATE   = 0.30;  // Row 10a: Premium FSI = NPA × 0.30
const TDR_RATE    = 0.70;  // Row 11c: TDR = NPA × 0.70
const SLUM_PCT    = 0.30;  // Slum TDR = 30% of TDR allowance
const RES_PCT     = 0.70;  // Reservation TDR = 70% of TDR allowance
const ANCIL_RATE  = 0.60;  // Row 13e: Ancillary = Balance BUA × 0.60
const AMENITY_PCT = 0.15;  // Row 04: Amenity Space = 15% of Balance Area

let _flatId = 0;
const newFlat = (label) => ({ id: ++_flatId, name: label, carpetArea: '' });

const fmt  = (n, d = 2) => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmt0 = (n) => fmt(n, 0);

// ─── Shared small components ──────────────────────────────────────────────────
function Field({ label, hint, error, children }) {
  return (
    <div className="conv-field-group">
      <label className="conv-label">
        {label}
        {hint && <span className="conv-hint">{hint}</span>}
      </label>
      {children}
      {error && <div className="conv-error">{error}</div>}
    </div>
  );
}

function NumInput({ id, value, onChange, placeholder, error }) {
  return (
    <input
      className={`form-input ${error ? 'conv-input-error' : ''}`}
      type="number"
      min="0"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function SocietyRow({ soc, index, onUpdate, onRemove, showRemove }) {
  return (
    <div className="conv-soc-row">
      <div className="conv-soc-header">
        <span className="conv-soc-num">Society {index + 1}</span>
        {showRemove && (
          <button className="conv-remove-btn" onClick={onRemove}>×</button>
        )}
      </div>
      <Field label="Society / Association Name">
        <input
          className="form-input"
          placeholder="e.g. Solacia E1 & E2 CHS Ltd."
          value={soc.name}
          onChange={e => onUpdate('name', e.target.value)}
        />
      </Field>
      <div className="conv-two-col">
        <Field label="Type">
          <select className="form-input" value={soc.type} onChange={e => onUpdate('type', e.target.value)}>
            <option value="chs">CHS (MCS Act 1960)</option>
            <option value="aoa">AOA (MAOA 1970)</option>
            <option value="condo">Condominium</option>
          </select>
        </Field>
        <Field label="No. of Flats">
          <input className="form-input" type="number" min="0" placeholder="120"
            value={soc.flats} onChange={e => onUpdate('flats', e.target.value)} />
        </Field>
        <Field label="Conveyed Area (sq.m.)">
          <input className="form-input" type="number" min="0" step="0.01" placeholder="4600"
            value={soc.area} onChange={e => onUpdate('area', e.target.value)} />
        </Field>
        <Field label="Status">
          <select className="form-input" value={soc.status} onChange={e => onUpdate('status', e.target.value)}>
            <option value="done">✅ Already Conveyed</option>
            <option value="pending">❌ Pending</option>
            <option value="partial">⚠️ Partial / Disputed</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

// ─── AS Row renderers (Area Statement table rows) ─────────────────────────────
function ASRow({ num, desc, bVal, cVal, sub, fraud, correct }) {
  const diff = (bVal != null && cVal != null && !isNaN(bVal) && !isNaN(cVal)) ? bVal - cVal : null;
  const showDiff = diff !== null && Math.abs(diff) > 0.5;
  return (
    <tr style={fraud ? { background: '#fef2f2' } : correct ? { background: '#f0fdf4' } : {}}>
      <td style={{ color: 'var(--text-muted)', fontSize: 11, width: 28, verticalAlign: 'top', paddingTop: 10 }}>{num || ''}</td>
      <td style={sub ? { color: 'var(--text-muted)', fontSize: 12, paddingLeft: 24 } : {}}>{desc}</td>
      <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 600,
        color: fraud ? 'var(--red)' : correct ? '#065f46' : '#e74c3c', whiteSpace: 'nowrap' }}>
        {bVal != null && !isNaN(bVal) ? fmt(bVal) : '—'}
        {showDiff && diff > 0 && (
          <div style={{ fontSize: 10, color: 'var(--red)' }}>▲ +{fmt0(Math.abs(diff))}</div>
        )}
      </td>
      <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 600,
        color: correct ? '#065f46' : '#065f46', whiteSpace: 'nowrap' }}>
        {cVal != null && !isNaN(cVal) ? fmt(cVal) : '—'}
      </td>
    </tr>
  );
}

function ASSection({ num, title }) {
  return (
    <tr>
      <td colSpan={4} style={{ background: '#f1f5f9', fontWeight: 700, fontSize: 12,
        color: 'var(--dark)', padding: '8px 14px' }}>
        <span style={{ color: 'var(--teal)', marginRight: 8, fontWeight: 800 }}>{num}</span>
        {title}
      </td>
    </tr>
  );
}

function ASTotalRow({ desc, bVal, cVal }) {
  return (
    <tr style={{ background: 'var(--teal-light)' }}>
      <td />
      <td style={{ fontWeight: 700 }}>{desc}</td>
      <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 800,
        color: '#e74c3c' }}>{bVal != null && !isNaN(bVal) ? fmt(bVal) : '—'}</td>
      <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 800,
        color: '#065f46' }}>{cVal != null && !isNaN(cVal) ? fmt(cVal) : '—'}</td>
    </tr>
  );
}

// ─── SIMPLE TAB ───────────────────────────────────────────────────────────────
function SimpleTab() {
  const [mode, setMode]                   = useState('single');
  const [unit, setUnit]                   = useState('sqft');
  const [plotArea, setPlotArea]           = useState('');
  const [societyBUA, setSocietyBUA]       = useState('');
  const [totalBUA, setTotalBUA]           = useState('');
  const [showUDS, setShowUDS]             = useState(false);
  const [flatMode, setFlatMode]           = useState('uniform');
  const [numFlats, setNumFlats]           = useState('');
  const [uniformCarpet, setUniformCarpet] = useState('');
  const [flats, setFlats]                 = useState(() => [newFlat('A-101'), newFlat('A-102'), newFlat('A-103')]);
  const [result, setResult]               = useState(null);
  const [errors, setErrors]               = useState({});

  const unitLabel = unit === 'sqft' ? 'sq ft' : 'sq m';

  const addFlat    = () => setFlats(f => [...f, newFlat(`Flat ${f.length + 1}`)]);
  const removeFlat = (id) => setFlats(f => f.filter(fl => fl.id !== id));
  const updateFlat = (id, field, val) =>
    setFlats(f => f.map(fl => fl.id === id ? { ...fl, [field]: val } : fl));

  const calculate = () => {
    const errs = {};
    const plot = parseFloat(plotArea);
    if (!plotArea || isNaN(plot) || plot <= 0) errs.plotArea = 'Enter a valid plot area';
    let sBUA, tBUA;
    if (mode === 'multi') {
      sBUA = parseFloat(societyBUA);
      tBUA = parseFloat(totalBUA);
      if (!societyBUA || isNaN(sBUA) || sBUA <= 0) errs.societyBUA = "Enter your society's built-up area";
      if (!totalBUA   || isNaN(tBUA) || tBUA <= 0) errs.totalBUA   = 'Enter total built-up area of all buildings';
      if (!errs.societyBUA && !errs.totalBUA && sBUA > tBUA)
        errs.societyBUA = 'Society BUA cannot exceed total plot BUA';
    }
    let flatDetails = null;
    if (showUDS) {
      if (flatMode === 'uniform') {
        const n = parseInt(numFlats), ca = parseFloat(uniformCarpet);
        if (!numFlats || isNaN(n) || n <= 0) errs.numFlats = 'Enter number of flats';
        if (!uniformCarpet || isNaN(ca) || ca <= 0) errs.uniformCarpet = 'Enter carpet area per flat';
        if (!errs.numFlats && !errs.uniformCarpet)
          flatDetails = Array.from({ length: n }, (_, i) => ({ name: `Flat ${i + 1}`, carpetArea: ca }));
      } else {
        const valid = flats.filter(f => f.carpetArea !== '');
        if (valid.length === 0) errs.flats = 'Add at least one flat with a carpet area';
        else if (valid.some(f => isNaN(parseFloat(f.carpetArea)) || parseFloat(f.carpetArea) <= 0))
          errs.flats = 'All carpet areas must be positive numbers';
        else flatDetails = valid.map(f => ({ name: f.name, carpetArea: parseFloat(f.carpetArea) }));
      }
    }
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    const conveyedArea = mode === 'single' ? plot : (sBUA / tBUA) * plot;
    const sharePercent = mode === 'single' ? 100 : (sBUA / tBUA) * 100;
    let uds = null;
    if (flatDetails) {
      const totalCarpet = flatDetails.reduce((s, f) => s + f.carpetArea, 0);
      uds = flatDetails.map(f => ({
        name: f.name, carpetArea: f.carpetArea,
        sharePct: (f.carpetArea / totalCarpet) * 100,
        udsArea: (f.carpetArea / totalCarpet) * conveyedArea,
      }));
    }
    setResult({ conveyedArea, sharePercent, uds, plot, unit, mode, sBUA, tBUA });
  };

  return (
    <div>
      {/* Mode + Unit toggles */}
      <div className="conv-toggle-row">
        <div className="conv-toggle-group">
          <div className="conv-toggle-label">Building Type</div>
          <div className="conv-toggle-bar">
            {[{ id: 'single', label: '🏢 Single Building' }, { id: 'multi', label: '🏘️ Multi-Building' }].map(o => (
              <button key={o.id} className={`conv-toggle-btn ${mode === o.id ? 'active' : ''}`}
                onClick={() => { setMode(o.id); setResult(null); }}>{o.label}</button>
            ))}
          </div>
        </div>
        <div className="conv-toggle-group">
          <div className="conv-toggle-label">Unit</div>
          <div className="conv-toggle-bar">
            {[{ id: 'sqft', label: 'sq ft' }, { id: 'sqm', label: 'sq m' }].map(o => (
              <button key={o.id} className={`conv-toggle-btn ${unit === o.id ? 'active' : ''}`}
                onClick={() => { setUnit(o.id); setResult(null); }}>{o.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="conv-card">
        <Field label={`Total Plot / Land Area (${unitLabel})`} hint="From 7/12 extract or Property Card" error={errors.plotArea}>
          <NumInput value={plotArea} onChange={v => { setPlotArea(v); setResult(null); }}
            placeholder={unit === 'sqft' ? 'e.g. 10000' : 'e.g. 930'} error={errors.plotArea} />
        </Field>

        {mode === 'multi' && (
          <>
            <div className="conv-info-box">
              <strong>Multi-Building Rule (GR 22 June 2018):</strong> Society's entitlement =
              (Society BUA ÷ Total BUA) × Plot Area
            </div>
            <div className="conv-two-col">
              <Field label={`Your Society's Built-Up Area (${unitLabel})`} hint="Plinth / ground footprint of your building" error={errors.societyBUA}>
                <NumInput value={societyBUA} onChange={v => { setSocietyBUA(v); setResult(null); }} placeholder="e.g. 3200" error={errors.societyBUA} />
              </Field>
              <Field label={`Total Built-Up Area — All Buildings (${unitLabel})`} hint="Sum of all buildings on plot" error={errors.totalBUA}>
                <NumInput value={totalBUA} onChange={v => { setTotalBUA(v); setResult(null); }} placeholder="e.g. 9600" error={errors.totalBUA} />
              </Field>
            </div>
          </>
        )}

        <button className="conv-uds-toggle-btn" onClick={() => setShowUDS(s => !s)}>
          {showUDS ? '▲ Hide' : '▼ Also calculate'} Undivided Share (UDS) per flat
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>optional</span>
        </button>

        {showUDS && (
          <div className="conv-uds-section">
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              {[{ id: 'uniform', label: '📐 All flats same size' }, { id: 'individual', label: '📋 Enter each flat separately' }].map(o => (
                <button key={o.id} className={`conv-toggle-btn ${flatMode === o.id ? 'active' : ''}`}
                  style={{ fontSize: 13 }} onClick={() => setFlatMode(o.id)}>{o.label}</button>
              ))}
            </div>
            {flatMode === 'uniform' ? (
              <div className="conv-two-col">
                <Field label="Number of flats" error={errors.numFlats}>
                  <NumInput value={numFlats} onChange={setNumFlats} placeholder="e.g. 24" error={errors.numFlats} />
                </Field>
                <Field label={`Carpet area per flat (${unitLabel})`} error={errors.uniformCarpet}>
                  <NumInput value={uniformCarpet} onChange={setUniformCarpet} placeholder="e.g. 650" error={errors.uniformCarpet} />
                </Field>
              </div>
            ) : (
              <div>
                {flats.map(fl => (
                  <div key={fl.id} className="conv-flat-row">
                    <input className="form-input" style={{ flex: 2 }} placeholder="Flat name (e.g. A-101)"
                      value={fl.name} onChange={e => updateFlat(fl.id, 'name', e.target.value)} />
                    <input className="form-input" style={{ flex: 1 }} type="number" min="0"
                      placeholder={`Carpet (${unitLabel})`} value={fl.carpetArea}
                      onChange={e => updateFlat(fl.id, 'carpetArea', e.target.value)} />
                    {flats.length > 1 && (
                      <button className="conv-remove-btn" onClick={() => removeFlat(fl.id)}>✕</button>
                    )}
                  </div>
                ))}
                {errors.flats && <div className="conv-error">{errors.flats}</div>}
                <button className="conv-add-flat-btn" onClick={addFlat}>+ Add flat</button>
              </div>
            )}
          </div>
        )}

        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={calculate}>
          Calculate Conveyance Area →
        </button>
      </div>

      {result && (
        <div className="conv-result-section">
          {/* Hero */}
          <div className="conv-result-card">
            <div className="conv-result-label">Area to be Conveyed to Your Society</div>
            <div className="conv-result-value">
              {fmt(result.conveyedArea)}
              <span style={{ fontSize: 22, fontWeight: 400, marginLeft: 8 }}>{unitLabel}</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
              {result.unit === 'sqft'
                ? `= ${fmt(result.conveyedArea / SQ_FT_PER_SQ_M)} sq m`
                : `= ${fmt(result.conveyedArea * SQ_FT_PER_SQ_M)} sq ft`}
            </div>
            {result.mode === 'multi' && (
              <div className="conv-share-badge">Society's share: {fmt(result.sharePercent)}% of total plot</div>
            )}
          </div>

          {/* Breakdown */}
          <div className="conv-breakdown-card">
            <div className="conv-breakdown-title">Calculation Breakdown</div>
            {result.mode === 'single' ? (
              <>
                <div className="conv-breakdown-eq">Conveyed Area = Total Plot Area = <strong>{fmt(result.plot)} {unitLabel}</strong></div>
                <div className="conv-breakdown-note">Single building on plot — entire plot must be conveyed to the society under MOFA Section 11.</div>
              </>
            ) : (
              <>
                <div className="conv-breakdown-eq">Share = {fmt(result.sBUA)} ÷ {fmt(result.tBUA)} = {fmt(result.sharePercent)}%</div>
                <div className="conv-breakdown-eq" style={{ marginTop: 8 }}>
                  Conveyed Area = {fmt(result.sharePercent)}% × {fmt(result.plot)} = <strong>{fmt(result.conveyedArea)} {unitLabel}</strong>
                </div>
                <div className="conv-breakdown-note">Per GR dated 22 June 2018: proportionate share = Society BUA ÷ Total BUA.</div>
              </>
            )}
          </div>

          {/* UDS table */}
          {result.uds && (
            <div className="conv-uds-result">
              <div className="conv-breakdown-title">Undivided Share (UDS) per Flat</div>
              <div className="conv-uds-note">Formula: (Flat carpet area ÷ Total carpet area) × Conveyed area</div>
              <div className="conv-uds-table-wrap">
                <table className="conv-uds-table">
                  <thead>
                    <tr><th>Flat</th><th>Carpet ({unitLabel})</th><th>Share %</th><th>UDS ({unitLabel})</th></tr>
                  </thead>
                  <tbody>
                    {result.uds.slice(0, 50).map((row, i) => (
                      <tr key={i}>
                        <td>{row.name}</td><td>{fmt(row.carpetArea)}</td>
                        <td>{row.sharePct.toFixed(3)}%</td>
                        <td><strong>{fmt(row.udsArea)}</strong></td>
                      </tr>
                    ))}
                    {result.uds.length > 50 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 10 }}>
                        … and {result.uds.length - 50} more flats
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legal basis */}
          <div className="conv-legal-box">
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15, color: '#fff' }}>📜 Legal Basis</div>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
              <li><strong>MOFA Section 11:</strong> Builder must execute conveyance within 4 months of society registration.</li>
              <li><strong>RERA Section 17:</strong> Promoter must convey common areas within 3 months of Occupancy Certificate.</li>
              {result.mode === 'multi' && <li><strong>GR dated 22 June 2018:</strong> Proportionate share based on plinth / built-up area ratio.</li>}
              <li><strong>Deemed Conveyance (MOFA Amendment 2008):</strong> Apply to DDR via{' '}
                <a href="https://mahasahakar.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>PRATYAY portal</a>. DDR must pass order within 6 months.</li>
            </ul>
          </div>

          {/* Next steps */}
          <div className="conv-next-steps">
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>What to Do Next</div>
            <div className="conv-steps-grid">
              {[
                { n: '01', title: 'Verify plot area officially', desc: 'Get 7/12 extract or Property Card from bhulekh.mahabhumi.gov.in or taluka office.' },
                { n: '02', title: 'Check if conveyance is done', desc: "Ask secretary for the Conveyance Deed or Index II in society's name at Sub-Registrar." },
                { n: '03', title: 'Apply for Deemed Conveyance', desc: 'File on PRATYAY portal. DDR must pass the order within 6 months.' },
                { n: '04', title: 'Engage a conveyance advocate', desc: 'Essential for preparing and registering the conveyance deed.' },
              ].map(s => (
                <div key={s.n} className="conv-step-item">
                  <div className="conv-step-num">{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DETAILED TAB (Full PMRDA Area Statement) ─────────────────────────────────
function DetailedTab() {
  // Plot inputs
  const [plotOwn,   setPlotOwn]   = useState('');
  const [deductRd,  setDeductRd]  = useState('0');
  const [authority, setAuthority] = useState('pmrda');
  const [roadWidth, setRoadWidth] = useState('12');
  const [amenityInp,setAmenityInp]= useState('');
  const [recSp,     setRecSp]     = useState('0');
  const [intRd,     setIntRd]     = useState('0');
  // Builder's figures
  const [bPlot,  setBPlot]  = useState('');
  const [bBUA,   setBBUA]   = useState('');
  const [exBUA,  setExBUA]  = useState('0');
  const [bTDR,   setBTDR]   = useState('0');
  const [bPrem,  setBPrem]  = useState('0');
  // Societies
  const [socs, setSocs] = useState([
    { id: 1, name: '', type: 'chs', flats: '', area: '', status: 'done' },
  ]);
  // Results
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('as'); // 'as' | 'fraud' | 'math' | 'doc' | 'steps'
  const [errors, setErrors] = useState({});

  let _socId = socs.length;
  const addSoc = () => {
    setSocs(s => [...s, { id: ++_socId + Date.now(), name: '', type: 'chs', flats: '', area: '', status: 'done' }]);
  };
  const delSoc = (id) => setSocs(s => s.filter(x => x.id !== id));
  const updSoc = (id, field, val) => setSocs(s => s.map(x => x.id === id ? { ...x, [field]: val } : x));

  const calculate = () => {
    const errs = {};
    const plotOwnN = parseFloat(plotOwn);
    if (!plotOwn || isNaN(plotOwnN) || plotOwnN <= 0) errs.plotOwn = 'Enter a valid plot area';
    if (socs.length === 0) errs.socs = 'Add at least one society';
    const hasAreaSoc = socs.some(s => parseFloat(s.area) > 0);
    if (!hasAreaSoc) errs.socs = 'Enter conveyed area for at least one society';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const baseFSI  = BASE_FSI[authority]?.[parseInt(roadWidth)] || 1.10;
    const totalConv = socs.reduce((s, x) => s + (parseFloat(x.area) || 0), 0);
    const pendSocs  = socs.filter(s => s.status !== 'done');
    const bPlotN    = parseFloat(bPlot) || plotOwnN;
    const bBUAN     = parseFloat(bBUA)  || 0;
    const exBUAN    = parseFloat(exBUA) || 0;
    const bTDRN     = parseFloat(bTDR)  || 0;
    const bPremN    = parseFloat(bPrem) || 0;
    const deductRdN = parseFloat(deductRd) || 0;
    const recSpN    = parseFloat(recSp)    || 0;
    const intRdN    = parseFloat(intRd)    || 0;
    const amenInpN  = amenityInp ? parseFloat(amenityInp) : null;

    // Builder's (fraudulent) numbers
    const b_bal    = bPlotN - deductRdN;
    const b_recSp  = recSpN || b_bal * 0.10;
    const b_amen   = amenInpN !== null ? amenInpN : b_bal * AMENITY_PCT;
    const b_npa    = b_bal - b_amen;
    const b_base   = b_npa * baseFSI;
    const b_maxP   = b_npa * PREM_RATE;
    const b_maxT   = b_npa * TDR_RATE;
    const b_slum   = b_maxT * SLUM_PCT;
    const b_res    = b_maxT * RES_PCT;
    const b_totFSI = b_base + bPremN + bTDRN;
    const b_balBUA = Math.max(0, b_totFSI - exBUAN);
    const b_ancil  = b_balBUA * ANCIL_RATE;
    const b_totEnt = b_balBUA + b_ancil;
    const b_maxAll = b_npa * (baseFSI + PREM_RATE + TDR_RATE);
    const b_totMax = b_maxAll + Math.max(0, b_maxAll - exBUAN) * ANCIL_RATE;

    // Correct numbers (excluding conveyed society land)
    const c_plot   = Math.max(0, plotOwnN - totalConv);
    const c_bal    = c_plot - deductRdN;
    const c_recSp  = c_bal * 0.10;
    const c_amen   = c_bal * AMENITY_PCT;
    const c_npa    = Math.max(0, c_bal - c_amen);
    const c_base   = c_npa * baseFSI;
    const c_maxP   = c_npa * PREM_RATE;
    const c_maxT   = c_npa * TDR_RATE;
    const c_slum   = c_maxT * SLUM_PCT;
    const c_res    = c_maxT * RES_PCT;
    const c_totFSI = c_base + Math.min(bPremN, c_maxP) + Math.min(bTDRN, c_maxT);
    const c_balBUA = Math.max(0, c_totFSI - exBUAN);
    const c_ancil  = c_balBUA * ANCIL_RATE;
    const c_totEnt = c_balBUA + c_ancil;
    const c_maxAll = c_npa * (baseFSI + PREM_RATE + TDR_RATE);
    const c_totMax = c_maxAll + Math.max(0, c_maxAll - exBUAN) * ANCIL_RATE;

    const landFraud = Math.max(0, bPlotN - c_plot - totalConv) || Math.max(0, b_npa - c_npa);
    const buaFraud  = bBUAN > 0 ? Math.max(0, bBUAN - c_totMax) : 0;

    setResult({
      totalConv, pendSocs, socs,
      baseFSI, plotOwnN, bPlotN, bBUAN, exBUAN, bTDRN, bPremN,
      deductRdN, recSpN: b_recSp, intRdN, amenInpN,
      b: { bal: b_bal, recSp: b_recSp, amen: b_amen, npa: b_npa, base: b_base,
           maxP: b_maxP, maxT: b_maxT, slum: b_slum, res: b_res,
           totFSI: b_totFSI, balBUA: b_balBUA, ancil: b_ancil, totEnt: b_totEnt, totMax: b_totMax },
      c: { plot: c_plot, bal: c_bal, recSp: c_recSp, amen: c_amen, npa: c_npa, base: c_base,
           maxP: c_maxP, maxT: c_maxT, slum: c_slum, res: c_res,
           totFSI: c_totFSI, balBUA: c_balBUA, ancil: c_ancil, totEnt: c_totEnt, totMax: c_totMax },
      landFraud, buaFraud,
    });
    setActiveTab('as');
  };

  const instrLabel = { chs: 'Conveyance Deed', aoa: 'Deed of Declaration (DOD)', condo: 'DOD / MAOA 1970' };
  const typeLabel  = { chs: 'CHS', aoa: 'AOA', condo: 'Condo' };

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const legalDoc = result ? `AREA STATEMENT — CONVEYED LAND & FSI ENTITLEMENT
Based on UDCPR 2020 | PMRDA Area Statement Format
Date: ${today}

A. LAND CONVEYED TO SOCIETIES
${result.socs.map((s, i) =>
  `  ${i + 1}. ${s.name || '[Name]'} (${typeLabel[s.type] || s.type})
     Area   : ${parseFloat(s.area) || 0} sq.m.
     Flats  : ${s.flats || '—'}
     Instr. : ${instrLabel[s.type] || '—'}
     Status : ${s.status === 'done' ? 'CONVEYED' : s.status === 'partial' ? 'PARTIAL' : 'PENDING'}`
).join('\n\n')}

  ─────────────────────────────────────────
  TOTAL CONVEYED : ${fmt(result.totalConv)} sq.m.

B. AREA STATEMENT — CORRECT FIGURES (After Excluding Conveyed Lands)
  Row 01a  Plot (Ownership Doc)              : ${fmt(result.plotOwnN)} sq.m.
           Less: Conveyed to Societies       : ${fmt(result.totalConv)} sq.m.
           Correct Plot Area                 : ${fmt(result.c.plot)} sq.m.
  Row 02a  Less: Road Surrender              : ${fmt(result.deductRdN)} sq.m.
  Row 03   Balance Area                      : ${fmt(result.c.bal)} sq.m.
  Row 04b  Amenity Space (15%)               : ${fmt(result.c.amen)} sq.m.
  Row 05   NET PLOT AREA (NPA)               : ${fmt(result.c.npa)} sq.m.
  Row 06   Rec. Open Space (10% of Row 03)   : ${fmt(result.c.recSp)} sq.m. (not deducted)
  Row 09   Base FSI BUA (×${result.baseFSI})             : ${fmt(result.c.base)} sq.m.
  Row 10a  Max Premium FSI (NPA × 0.30)      : ${fmt(result.c.maxP)} sq.m.
  Row 11c  Max TDR (NPA × 0.70)              : ${fmt(result.c.maxT)} sq.m.
             Slum TDR (NPA × 0.21)           : ${fmt(result.c.slum)} sq.m.
             Reservation TDR (NPA × 0.49)    : ${fmt(result.c.res)} sq.m.
  Row 13a  Total FSI Entitlement             : ${fmt(result.c.totFSI)} sq.m.
  Row 13b  Less Existing BUA                 : ${fmt(result.exBUAN)} sq.m.
  Row 13d  Balance BUA (13a − 13b)           : ${fmt(result.c.balBUA)} sq.m.
  Row 13e  Ancillary Area (Balance × 0.60)   : ${fmt(result.c.ancil)} sq.m.
  Row 13f  Total Entitlement (13d + 13e)     : ${fmt(result.c.totEnt)} sq.m.
  Row 14   MAX PERMISSIBLE BUA               : ${fmt(result.c.totMax)} sq.m.
           (Base + Full Premium + Full TDR + Ancillary)
${result.bBUAN > 0 ? `
C. BUILDER'S PROPOSED vs CORRECT
  Builder's Claimed Plot Area     : ${fmt(result.bPlotN)} sq.m.
  Correct Plot Area               : ${fmt(result.c.plot)} sq.m.
  Society Land Fraudulently Used  : ${fmt0(result.landFraud)} sq.m.
  Builder's Proposed Total BUA    : ${fmt(result.bBUAN)} sq.m.
  Correct Maximum Permissible BUA : ${fmt(result.c.totMax)} sq.m.
  EXCESS (via society land fraud) : ${fmt0(Math.max(0, result.bBUAN - result.c.totMax))} sq.m.
` : ''}
D. LEGAL BASIS
  1. UDCPR 2020 Reg. 2.2.3 — FSI only on owned/possessed land
  2. UDCPR 2020 Reg. 1.4(v),(vi) — FSI base must exclude conveyed land
  3. MOFA 1963 S.11 — Builder must convey land to society
  4. MCS Act 1960 S.11(3) — Deemed Conveyance right of society
  5. MRTP Act 1966 S.45/51 — Illegal development = revocation
  6. Row 13e: Ancillary = Balance BUA × 0.60
  7. Row 10a: Premium FSI = NPA × 0.30
  8. Row 11c: TDR = NPA × 0.70 (Slum 0.21 + Reservation 0.49)
  9. Row 06: Open Space = 10% of Balance Area (Row 03), not NPA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prepared by: [Society Secretary]   Date: ${today}
[Signature]              [Society Stamp]` : '';

  return (
    <div>
      <div className="grid-2" style={{ gap: 20 }}>
        {/* LEFT */}
        <div>
          <div className="conv-card">
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>📋 Plot Details — Rows 01–03</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>From 7/12 extract, ownership document, sanctioned layout</div>

            <Field label="Area as per Ownership Document / 7-12 (Row 01a)" error={errors.plotOwn}>
              <NumInput value={plotOwn} onChange={v => { setPlotOwn(v); setResult(null); }} placeholder="e.g. 97700" error={errors.plotOwn} />
            </Field>
            <Field label="Area under 15m+ Road to surrender (Row 02a)" hint="Road widening deduction only — internal roads NOT deducted here">
              <NumInput value={deductRd} onChange={setDeductRd} placeholder="0" />
            </Field>
            <Field label="Planning Authority">
              <select className="form-input" value={authority} onChange={e => setAuthority(e.target.value)}>
                <option value="pmrda">PMRDA — Pune Metropolitan Region</option>
                <option value="pmc">PMC — Pune Municipal Corporation</option>
                <option value="pcmc">PCMC — Pimpri-Chinchwad</option>
                <option value="other">Other Municipal Council</option>
              </select>
            </Field>
            <Field label="Road Width in front of plot (determines Base FSI)" hint="UDCPR 2020 Table 6-A">
              <select className="form-input" value={roadWidth} onChange={e => setRoadWidth(e.target.value)}>
                <option value="9">Up to 9m — Base FSI 1.10</option>
                <option value="12">9–15m (12m) — Base FSI 1.10</option>
                <option value="18">15–24m (18m) — Base FSI 1.30</option>
                <option value="24">24–30m (24m) — Base FSI 1.50</option>
                <option value="30">30m+ — Base FSI 1.80</option>
              </select>
            </Field>
          </div>

          <div className="conv-card">
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>🌳 Amenity Space — Rows 04–08</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>NPA = Balance Area − Amenity Space</div>
            <Field label="Amenity Space Proposed (Row 04b)" hint="Leave blank to auto-calculate at 15% of Balance Area">
              <NumInput value={amenityInp} onChange={setAmenityInp} placeholder="auto: 15% of balance area" />
            </Field>
            <Field label="Recreational Open Space (Row 06 — 10% of Row 03, NOT deducted from NPA)">
              <NumInput value={recSp} onChange={setRecSp} placeholder="auto: 10% of balance area" />
            </Field>
            <Field label="Internal Road Area (Row 07 — NOT deducted from NPA)">
              <NumInput value={intRd} onChange={setIntRd} placeholder="e.g. 5812" />
            </Field>
          </div>

          <div className="conv-card">
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>🏗️ Builder's Claimed Figures</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>From builder's area statement / sanction letter — for fraud detection</div>
            <Field label="Builder's Claimed Plot Area (their Row 01c)">
              <NumInput value={bPlot} onChange={setBPlot} placeholder="e.g. 97700" />
            </Field>
            <Field label="Builder's Proposed Total BUA (their Row 15e)">
              <NumInput value={bBUA} onChange={setBBUA} placeholder="e.g. 107564" />
            </Field>
            <Field label="Existing BUA already on plot (Row 13b)">
              <NumInput value={exBUA} onChange={setExBUA} placeholder="e.g. 51435" />
            </Field>
            <Field label="TDR Proposed by Builder (Row 11c proposed)">
              <NumInput value={bTDR} onChange={setBTDR} placeholder="0 if not known" />
            </Field>
            <Field label="Premium FSI Proposed by Builder (Row 10b)">
              <NumInput value={bPrem} onChange={setBPrem} placeholder="0 if not known" />
            </Field>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="conv-card">
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>🏘️ Societies / Associations</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Enter each society and the land conveyed / to be conveyed</div>
            {errors.socs && <div className="conv-error" style={{ marginBottom: 12 }}>{errors.socs}</div>}
            {socs.map((s, i) => (
              <SocietyRow key={s.id} soc={s} index={i}
                onUpdate={(field, val) => updSoc(s.id, field, val)}
                onRemove={() => delSoc(s.id)}
                showRemove={socs.length > 1}
              />
            ))}
            <button className="conv-add-flat-btn" style={{ width: '100%', marginTop: 4 }} onClick={addSoc}>
              + Add Society / Association
            </button>
          </div>

          {/* Formula guide */}
          <div className="conv-card" style={{ background: 'var(--dark)', borderColor: 'var(--dark-2)' }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 14 }}>📖 UDCPR 2020 Formula (PMRDA)</div>
            {[
              { color: 'var(--teal)',    title: 'Row 09 — Base FSI BUA',      body: 'NPA × Base FSI Rate\n(1.10 for <15m | 1.30 for 15–24m | 1.50 for 24–30m | 1.80 for 30m+)' },
              { color: 'var(--orange)',  title: 'Row 10 — Premium FSI',        body: 'Max = NPA × 0.30\nPay premium to PMRDA to unlock' },
              { color: '#2980b9',        title: 'Row 11c — TDR',               body: 'Max = NPA × 0.70\n↳ Slum TDR = NPA × 0.21\n↳ Reservation TDR = NPA × 0.49' },
              { color: '#a855f7',        title: 'Row 13e — Ancillary Area',    body: '= Balance BUA × 0.60\n(Staircase, lift, lobby — not in FSI)\nBalance = Row 13a − Row 13b' },
            ].map((g, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
                borderRadius: 8, borderLeft: `3px solid ${g.color}`, marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-line' }}>{g.body}</div>
              </div>
            ))}
            <div style={{ padding: '10px 12px', background: 'rgba(0,200,150,0.08)',
              border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8, marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>
                Max Total = NPA × (1.10 + 0.30 + 0.70) = NPA × 2.10
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
                Plus Ancillary (60% of Balance BUA) on top · Open Space = 10% of Row 03
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
        onClick={calculate}>
        ⚡ Generate Area Statement & Detect FSI Fraud
      </button>

      <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 10,
        border: '1.5px solid var(--teal)', color: 'var(--teal)', background: 'transparent',
        padding: '12px', borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'var(--font)' }}
        onClick={() => {
          setPlotOwn('97700'); setDeductRd('0'); setAuthority('pmrda'); setRoadWidth('12');
          setAmenityInp('14655'); setRecSp('9900'); setIntRd('5812');
          setBPlot('97700'); setBBUA('107564'); setExBUA('51435'); setBTDR('0'); setBPrem('0');
          setSocs([
            { id: 1, name: 'Solacia Phase I Apartment Association', type: 'aoa', flats: '320', area: '21900', status: 'done' },
            { id: 2, name: 'Solacia Phase II Apartment Association', type: 'aoa', flats: '280', area: '14000', status: 'done' },
            { id: 3, name: 'RMC Garden Phase III Condominium',       type: 'condo', flats: '80', area: '4151', status: 'done' },
            { id: 4, name: 'RMC Garden Phase I CHS Ltd.',            type: 'chs', flats: '110', area: '10392', status: 'done' },
            { id: 5, name: 'Supreme Angan CHS Ltd.',                 type: 'chs', flats: '150', area: '12000', status: 'done' },
            { id: 6, name: 'Ganga Alfa CHS Ltd.',                    type: 'chs', flats: '90',  area: '5131',  status: 'done' },
            { id: 7, name: 'Solacia E1 & E2 CHS Ltd.',               type: 'chs', flats: '120', area: '4600',  status: 'done' },
          ]);
          setResult(null);
        }}>
        📋 Load Example: Gat 1185A, Wagholi
      </button>

      {/* ── RESULTS ────────────────────────────────────────────────────────── */}
      {result && (
        <div style={{ marginTop: 28 }}>

          {/* Hero */}
          <div className="conv-result-card" style={{ marginBottom: 20 }}>
            <div className="conv-result-label">Total Land to be Conveyed to All Societies</div>
            <div className="conv-result-value">{fmt(result.totalConv)}<span style={{ fontSize: 22, fontWeight: 400, marginLeft: 8 }}>sq.m.</span></div>
            <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {result.pendSocs.length > 0 &&
                <span className="badge badge-r">⚠️ {result.pendSocs.length} Conveyance Pending</span>}
              {result.socs.filter(s => s.status === 'done').length > 0 &&
                <span className="badge badge-g">✅ {result.socs.filter(s => s.status === 'done').length} Already Conveyed</span>}
              {result.landFraud > 100 &&
                <span className="badge badge-r">🚨 {fmt0(result.landFraud)} sq.m. Society Land Misused</span>}
              {result.buaFraud > 100 &&
                <span className="badge badge-r">🚨 BUA Overloading Detected</span>}
            </div>
          </div>

          {/* Info boxes */}
          <div className="igrid" style={{ marginBottom: 20 }}>
            {[
              { n: fmt(result.totalConv),  l: 'Total Conveyed (sq.m.)' },
              { n: fmt(result.c.plot),     l: "Builder's Legit Land (sq.m.)" },
              { n: fmt(result.c.npa),      l: 'Correct NPA (sq.m.)' },
              { n: fmt(result.c.base),     l: 'Correct Base BUA' },
              { n: fmt(result.c.maxP),     l: 'Max Premium FSI' },
              { n: fmt(result.c.maxT),     l: 'Max TDR' },
              { n: fmt(result.c.ancil),    l: 'Ancillary (Bal×0.60)' },
              { n: fmt(result.c.totMax),   l: 'Max Total BUA (all FSI)' },
            ].map((x, i) => (
              <div key={i} className="ibox">
                <div className="inum">{x.n}</div>
                <div className="ilbl">{x.l}</div>
              </div>
            ))}
          </div>

          {/* Result tabs */}
          <div className="conv-card">
            <div className="tab-row" style={{ marginBottom: 20 }}>
              {[
                { id: 'as',    label: '📊 Area Statement' },
                { id: 'fraud', label: '🔍 FSI Fraud Check' },
                { id: 'math',  label: '🧮 Workings' },
                { id: 'doc',   label: '📄 Legal Statement' },
                { id: 'steps', label: '🗺️ Next Steps' },
              ].map(t => (
                <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}>{t.label}</button>
              ))}
            </div>

            {/* Area Statement Tab */}
            {activeTab === 'as' && (
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                  📌 <strong style={{ color: 'var(--red)' }}>Red = Builder's figures</strong> (including society land) vs{' '}
                  <strong style={{ color: '#065f46' }}>Green = Correct figures</strong> (after excluding conveyed lands)
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.85)', padding: '10px 14px', textAlign: 'left', fontSize: 11, width: 28 }}>#</th>
                        <th style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.85)', padding: '10px 14px', textAlign: 'left', fontSize: 11 }}>Description</th>
                        <th style={{ background: 'var(--dark)', color: '#f87171', padding: '10px 14px', textAlign: 'right', fontSize: 11 }}>Builder's<br/>Figures (sq.m.)</th>
                        <th style={{ background: 'var(--dark)', color: '#6ee7b7', padding: '10px 14px', textAlign: 'right', fontSize: 11 }}>Correct<br/>Figures (sq.m.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ASSection num="01" title="AREA OF PLOT" />
                      <ASRow num="a"  desc="As per Ownership Document"           bVal={result.bPlotN}    cVal={result.plotOwnN} />
                      <ASRow num=""   desc="Less: Land Conveyed to Societies"    bVal={null}             cVal={result.totalConv} sub />
                      <ASRow num="c"  desc="Minimum Consider Plot Area (correct)" bVal={result.bPlotN}   cVal={result.c.plot} />
                      <ASSection num="02" title="DEDUCTIONS FOR" />
                      <ASRow num="a"  desc="Area under 15m+ Wide Road (surrender)" bVal={result.deductRdN} cVal={result.deductRdN} sub />
                      <ASSection num="03" title="BALANCE AREA OF PLOT (01 – 02a)" />
                      <ASTotalRow desc="Balance Area" bVal={result.b.bal} cVal={result.c.bal} />
                      <ASSection num="04" title="AMENITY SPACE @ 15% (Group Housing)" />
                      <ASRow num="a"  desc="Required @ 15% of Balance Area"      bVal={result.b.bal * 0.15} cVal={result.c.bal * 0.15} sub />
                      <ASRow num="b"  desc="Proposed"                             bVal={result.b.amen}   cVal={result.c.amen} sub />
                      <ASSection num="05" title="NET PLOT AREA — NPA (03 – 04b)" />
                      <ASTotalRow desc="Net Plot Area (NPA)" bVal={result.b.npa} cVal={result.c.npa} />
                      <ASSection num="06" title="RECREATIONAL OPEN SPACE (= 10% of Row 03 — NOT deducted from NPA)" />
                      <ASRow num="a"  desc="Required 10% of Balance Area (Row 03)" bVal={result.b.bal * 0.10} cVal={result.c.bal * 0.10} sub />
                      <ASRow num="b"  desc="Proposed"                              bVal={result.b.recSp}  cVal={result.c.recSp} sub />
                      <ASSection num="07" title="INTERNAL ROAD AREA (for reference — NOT deducted)" />
                      <ASRow num=""   desc="Internal Road Area"                   bVal={result.intRdN}   cVal={result.intRdN} sub />
                      <ASSection num="09" title="FSI PERMISSIBLE — BASE BUA" />
                      <ASRow num=""   desc={`Base FSI Rate: ${result.baseFSI}x`}  bVal={null}            cVal={null} sub />
                      <ASRow num=""   desc={`Base BUA (NPA × ${result.baseFSI})`} bVal={result.b.base}   cVal={result.c.base} />
                      <ASSection num="10" title="PREMIUM FSI ON PAYMENT — Row 10 (Purchasable)" />
                      <ASRow num="a"  desc="Max Permissible Premium FSI (NPA × 0.30)" bVal={result.b.maxP} cVal={result.c.maxP} sub />
                      <ASRow num="b"  desc="Proposed Premium FSI by Builder"     bVal={result.bPremN}   cVal={Math.min(result.bPremN, result.c.maxP)} sub />
                      <ASSection num="11" title="IN-SITU FSI / TDR LOADING — Row 11c" />
                      <ASRow num="c"  desc="TDR Permissible (NPA × 0.70)"        bVal={result.b.maxT}   cVal={result.c.maxT} />
                      <ASRow num=""   desc="  ↳ Slum TDR (NPA × 0.21)"           bVal={result.b.slum}   cVal={result.c.slum} sub />
                      <ASRow num=""   desc="  ↳ Reservation TDR (NPA × 0.49)"    bVal={result.b.res}    cVal={result.c.res} sub />
                      <ASRow num="d"  desc="TDR Proposed by Builder"              bVal={result.bTDRN}    cVal={Math.min(result.bTDRN, result.c.maxT)} sub />
                      <ASSection num="13" title="TOTAL ENTITLEMENT OF FSI — Row 13" />
                      <ASRow num="a"  desc="Total FSI [09 + 10(b) + 11(d)]"      bVal={result.b.totFSI} cVal={result.c.totFSI} />
                      <ASRow num="b"  desc="Less: Existing Built-Up Area (Row 13b)" bVal={result.exBUAN} cVal={result.exBUAN} sub />
                      <ASRow num="d"  desc="Balance Built-Up Area (13a − 13b)"   bVal={result.b.balBUA} cVal={result.c.balBUA} />
                      <ASRow num="e"  desc="Ancillary Area (Balance × 0.60)"     bVal={result.b.ancil}  cVal={result.c.ancil} />
                      <ASRow num="f"  desc="TOTAL (13d + 13e)"                   bVal={result.b.totEnt} cVal={result.c.totEnt} />
                      <ASSection num="14" title="MAXIMUM PERMISSIBLE F.S.I. (Base + Full Premium + Full TDR + Ancillary)" />
                      <ASTotalRow desc="Max Total BUA (incl. Ancillary)" bVal={result.b.totMax} cVal={result.c.totMax} />
                      {result.bBUAN > 0 && (() => {
                        const isFr = result.bBUAN > result.c.totMax + 50;
                        return (
                          <>
                            <ASSection num="15" title="BUILDER'S PROPOSED BUA vs CORRECT MAXIMUM" />
                            <tr style={{ background: isFr ? '#fef2f2' : '#f0fdf4' }}>
                              <td />
                              <td style={{ fontWeight: 700, color: isFr ? 'var(--red)' : '#065f46' }}>
                                Builder's Proposed BUA {isFr ? '🚨 EXCEEDS CORRECT MAXIMUM' : '✅ Within limit'}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: isFr ? 'var(--red)' : '#065f46', fontFamily: 'monospace' }}>
                                {fmt(result.bBUAN)}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: '#065f46', fontFamily: 'monospace' }}>
                                {isFr ? `Max: ${fmt(result.c.totMax)}` : '✅'}
                              </td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Alerts */}
                <div style={{ marginTop: 16 }}>
                  {result.b.npa - result.c.npa > 50 && (
                    <div className="alert ar">
                      <div className="at">🚨 Net Plot Area Inflated by {fmt0(result.b.npa - result.c.npa)} sq.m.</div>
                      Builder's NPA: <strong>{fmt(result.b.npa)} sq.m.</strong> | Correct NPA: <strong>{fmt(result.c.npa)} sq.m.</strong><br />
                      This inflates every downstream figure — Base BUA, Premium cap, TDR cap, and Ancillary.<br />
                      <strong>UDCPR 2020 Reg. 2.2.3:</strong> FSI computed only on land owned by and in possession of the applicant.
                    </div>
                  )}
                  {result.bBUAN > 0 && result.bBUAN > result.c.totMax + 50 && (
                    <div className="alert ar">
                      <div className="at">🚨 Proposed BUA {fmt(result.bBUAN)} sq.m. Exceeds Correct Maximum of {fmt(result.c.totMax)} sq.m.</div>
                      Excess: <strong>{fmt0(result.bBUAN - result.c.totMax)} sq.m.</strong> — achievable only by including society land in FSI base.
                    </div>
                  )}
                  {result.pendSocs.length > 0 && (
                    <div className="alert ao">
                      <div className="at">⚠️ Conveyance Pending for {result.pendSocs.length} Society</div>
                      {result.pendSocs.map(s => (
                        <div key={s.id}>• <strong>{s.name || '[Unnamed]'}</strong>: {s.area || '?'} sq.m. — file Deemed Conveyance with DDR</div>
                      ))}
                    </div>
                  )}
                  {result.b.npa - result.c.npa <= 50 && result.bBUAN <= result.c.totMax + 50 && (
                    <div className="alert ag">
                      <div className="at">✅ Calculations Complete</div>
                      Enter builder's claimed area and BUA to enable automatic fraud detection.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FSI Fraud Check Tab */}
            {activeTab === 'fraud' && (
              <div>
                <div className="alert ab" style={{ marginBottom: 16 }}>
                  <div className="at">ℹ️ How Ancillary Area Works (Row 13e)</div>
                  Ancillary = <strong>Balance BUA × 0.60</strong> — NOT a separate FSI rate on NPA.<br />
                  Balance BUA = Total FSI (Row 13a) − Existing BUA (Row 13b).<br />
                  When builder inflates NPA by including society land, Balance BUA inflates, and Ancillary inflates too — a cascading fraud effect.
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.8)', padding: '10px 14px', textAlign: 'left', fontSize: 11 }}>FSI Component</th>
                        <th style={{ background: 'var(--dark)', color: '#f87171', padding: '10px 14px', textAlign: 'right', fontSize: 11 }}>Builder ({fmt0(result.bPlotN)} sq.m.)</th>
                        <th style={{ background: 'var(--dark)', color: '#6ee7b7', padding: '10px 14px', textAlign: 'right', fontSize: 11 }}>Correct ({fmt0(result.c.plot)} sq.m.)</th>
                        <th style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.6)', padding: '10px 14px', textAlign: 'right', fontSize: 11 }}>Excess</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Net Plot Area (NPA)',                       result.b.npa,    result.c.npa],
                        [`Base FSI BUA (×${result.baseFSI})`,         result.b.base,   result.c.base],
                        ['Max Premium FSI (×0.30)',                   result.b.maxP,   result.c.maxP],
                        ['Max TDR (×0.70)',                           result.b.maxT,   result.c.maxT],
                        [`Max Total FSI BUA (×${(result.baseFSI+0.30+0.70).toFixed(2)})`, result.b.npa*(result.baseFSI+0.30+0.70), result.c.npa*(result.baseFSI+0.30+0.70)],
                        ['Less: Existing BUA',                        result.exBUAN,   result.exBUAN],
                        ['Balance BUA (Row 13d)',                     result.b.balBUA, result.c.balBUA],
                        ['Ancillary (Balance × 0.60) — Row 13e',     result.b.ancil,  result.c.ancil],
                        ['TOTAL MAX PERMISSIBLE (13d + 13e)',         result.b.totMax, result.c.totMax],
                      ].map(([lbl, bv, cv], i) => {
                        const ex = bv - cv;
                        return (
                          <tr key={i} style={Math.abs(ex) > 0.5 ? { background: '#fef2f2' } : {}}>
                            <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)' }}>{lbl}</td>
                            <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right', color: '#e74c3c', fontFamily: 'monospace', fontWeight: 600 }}>{fmt(bv)}</td>
                            <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right', color: '#065f46', fontFamily: 'monospace', fontWeight: 600 }}>{fmt(cv)}</td>
                            <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right', color: ex > 0.5 ? 'var(--red)' : 'var(--text-muted)', fontFamily: 'monospace', fontWeight: ex > 0.5 ? 700 : 400 }}>
                              {Math.abs(ex) > 0.5 ? (ex > 0 ? '+' : '') + fmt0(ex) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                      {result.bBUAN > 0 && (
                        <tr style={{ background: result.bBUAN > result.c.totMax + 50 ? '#fef2f2' : '#f0fdf4' }}>
                          <td style={{ padding: '9px 14px', fontWeight: 700 }}>Builder's ACTUAL Proposed BUA</td>
                          <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--red)', fontFamily: 'monospace', fontWeight: 800 }}>{fmt(result.bBUAN)}</td>
                          <td style={{ padding: '9px 14px', textAlign: 'right', color: '#065f46', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(result.c.totMax)} (max)</td>
                          <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 800, color: result.bBUAN > result.c.totMax + 50 ? 'var(--red)' : '#065f46' }}>
                            {result.bBUAN > result.c.totMax + 50 ? `🚨 +${fmt0(result.bBUAN - result.c.totMax)}` : '✅ OK'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {result.bBUAN > 0 && result.bBUAN > result.c.totMax + 50 && (
                  <div className="alert ar" style={{ marginTop: 14 }}>
                    <div className="at">🚨 Mathematical Conclusion: BUA of {fmt(result.bBUAN)} sq.m. is Impossible Without Society Land</div>
                    On legitimate land of <strong>{fmt(result.c.plot)} sq.m.</strong>, maximum BUA (base + full premium + full TDR + full ancillary) = <strong>{fmt(result.c.totMax)} sq.m.</strong><br />
                    Builder proposes <strong>{fmt(result.bBUAN)} sq.m.</strong> — excess of <strong>{fmt0(result.bBUAN - result.c.totMax)} sq.m.</strong><br />
                    Only achievable by loading FSI on the <strong>{fmt0(result.totalConv)} sq.m.</strong> of society land.<br />
                    <strong>Cite:</strong> UDCPR 2020 Reg. 2.2.3, MRTP Act S.45/51
                  </div>
                )}
              </div>
            )}

            {/* Math Workings Tab */}
            {activeTab === 'math' && (
              <div style={{ background: 'var(--dark)', borderRadius: 12, padding: 22,
                fontFamily: 'Courier New, monospace', fontSize: 12,
                color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, overflowX: 'auto' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>═══ BUILDER'S CALCULATION (Including Society Land — ALLEGED) ═══</div>
                {[
                  [`01. Plot claimed`, `${fmt(result.bPlotN)}`, '#f87171'],
                  [`03. Balance (01 - Road ${fmt(result.deductRdN)})`, `${fmt(result.b.bal)}`, '#f87171'],
                  [`04. Amenity 15% of Balance`, `${fmt(result.b.amen)}`, null],
                  [`05. Net Plot Area (NPA)`, `${fmt(result.b.npa)}`, '#f87171'],
                  [`06. Rec. Open Space (10% of Row 03)`, `${fmt(result.b.bal * 0.10)} (not deducted)`, null],
                  [`09. Base BUA (${fmt(result.b.npa)} × ${result.baseFSI})`, `${fmt(result.b.base)}`, '#f87171'],
                  [`10a. Max Premium (NPA × 0.30)`, `${fmt(result.b.maxP)}`, '#f87171'],
                  [`11c. Max TDR (NPA × 0.70)`, `${fmt(result.b.maxT)}  [Slum: ${fmt(result.b.slum)}  Res: ${fmt(result.b.res)}]`, '#f87171'],
                  [`13a. Total FSI (Base+Prem+TDR)`, `${fmt(result.b.totFSI)}`, '#f87171'],
                  [`13b. Less Existing BUA`, `${fmt(result.exBUAN)}`, null],
                  [`13d. Balance BUA (13a − 13b)`, `${fmt(result.b.balBUA)}`, '#f87171'],
                  [`13e. Ancillary (${fmt(result.b.balBUA)} × 0.60)`, `${fmt(result.b.ancil)}`, '#f87171'],
                  [`13f. Total Entitlement`, `${fmt(result.b.totEnt)}`, '#f87171'],
                  [`    Max possible (all FSI + Ancil)`, `${fmt(result.b.totMax)}`, '#f87171'],
                ].map(([label, val, color], i) => (
                  <div key={i}>
                    <span style={{ color: 'var(--teal)' }}>{label.split('(')[0]}</span>
                    {label.includes('(') && <span style={{ color: 'rgba(255,255,255,0.4)' }}>({label.split('(')[1]}</span>}
                    <span> = </span>
                    <span style={{ color: color || '#fff', fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>═══ CORRECT CALCULATION (Excluding {fmt(result.totalConv)} sq.m. Conveyed) ═══</div>
                {[
                  [`01. Plot (${fmt(result.plotOwnN)} − ${fmt(result.totalConv)})`, `${fmt(result.c.plot)}`, '#6ee7b7'],
                  [`03. Balance`, `${fmt(result.c.bal)}`, '#6ee7b7'],
                  [`04. Amenity 15% of Balance`, `${fmt(result.c.amen)}`, null],
                  [`05. Net Plot Area (NPA)`, `${fmt(result.c.npa)}`, '#6ee7b7'],
                  [`06. Rec. Open Space (10% of Row 03)`, `${fmt(result.c.bal * 0.10)} (not deducted)`, null],
                  [`09. Base BUA (${fmt(result.c.npa)} × ${result.baseFSI})`, `${fmt(result.c.base)}`, '#6ee7b7'],
                  [`10a. Max Premium (NPA × 0.30)`, `${fmt(result.c.maxP)}`, '#6ee7b7'],
                  [`11c. Max TDR (NPA × 0.70)`, `${fmt(result.c.maxT)}  [Slum: ${fmt(result.c.slum)}  Res: ${fmt(result.c.res)}]`, '#6ee7b7'],
                  [`13a. Total FSI`, `${fmt(result.c.totFSI)}`, '#6ee7b7'],
                  [`13b. Less Existing BUA`, `${fmt(result.exBUAN)}`, null],
                  [`13d. Balance BUA (13a − 13b)`, `${fmt(result.c.balBUA)}`, '#6ee7b7'],
                  [`13e. Ancillary (${fmt(result.c.balBUA)} × 0.60)`, `${fmt(result.c.ancil)}`, '#6ee7b7'],
                  [`13f. Total Entitlement`, `${fmt(result.c.totEnt)}`, '#6ee7b7'],
                  [`    Max possible (all FSI + Ancil)`, `${fmt(result.c.totMax)}`, '#6ee7b7'],
                ].map(([label, val, color], i) => (
                  <div key={i}>
                    <span style={{ color: 'var(--teal)' }}>{label.split('(')[0]}</span>
                    {label.includes('(') && <span style={{ color: 'rgba(255,255,255,0.4)' }}>({label.split('(')[1]}</span>}
                    <span> = </span>
                    <span style={{ color: color || '#fff', fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
                <div style={{ borderTop: '2px solid rgba(0,200,150,0.3)', marginTop: 12, paddingTop: 10,
                  color: 'var(--teal)', fontSize: 13, fontWeight: 800 }}>
                  LAND FRAUDULENTLY INCLUDED:  {fmt0(result.landFraud)} sq.m. of society land{'\n'}
                  EXCESS BUA VIA FRAUD:        {result.bBUAN > 0 ? fmt0(result.bBUAN - result.c.totMax) + ' sq.m.' : '(enter builder BUA to calculate)'}{'\n'}
                  CORRECT MAX PERMISSIBLE BUA: {fmt(result.c.totMax)} sq.m.
                </div>
              </div>
            )}

            {/* Legal Statement Tab */}
            {activeTab === 'doc' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Ready for DDR application, RERA complaint, court affidavit, or PMRDA objection letter.
                </p>
                <pre style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
                  padding: 18, fontSize: 12, lineHeight: 1.85, whiteSpace: 'pre-wrap',
                  maxHeight: 450, overflowY: 'auto', fontFamily: 'Courier New, monospace' }}>
                  {legalDoc}
                </pre>
                <button className="btn-primary" style={{ marginTop: 10 }}
                  onClick={() => navigator.clipboard.writeText(legalDoc).then(() => alert('Copied!'))}>
                  📋 Copy to Clipboard
                </button>
                <button onClick={() => window.print()}
                  style={{ marginLeft: 8, marginTop: 10, padding: '10px 20px', background: 'var(--white)',
                    color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  🖨️ Print
                </button>
              </div>
            )}

            {/* Next Steps Tab */}
            {activeTab === 'steps' && (
              <div className="sl">
                {[
                  { n: '1', c: '#0369a1', t: 'File RTI for Builder\'s Area Statement',
                    d: `Apply to PMRDA/PMC under RTI Act 2005 for certified copy of the area statement, FSI calculation sheet, and ownership documents. Compare their Row 01c (${fmt0(result.bPlotN)} sq.m.) with your correct figure (${fmt0(result.c.plot)} sq.m.) — this is the smoking gun.` },
                  { n: '2', c: '#065f46', t: 'Use This Statement as Exhibit',
                    d: 'Attach this area statement to your complaint to PMRDA, DDR, RERA, or court. It mirrors the official PMRDA format row-by-row and shows exactly how much FSI is over-claimed at each step.' },
                  ...(result.pendSocs.length > 0 ? [{
                    n: '3', c: '#92400e', t: 'File Deemed Conveyance for Pending Societies',
                    d: result.pendSocs.map(s => s.name || '[Society]').join(', ') + ' — file under Section 11 MCS Act with DDR. Once registered, 7/12 mutation updates and builder loses legal claim on that land area.',
                  }] : []),
                  { n: '4', c: '#e74c3c', t: 'File PMRDA Objection Under MRTP Act Section 51',
                    d: `State that the building permission is based on inflated plot area of ${fmt0(result.bPlotN)} sq.m. instead of legitimate ${fmt0(result.c.plot)} sq.m. Attach this area statement. Demand revocation under MRTP Act Section 51.` },
                  { n: '5', c: '#7c3aed', t: 'Pass MC Resolution Protecting FSI Rights',
                    d: `Pass resolution: "This society does not consent to pooling of FSI from our ${fmt(result.totalConv)} sq.m. conveyed land with any other plot or developer." File with PMRDA, Sub-Registrar, and society records.` },
                ].map(s => (
                  <div key={s.n} className="si" style={{ borderLeft: `4px solid ${s.c}` }}>
                    <div className="sn2" style={{ background: s.c }}>{s.n}</div>
                    <div>
                      <div className="st">{s.t}</div>
                      <div className="sd">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ConveyanceCalculatorPage() {
  const [mainTab, setMainTab] = useState('simple');

  return (
    <div className="section">
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="section-title">
            Conveyance Area <span>Calculator</span>
          </h1>
          <p className="section-sub">
            Calculate your society's land entitlement, FSI permissibility, and detect builder fraud —
            based on the exact PMRDA Area Statement format and UDCPR 2020.
          </p>
        </div>

        {/* Main tab selector */}
        <div style={{ maxWidth: 780, margin: '0 auto 32px', display: 'flex',
          background: 'var(--white)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 6, gap: 6 }}>
          {[
            { id: 'simple',   label: '🏠 Simple Conveyance Calculator', sub: 'Area entitlement + UDS per flat' },
            { id: 'detailed', label: '📐 Full PMRDA Area Statement',     sub: 'FSI + TDR + Ancillary + Fraud Detection' },
          ].map(t => (
            <button key={t.id}
              onClick={() => setMainTab(t.id)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: mainTab === t.id ? 'var(--teal)' : 'transparent',
                color: mainTab === t.id ? '#fff' : 'var(--text-muted)',
                fontFamily: 'var(--font)', textAlign: 'center', transition: 'all 0.2s',
              }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t.label}</div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        <div style={{ maxWidth: mainTab === 'detailed' ? 1140 : 780, margin: '0 auto' }}>
          {mainTab === 'simple'   && <SimpleTab />}
          {mainTab === 'detailed' && <DetailedTab />}
        </div>

        {/* Disclaimer */}
        <div style={{ maxWidth: mainTab === 'detailed' ? 1140 : 780, margin: '24px auto 0',
          padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a',
          borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
          ⚠️ This platform provides general legal information only. It is not a substitute for professional
          legal advice. Calculations are based on UDCPR 2020 and actual PMRDA area statement formats —
          always verify from certified 7/12 extracts, approved layout plans, and conveyance deeds.
          For conveyance deed preparation and court proceedings, consult a qualified advocate and
          town planner.
        </div>

      </div>
    </div>
  );
}
