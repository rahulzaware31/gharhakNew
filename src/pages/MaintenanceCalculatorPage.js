import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toNum = (v) => parseFloat(v) || 0;
const fmt = (n) =>
  n == null || isNaN(n)
    ? '—'
    : '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ─── CHS calculation (MCS Act 1960, Bye-Law 68) ───────────────────────────────
function calcCHS(f) {
  const {
    apportionment,
    carpetArea,
    totalCarpetArea,
    totalFlats,
    monthlyExpenses,
    constructionCost,
    coveredParking,
    openParking,
    waterCharges,
    nonOccupancy,
  } = f;

  const flats = toNum(totalFlats);
  const expenses = toNum(monthlyExpenses);
  const myCarpet = toNum(carpetArea);
  const totalCarpet = toNum(totalCarpetArea);

  let serviceCharge = 0;
  if (apportionment === 'equal') {
    serviceCharge = flats > 0 ? expenses / flats : 0;
  } else {
    serviceCharge =
      totalCarpet > 0 ? (myCarpet / totalCarpet) * expenses : 0;
  }

  // Sinking fund: min 0.25% of construction cost p.a. per flat
  const sinkingFund =
    flats > 0 ? (toNum(constructionCost) * 0.0025) / 12 / flats : 0;

  // Non-occupancy surcharge: max 10% of service charge (Bye-Law 43)
  const nocSurcharge = nonOccupancy ? serviceCharge * 0.1 : 0;

  const parking = toNum(coveredParking) + toNum(openParking);
  const water = toNum(waterCharges);

  const total = serviceCharge + sinkingFund + nocSurcharge + parking + water;

  return { serviceCharge, sinkingFund, nocSurcharge, parking, water, total };
}

