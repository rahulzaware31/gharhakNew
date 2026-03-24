import React, { useState } from 'react';

const SQ_FT_PER_SQ_M = 10.7639;
const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
let _id = 0;
const newFlat = (label) => ({ id: ++_id, name: label, carpetArea: '' });

export default function ConveyanceCalculatorPage() {
  const [mode, setMode]                   = useState('single'); // 'single' | 'multi'
  const [unit, setUnit]                   = useState('sqft');
  const [plotArea, setPlotArea]           = useState('');
  const [societyBUA, setSocietyBUA]       = useState('');
  const [totalBUA, setTotalBUA]           = useState('');
  const [showUDS, setShowUDS]             = useState(false);
  const [flatMode, setFlatMode]           = useState('uniform'); // 'uniform' | 'individual'
  const [numFlats, setNumFlats]           = useState('');
  const [uniformCarpet, setUniformCarpet] = useState('');
  const [flats, setFlats]                 = useState(() => [newFlat('A-101'), newFlat('A-102'), newFlat('A-103')]);
  const [result, setResult]               = useState(null);
  const [errors, setErrors]               = useState({});

  const unitLabel = unit === 'sqft' ? 'sq ft' : 'sq m';

  // ── Flat list helpers ──────────────────────────────────────────────────────
  const addFlat    = () => setFlats(f => [...f, newFlat(`Flat ${f.length + 1}`)]);
  const removeFlat = (id) => setFlats(f => f.filter(fl => fl.id !== id));
  const updateFlat = (id, field, val) =>
    setFlats(f => f.map(fl => fl.id === id ? { ...fl, [field]: val } : fl));

  // ── Calculate ──────────────────────────────────────────────────────────────
  const calculate = () => {
    const errs = {};
    const plot = parseFloat(plotArea);
    if (!plotArea || isNaN(plot) || plot <= 0) errs.plotArea = 'Enter a valid plot area';

    let sBUA, tBUA;
    if (mode === 'multi') {
      sBUA = parseFloat(societyBUA);
      tBUA = parseFloat(totalBUA);
      if (!societyBUA || isNaN(sBUA) || sBUA <= 0) errs.societyBUA = 'Enter your society\'s built-up area';
      if (!totalBUA  || isNaN(tBUA) || tBUA <= 0)  errs.totalBUA   = 'Enter total built-up area of all buildings';
      if (!errs.societyBUA && !errs.totalBUA && sBUA > tBUA)
        errs.societyBUA = 'Society BUA cannot exceed total plot BUA';
    }

    let flatDetails = null;
    if (showUDS) {
      if (flatMode === 'uniform') {
        const n  = parseInt(numFlats);
        const ca = parseFloat(uniformCarpet);
        if (!numFlats      || isNaN(n)  || n  <= 0) errs.numFlats      = 'Enter number of flats';
        if (!uniformCarpet || isNaN(ca) || ca <= 0) errs.uniformCarpet = 'Enter carpet area per flat';
        if (!errs.numFlats && !errs.uniformCarpet)
          flatDetails = Array.from({ length: n }, (_, i) => ({ name: `Flat ${i + 1}`, carpetArea: ca }));
      } else {
        const valid = flats.filter(f => f.carpetArea !== '');
        if (valid.length === 0)
          errs.flats = 'Add at least one flat with a carpet area';
        else if (valid.some(f => isNaN(parseFloat(f.carpetArea)) || parseFloat(f.carpetArea) <= 0))
          errs.flats = 'All carpet areas must be positive numbers';
        else
          flatDetails = valid.map(f => ({ name: f.name, carpetArea: parseFloat(f.carpetArea) }));
      }
    }

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    // Core area calculation
    let conveyedArea, sharePercent;
    if (mode === 'single') {
      conveyedArea = plot;
      sharePercent = 100;
    } else {
      sharePercent = (sBUA / tBUA) * 100;
      conveyedArea = (sBUA / tBUA) * plot;
    }

    // UDS per flat
    let uds = null;
    if (flatDetails) {
      const totalCarpet = flatDetails.reduce((s, f) => s + f.carpetArea, 0);
      uds = flatDetails.map(f => ({
        name:       f.name,
        carpetArea: f.carpetArea,
        sharePct:   (f.carpetArea / totalCarpet) * 100,
        udsArea:    (f.carpetArea / totalCarpet) * conveyedArea,
      }));
    }

    setResult({ conveyedArea, sharePercent, uds, plot, unit, mode, sBUA, tBUA });
  };

  const reset = () => { setResult(null); setErrors({}); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="section">
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="section-title">Conveyance Area <span>Calculator</span></h1>
          <p className="section-sub">
            Calculate the exact land area your housing society is entitled to under MOFA 1963 and
            the MCS Act — for regular conveyance or deemed conveyance proceedings.
          </p>
        </div>

        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          {/* ── Mode + Unit toggles ───────────────────────────────────────── */}
          <div className="conv-toggle-row">
            <div className="conv-toggle-group">
              <div className="conv-toggle-label">Building Type</div>
              <div className="conv-toggle-bar">
                {[
                  { id: 'single', label: '🏢 Single Building on Plot' },
                  { id: 'multi',  label: '🏘️ Multi-Building Complex' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    className={`conv-toggle-btn ${mode === opt.id ? 'active' : ''}`}
                    onClick={() => { setMode(opt.id); reset(); }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            <div className="conv-toggle-group">
              <div className="conv-toggle-label">Unit</div>
              <div className="conv-toggle-bar">
                {[{ id: 'sqft', label: 'sq ft' }, { id: 'sqm', label: 'sq m' }].map(opt => (
                  <button
                    key={opt.id}
                    className={`conv-toggle-btn ${unit === opt.id ? 'active' : ''}`}
                    onClick={() => { setUnit(opt.id); reset(); }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Input card ────────────────────────────────────────────────── */}
          <div className="conv-card">

            {/* Plot area */}
            <div className="conv-field-group">
              <label className="conv-label">
                Total Plot / Land Area ({unitLabel})
                <span className="conv-hint">From 7/12 extract or Property Card</span>
              </label>
              <input
                className={`form-input ${errors.plotArea ? 'conv-input-error' : ''}`}
                type="number"
                min="0"
                placeholder={unit === 'sqft' ? 'e.g. 10000' : 'e.g. 930'}
                value={plotArea}
                onChange={e => { setPlotArea(e.target.value); setResult(null); }}
              />
              {errors.plotArea && <div className="conv-error">{errors.plotArea}</div>}
            </div>

            {/* Multi-building extra fields */}
            {mode === 'multi' && (
              <>
                <div className="conv-info-box">
                  <strong>Multi-Building Rule (GR 22 June 2018):</strong> When multiple buildings share one plot,
                  each society's entitlement = <strong>(Society's Built-Up Area ÷ Total Built-Up Area) × Plot Area</strong>
                </div>
                <div className="conv-two-col">
                  <div className="conv-field-group">
                    <label className="conv-label">
                      Your Society's Built-Up Area ({unitLabel})
                      <span className="conv-hint">Plinth / ground footprint of your building only</span>
                    </label>
                    <input
                      className={`form-input ${errors.societyBUA ? 'conv-input-error' : ''}`}
                      type="number"
                      min="0"
                      placeholder="e.g. 3200"
                      value={societyBUA}
                      onChange={e => { setSocietyBUA(e.target.value); setResult(null); }}
                    />
                    {errors.societyBUA && <div className="conv-error">{errors.societyBUA}</div>}
                  </div>
                  <div className="conv-field-group">
                    <label className="conv-label">
                      Total Built-Up Area — All Buildings ({unitLabel})
                      <span className="conv-hint">Sum of plinth area of every building on the plot</span>
                    </label>
                    <input
                      className={`form-input ${errors.totalBUA ? 'conv-input-error' : ''}`}
                      type="number"
                      min="0"
                      placeholder="e.g. 9600"
                      value={totalBUA}
                      onChange={e => { setTotalBUA(e.target.value); setResult(null); }}
                    />
                    {errors.totalBUA && <div className="conv-error">{errors.totalBUA}</div>}
                  </div>
                </div>
              </>
            )}

            {/* UDS section toggle */}
            <button className="conv-uds-toggle-btn" onClick={() => setShowUDS(s => !s)}>
              {showUDS ? '▲ Hide' : '▼ Also calculate'} Undivided Share (UDS) per flat
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>optional</span>
            </button>

            {showUDS && (
              <div className="conv-uds-section">
                <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                  {[
                    { id: 'uniform',    label: '📐 All flats same size' },
                    { id: 'individual', label: '📋 Enter each flat separately' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      className={`conv-toggle-btn ${flatMode === opt.id ? 'active' : ''}`}
                      style={{ fontSize: 13 }}
                      onClick={() => setFlatMode(opt.id)}
                    >{opt.label}</button>
                  ))}
                </div>

                {flatMode === 'uniform' ? (
                  <div className="conv-two-col">
                    <div className="conv-field-group">
                      <label className="conv-label">Number of flats</label>
                      <input
                        className={`form-input ${errors.numFlats ? 'conv-input-error' : ''}`}
                        type="number"
                        min="1"
                        placeholder="e.g. 24"
                        value={numFlats}
                        onChange={e => setNumFlats(e.target.value)}
                      />
                      {errors.numFlats && <div className="conv-error">{errors.numFlats}</div>}
                    </div>
                    <div className="conv-field-group">
                      <label className="conv-label">Carpet area per flat ({unitLabel})</label>
                      <input
                        className={`form-input ${errors.uniformCarpet ? 'conv-input-error' : ''}`}
                        type="number"
                        min="0"
                        placeholder="e.g. 650"
                        value={uniformCarpet}
                        onChange={e => setUniformCarpet(e.target.value)}
                      />
                      {errors.uniformCarpet && <div className="conv-error">{errors.uniformCarpet}</div>}
                    </div>
                  </div>
                ) : (
                  <div>
                    {flats.map(fl => (
                      <div key={fl.id} className="conv-flat-row">
                        <input
                          className="form-input"
                          style={{ flex: 2 }}
                          placeholder="Flat name (e.g. A-101)"
                          value={fl.name}
                          onChange={e => updateFlat(fl.id, 'name', e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          type="number"
                          min="0"
                          placeholder={`Carpet (${unitLabel})`}
                          value={fl.carpetArea}
                          onChange={e => updateFlat(fl.id, 'carpetArea', e.target.value)}
                        />
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

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={calculate}
            >
              Calculate Conveyance Area →
            </button>
          </div>

          {/* ── Results ───────────────────────────────────────────────────── */}
          {result && (
            <div className="conv-result-section">

              {/* Main answer */}
              <div className="conv-result-card">
                <div className="conv-result-label">Area to be Conveyed to Your Society</div>
                <div className="conv-result-value">
                  {fmt(result.conveyedArea)}
                  <span style={{ fontSize: 22, fontWeight: 400, marginLeft: 8 }}>{unitLabel}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  {result.unit === 'sqft'
                    ? `= ${fmt(result.conveyedArea / SQ_FT_PER_SQ_M)} sq m`
                    : `= ${fmt(result.conveyedArea * SQ_FT_PER_SQ_M)} sq ft`}
                </div>
                {result.mode === 'multi' && (
                  <div className="conv-share-badge">
                    Society's share: {fmt(result.sharePercent)}% of the total plot
                  </div>
                )}
              </div>

              {/* Calculation breakdown */}
              <div className="conv-breakdown-card">
                <div className="conv-breakdown-title">Calculation Breakdown</div>
                {result.mode === 'single' ? (
                  <>
                    <div className="conv-breakdown-eq">
                      Conveyed Area = Total Plot Area = <strong>{fmt(result.plot)} {unitLabel}</strong>
                    </div>
                    <div className="conv-breakdown-note">
                      Single building on plot — the entire plot must be conveyed to the society under MOFA Section 11.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="conv-breakdown-eq">
                      Share = {fmt(result.sBUA)} ÷ {fmt(result.tBUA)} = {fmt(result.sharePercent)}%
                    </div>
                    <div className="conv-breakdown-eq" style={{ marginTop: 8 }}>
                      Conveyed Area = {fmt(result.sharePercent)}% × {fmt(result.plot)} = <strong>{fmt(result.conveyedArea)} {unitLabel}</strong>
                    </div>
                    <div className="conv-breakdown-note">
                      Per GR dated 22 June 2018: Society's share = (Society BUA ÷ Total BUA) × Plot Area.
                    </div>
                  </>
                )}
              </div>

              {/* UDS table */}
              {result.uds && (
                <div className="conv-uds-result">
                  <div className="conv-breakdown-title">Undivided Share (UDS) per Flat</div>
                  <div className="conv-uds-note">
                    Formula: (Flat carpet area ÷ Total carpet area) × Conveyed area
                  </div>
                  <div className="conv-uds-table-wrap">
                    <table className="conv-uds-table">
                      <thead>
                        <tr>
                          <th>Flat</th>
                          <th>Carpet ({unitLabel})</th>
                          <th>Share %</th>
                          <th>UDS ({unitLabel})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.uds.slice(0, 50).map((row, i) => (
                          <tr key={i}>
                            <td>{row.name}</td>
                            <td>{fmt(row.carpetArea)}</td>
                            <td>{row.sharePct.toFixed(3)}%</td>
                            <td><strong>{fmt(row.udsArea)}</strong></td>
                          </tr>
                        ))}
                        {result.uds.length > 50 && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '10px' }}>
                              … and {result.uds.length - 50} more flats
                              (UDS = {fmt(result.uds[0].udsArea)} {unitLabel} each)
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Legal basis */}
              <div className="conv-legal-box">
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>📜 Legal Basis</div>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2, fontSize: 14 }}>
                  <li>
                    <strong>MOFA Section 11:</strong> Builder must execute conveyance within 4 months
                    of society registration. Failure allows the society to apply for Deemed Conveyance.
                  </li>
                  <li>
                    <strong>RERA Section 17:</strong> Promoter must convey common areas to the society
                    within 3 months of issuing the Occupancy Certificate.
                  </li>
                  {result.mode === 'multi' && (
                    <li>
                      <strong>GR dated 22 June 2018:</strong> In a multi-building layout, each society receives
                      its proportionate share of the plot based on plinth / built-up area ratio.
                    </li>
                  )}
                  <li>
                    <strong>Deemed Conveyance (MOFA Amendment 2008):</strong> If the builder refuses,
                    the society applies to the District Deputy Registrar. Online via the{' '}
                    <a href="https://mahasahakar.maharashtra.gov.in" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--teal)' }}>PRATYAY portal</a>.
                    The DDR must pass the order within 6 months.
                  </li>
                </ul>
              </div>

              {/* Next steps */}
              <div className="conv-next-steps">
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>What to Do Next</div>
                <div className="conv-steps-grid">
                  {[
                    {
                      n: '01',
                      title: 'Verify plot area officially',
                      desc: 'Get the 7/12 extract (for agricultural land) or Property Card (urban land) from bhulekh.mahabhumi.gov.in or your taluka office.',
                    },
                    {
                      n: '02',
                      title: 'Check if conveyance is done',
                      desc: 'Ask the society secretary for the Conveyance Deed or Index II registered in the society\'s name at the Sub-Registrar office.',
                    },
                    {
                      n: '03',
                      title: 'Apply for Deemed Conveyance if pending',
                      desc: 'File online at the PRATYAY portal (mahasahakar.maharashtra.gov.in). The DDR must pass the order within 6 months.',
                    },
                    {
                      n: '04',
                      title: 'Engage a conveyance advocate',
                      desc: 'An advocate experienced in housing society matters is essential for preparing and registering the conveyance deed at the Sub-Registrar office.',
                    },
                  ].map(s => (
                    <div key={s.n} className="conv-step-item">
                      <div className="conv-step-num">{s.n}</div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Disclaimer */}
          <div style={{ marginTop: 24, padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
            ⚠️ This platform provides general legal information only. It is not a substitute for professional legal advice.
            Calculations are based on information you enter — always verify plot area from official government records (7/12 / Property Card).
            For conveyance deed preparation and registration, consult a qualified advocate.
          </div>

        </div>
      </div>
    </div>
  );
}