// ─── Apartment / AOA calculation (MAOA 1970) ──────────────────────────────────
function calcApartment(f) {
  const { carpetArea, maintenanceRate, sinkingRate, parkingCharges, waterCharges } = f;
  const area = toNum(carpetArea);
  const maintenance = area * toNum(maintenanceRate);
  const sinkingFund = area * toNum(sinkingRate);
  const parking = toNum(parkingCharges);
  const water = toNum(waterCharges);
  const total = maintenance + sinkingFund + parking + water;
  return { maintenance, sinkingFund, parking, water, total };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="conv-field-group">
      <label className="conv-label">
        {label}
        {hint && <span className="conv-hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, placeholder }) {
  return (
    <input
      className="form-input"
      type="number"
      min="0"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function BreakdownRow({ label, value, highlight }) {
  return (
    <div className={`maint-breakdown-row${highlight ? ' maint-breakdown-row--total' : ''}`}>
      <span className="maint-breakdown-label">{label}</span>
      <span className="maint-breakdown-value">{fmt(value)}</span>
    </div>
  );
}

// ─── CHS Form ─────────────────────────────────────────────────────────────────
function CHSForm({ fields, onChange }) {
  return (
    <div className="conv-card">
      <div className="maint-card-section-title">🏢 Your Flat</div>

      <Field label="Apportionment Method" hint="How your society divides common expenses">
        <div className="conv-toggle-bar">
          {[
            { value: 'equal', label: 'Equal per flat' },
            { value: 'area', label: 'Proportional to carpet area' },
          ].map((opt) => (
            <button
              key={opt.value}
              className={`conv-toggle-btn${fields.apportionment === opt.value ? ' active' : ''}`}
              onClick={() => onChange('apportionment', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      {fields.apportionment === 'area' && (
        <div className="conv-two-col">
          <Field label="Your Carpet Area" hint="sq ft">
            <NumInput value={fields.carpetArea} onChange={(v) => onChange('carpetArea', v)} placeholder="650" />
          </Field>
          <Field label="Total Carpet Area of All Flats" hint="sq ft">
            <NumInput value={fields.totalCarpetArea} onChange={(v) => onChange('totalCarpetArea', v)} placeholder="52000" />
          </Field>
        </div>
      )}

      <div className="conv-two-col">
        <Field label="Total Number of Flats" hint="in your building/wing">
          <NumInput value={fields.totalFlats} onChange={(v) => onChange('totalFlats', v)} placeholder="80" />
        </Field>
        <Field label="Total Monthly Common Expenses" hint="₹ — electricity, security, housekeeping, lift AMC, etc.">
          <NumInput value={fields.monthlyExpenses} onChange={(v) => onChange('monthlyExpenses', v)} placeholder="160000" />
        </Field>
      </div>

      <div className="maint-card-section-title" style={{ marginTop: 4 }}>💰 Sinking Fund</div>
      <Field
        label="Total Building Construction Cost"
        hint="₹ — Sinking fund = 0.25% p.a. ÷ 12 months ÷ no. of flats (Bye-Law 68)"
      >
        <NumInput value={fields.constructionCost} onChange={(v) => onChange('constructionCost', v)} placeholder="50000000" />
      </Field>
      <div className="conv-info-box">
        Minimum sinking fund under MCS Act Bye-Law 68: <strong>0.25% of construction cost per annum</strong>, shared equally among all flats.
      </div>

      <div className="maint-card-section-title" style={{ marginTop: 4 }}>🚗 Parking &amp; Water</div>
      <div className="conv-two-col">
        <Field label="Covered Parking Charges" hint="₹/month (if applicable)">
          <NumInput value={fields.coveredParking} onChange={(v) => onChange('coveredParking', v)} placeholder="0" />
        </Field>
        <Field label="Open Parking Charges" hint="₹/month (if applicable)">
          <NumInput value={fields.openParking} onChange={(v) => onChange('openParking', v)} placeholder="0" />
        </Field>
      </div>
      <Field label="Water Charges" hint="₹/month (metered or fixed)">
        <NumInput value={fields.waterCharges} onChange={(v) => onChange('waterCharges', v)} placeholder="0" />
      </Field>

      <div className="maint-card-section-title" style={{ marginTop: 4 }}>👤 Occupancy Status</div>
      <Field label="Is this flat self-occupied?" hint="Non-occupants pay an extra 10% surcharge (Bye-Law 43)">
        <div className="conv-toggle-bar">
          {[
            { value: false, label: 'Self-occupied' },
            { value: true, label: 'Not self-occupied (tenant / vacant)' },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              className={`conv-toggle-btn${fields.nonOccupancy === opt.value ? ' active' : ''}`}
              onClick={() => onChange('nonOccupancy', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Apartment Form ────────────────────────────────────────────────────────────
function ApartmentForm({ fields, onChange }) {
  return (
    <div className="conv-card">
      <div className="maint-card-section-title">🏠 Your Apartment</div>

      <Field label="Your Carpet Area" hint="sq ft">
        <NumInput value={fields.carpetArea} onChange={(v) => onChange('carpetArea', v)} placeholder="750" />
      </Field>

      <div className="conv-two-col">
        <Field label="Maintenance Rate" hint="₹ per sq ft per month">
          <NumInput value={fields.maintenanceRate} onChange={(v) => onChange('maintenanceRate', v)} placeholder="3.50" />
        </Field>
        <Field label="Sinking Fund Rate" hint="₹ per sq ft per month">
          <NumInput value={fields.sinkingRate} onChange={(v) => onChange('sinkingRate', v)} placeholder="0.50" />
        </Field>
      </div>

      <div className="conv-info-box">
        In MAOA apartments, maintenance is typically charged per sq ft of carpet area. The rate is fixed by the Association of Apartment Owners (AAO) at their AGM.
      </div>

      <div className="maint-card-section-title" style={{ marginTop: 4 }}>🚗 Parking &amp; Water</div>
      <div className="conv-two-col">
        <Field label="Parking Charges" hint="₹/month">
          <NumInput value={fields.parkingCharges} onChange={(v) => onChange('parkingCharges', v)} placeholder="0" />
        </Field>
        <Field label="Water Charges" hint="₹/month">
          <NumInput value={fields.waterCharges} onChange={(v) => onChange('waterCharges', v)} placeholder="0" />
        </Field>
      </div>
    </div>
  );
}

// ─── CHS Results ──────────────────────────────────────────────────────────────
function CHSResults({ result, fields }) {
  if (result.total === 0) return null;
  return (
    <div className="conv-result-section">
      <div className="conv-result-card">
        <div className="conv-result-label">Your Monthly Maintenance (CHS)</div>
        <div className="conv-result-value">{fmt(result.total)}</div>
        <div className="conv-share-badge">Per Month</div>
      </div>

      <div className="conv-breakdown-card">
        <div className="conv-breakdown-title">Breakdown</div>
        <BreakdownRow label="Service Charge" value={result.serviceCharge} />
        <BreakdownRow label="Sinking Fund" value={result.sinkingFund} />
        {result.nocSurcharge > 0 && (
          <BreakdownRow label="Non-Occupancy Surcharge (10%)" value={result.nocSurcharge} />
        )}
        {result.parking > 0 && <BreakdownRow label="Parking" value={result.parking} />}
        {result.water > 0 && <BreakdownRow label="Water Charges" value={result.water} />}
        <BreakdownRow label="Total" value={result.total} highlight />
      </div>

      <div className="conv-breakdown-card">
        <div className="conv-breakdown-title">Legal Reference</div>
        <div className="maint-legal-list">
          <div className="maint-legal-item">
            <span className="maint-legal-badge">MCS Act 1960</span>
            <span>Governs Co-operative Housing Societies in Maharashtra</span>
          </div>
          <div className="maint-legal-item">
            <span className="maint-legal-badge">Bye-Law 68</span>
            <span>Service charges and sinking fund contribution</span>
          </div>
          <div className="maint-legal-item">
            <span className="maint-legal-badge">Bye-Law 43</span>
            <span>
              Non-occupancy surcharge: <strong>max 10%</strong> of service charge.
              Any higher charge is illegal and can be challenged at the Registrar's office.
            </span>
          </div>
          {fields.apportionment === 'area' && (
            <div className="maint-legal-item">
              <span className="maint-legal-badge">Proportional</span>
              <span>Area-based apportionment must be approved by AGM resolution</span>
            </div>
          )}
        </div>
      </div>

      <div className="maint-alert-box">
        ⚠️ <strong>Your rights:</strong> If your society charges more than the calculated amount without an AGM resolution, you can file a complaint with the <strong>District Deputy Registrar (DDR)</strong> under Section 91 of the MCS Act.
      </div>

      <div className="maint-disclaimer">
        This platform provides general legal information only. It is not a substitute for professional legal advice. For court proceedings, consult a qualified advocate.
      </div>
    </div>
  );
}

// ─── Apartment Results ────────────────────────────────────────────────────────
function ApartmentResults({ result }) {
  if (result.total === 0) return null;
  return (
    <div className="conv-result-section">
      <div className="conv-result-card">
        <div className="conv-result-label">Your Monthly Maintenance (Apartment)</div>
        <div className="conv-result-value">{fmt(result.total)}</div>
        <div className="conv-share-badge">Per Month</div>
      </div>

      <div className="conv-breakdown-card">
        <div className="conv-breakdown-title">Breakdown</div>
        <BreakdownRow label="Maintenance Charges" value={result.maintenance} />
        <BreakdownRow label="Sinking Fund" value={result.sinkingFund} />
        {result.parking > 0 && <BreakdownRow label="Parking" value={result.parking} />}
        {result.water > 0 && <BreakdownRow label="Water Charges" value={result.water} />}
        <BreakdownRow label="Total" value={result.total} highlight />
      </div>

      <div className="conv-breakdown-card">
        <div className="conv-breakdown-title">Legal Reference</div>
        <div className="maint-legal-list">
          <div className="maint-legal-item">
            <span className="maint-legal-badge">MAOA 1970</span>
            <span>Maharashtra Apartment Ownership Act — governs apartment associations</span>
          </div>
          <div className="maint-legal-item">
            <span className="maint-legal-badge">Section 14</span>
            <span>Maintenance charges must be decided by the Association of Apartment Owners at a duly convened meeting</span>
          </div>
          <div className="maint-legal-item">
            <span className="maint-legal-badge">Note</span>
            <span>Unlike CHS, apartments under MAOA typically use per-sq-ft rates. Charges must be proportional and transparent.</span>
          </div>
        </div>
      </div>

      <div className="maint-alert-box">
        ⚠️ <strong>Your rights:</strong> If maintenance is raised without a valid AAO meeting resolution, you can challenge it. Demand a copy of the meeting minutes and audited accounts under MAOA Section 14.
      </div>

      <div className="maint-disclaimer">
        This platform provides general legal information only. It is not a substitute for professional legal advice. For court proceedings, consult a qualified advocate.
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const DEFAULT_CHS = {
  apportionment: 'equal',
  carpetArea: '',
  totalCarpetArea: '',
  totalFlats: '',
  monthlyExpenses: '',
  constructionCost: '',
  coveredParking: '',
  openParking: '',
  waterCharges: '',
  nonOccupancy: false,
};

const DEFAULT_APT = {
  carpetArea: '',
  maintenanceRate: '',
  sinkingRate: '',
  parkingCharges: '',
  waterCharges: '',
};

export default function MaintenanceCalculatorPage() {
  const { navigate } = useContext(AppContext);
  const [mode, setMode] = useState('chs');
  const [chsFields, setChsFields] = useState(DEFAULT_CHS);
  const [aptFields, setAptFields] = useState(DEFAULT_APT);

  const handleCHSChange = (key, val) => setChsFields((prev) => ({ ...prev, [key]: val }));
  const handleAptChange = (key, val) => setAptFields((prev) => ({ ...prev, [key]: val }));

  const chsResult = calcCHS(chsFields);
  const aptResult = calcApartment(aptFields);

  return (
    <div className="page-wrap">
      <div className="container">
        <button className="page-back-btn" onClick={() => navigate('home')}>
          ← Back to Home
        </button>

        {/* Header */}
        <div className="maint-header">
          <div className="maint-header-icon">🧮</div>
          <div>
            <h1 className="maint-title">Maintenance Calculator</h1>
            <p className="maint-subtitle mr">देखभाल शुल्क कॅल्क्युलेटर</p>
            <p className="maint-desc">
              Calculate your legally correct monthly maintenance for CHS or Apartment.
              Know what you <em>should</em> be paying — and challenge any excess.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="maint-mode-bar">
          <button
            className={`maint-mode-btn${mode === 'chs' ? ' active' : ''}`}
            onClick={() => setMode('chs')}
          >
            🏢 CHS (Co-operative Housing Society)
          </button>
          <button
            className={`maint-mode-btn${mode === 'apt' ? ' active' : ''}`}
            onClick={() => setMode('apt')}
          >
            🏠 Apartment (MAOA)
          </button>
        </div>

        {/* Law info pill */}
        <div className="maint-law-pill">
          {mode === 'chs'
            ? '📖 MCS Act 1960 · Bye-Laws 43 & 68 · District Deputy Registrar jurisdiction'
            : '📖 Maharashtra Apartment Ownership Act 1970 · Section 14'}
        </div>

        {/* Two-column layout */}
        <div className="maint-layout">
          {/* Left: inputs */}
          <div className="maint-inputs">
            {mode === 'chs' ? (
              <CHSForm fields={chsFields} onChange={handleCHSChange} />
            ) : (
              <ApartmentForm fields={aptFields} onChange={handleAptChange} />
            )}
          </div>

          {/* Right: results */}
          <div className="maint-results">
            {mode === 'chs' ? (
              chsResult.total > 0 ? (
                <CHSResults result={chsResult} fields={chsFields} />
              ) : (
                <div className="maint-empty-state">
                  <div className="maint-empty-icon">🧮</div>
                  <p>Fill in the details on the left to see your maintenance calculation.</p>
                </div>
              )
            ) : aptResult.total > 0 ? (
              <ApartmentResults result={aptResult} />
            ) : (
              <div className="maint-empty-state">
                <div className="maint-empty-icon">🧮</div>
                <p>Fill in the details on the left to see your maintenance calculation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
