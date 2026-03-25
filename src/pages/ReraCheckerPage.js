import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

const RERA_SEARCH_URL = 'https://maharera.maharashtra.gov.in/';
const RERA_PROJECT_SEARCH = 'https://maharera.maharashtra.gov.in/projects-search-result';
const RERA_PROMOTER_SEARCH = 'https://maharera.maharashtra.gov.in/promoters-search-result';

const STEPS = [
  {
    num: '01',
    title: 'Open MahaRERA Portal',
    desc: 'Click the "Search on MahaRERA" button below. The official portal will open in a new tab. If the link is slow, go directly to maharera.maharashtra.gov.in.',
  },
  {
    num: '02',
    title: 'Search by Project or Builder Name',
    desc: 'Click "Registered Projects" in the menu. Type the project name or builder (promoter) name in the search box. Try partial names if full name doesn\'t match.',
  },
  {
    num: '03',
    title: 'Verify Registration Status',
    desc: 'Check the status column — it must say "New Project" or "Renewed". If it shows "Lapsed", "Cancelled", or nothing at all, the builder is selling illegally.',
  },
  {
    num: '04',
    title: 'Check Completion Date',
    desc: 'Note the proposed completion date. If it is in the past by more than 1 year with no extension, that\'s a delay red flag. Check if the builder applied for extension.',
  },
  {
    num: '05',
    title: 'Review Quarterly Updates',
    desc: 'A compliant builder uploads quarterly progress reports and CA certificates. Click on the project → "Quarterly Reports". No uploads for 6+ months is a red flag.',
  },
  {
    num: '06',
    title: 'Check Complaints Filed',
    desc: 'On the project page, look for the number of complaints filed by buyers. High complaint count signals a problematic builder.',
  },
  {
    num: '07',
    title: 'Verify Sanctioned vs Sold Units',
    desc: 'The portal shows total sanctioned units vs units sold. If sold > sanctioned, the builder is overselling — a major fraud indicator.',
  },
];

const RED_FLAGS = [
  { icon: '🚨', text: 'Project not found on MahaRERA at all — selling without registration is illegal under RERA Section 3', severity: 'Critical' },
  { icon: '🚨', text: 'Registration status is "Lapsed" or "Cancelled" — builder cannot sell or take new bookings', severity: 'Critical' },
  { icon: '🔴', text: 'Proposed completion date overdue by 1+ years with no extension applied', severity: 'High' },
  { icon: '🔴', text: 'No quarterly progress reports uploaded in the last 6 months', severity: 'High' },
  { icon: '🔴', text: 'Builder name on RERA differs from name on your sale agreement', severity: 'High' },
  { icon: '🟠', text: 'Units sold on RERA is very close to or exceeds sanctioned units', severity: 'Medium' },
  { icon: '🟠', text: 'Multiple consumer complaints filed on the project page', severity: 'Medium' },
  { icon: '🟠', text: 'Escrow account balance appears very low compared to total project cost', severity: 'Medium' },
  { icon: '🟡', text: 'CA certificate not uploaded for the current financial year', severity: 'Low' },
  { icon: '🟡', text: 'Project address or layout details differ from brochure/agreement', severity: 'Low' },
];

const GREEN_FLAGS = [
  '✅ Valid RERA registration (not lapsed/cancelled)',
  '✅ Completion date is future-dated or recently extended with valid reason',
  '✅ Quarterly progress reports uploaded consistently',
  '✅ CA certificate uploaded for current year',
  '✅ Zero or very few complaints on portal',
  '✅ Builder name exactly matches sale agreement',
  '✅ Sanctioned units >> sold units (plenty of unsold inventory, no overselling)',
];

const SEVERITY_COLORS = {
  Critical: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
  High: { bg: '#fff1f0', text: '#c0392b', border: '#f1948a' },
  Medium: { bg: '#fffbeb', text: '#d97706', border: '#fcd34d' },
  Low: { bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
};

export default function ReraCheckerPage() {
  const { navigate } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('project'); // project | builder | regno

  const buildSearchUrl = () => {
    if (!query.trim()) return RERA_SEARCH_URL;
    if (searchType === 'builder') return RERA_PROMOTER_SEARCH;
    return RERA_PROJECT_SEARCH;
  };

  const openMahaRERA = () => {
    window.open(buildSearchUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <div className="page-header-band">
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to Home</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: '#eff6ff' }}>⚖️</div>
            <div className="page-header-text">
              <div className="page-header-title">RERA Registration Checker</div>
              <div className="page-header-desc">Verify your builder on MahaRERA · Know exactly what red flags to look for</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
      <div className="container">

        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {/* Search Card */}
          <div className="rera-search-card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { id: 'project', label: '🏗️ Project Name' },
                { id: 'builder', label: '👷 Builder / Promoter' },
                { id: 'regno', label: '🔢 RERA Reg. No.' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSearchType(opt.id)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 20,
                    border: '1.5px solid',
                    borderColor: searchType === opt.id ? 'var(--teal)' : 'var(--border)',
                    background: searchType === opt.id ? 'var(--teal)' : 'var(--white)',
                    color: searchType === opt.id ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="form-input"
                style={{ flex: 1, fontSize: 15 }}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && openMahaRERA()}
                placeholder={
                  searchType === 'project' ? 'e.g. Lodha Palava, Godrej Woods...' :
                  searchType === 'builder' ? 'e.g. Lodha Developers, Kolte Patil...' :
                  'e.g. P51900012345'
                }
              />
              <button
                className="btn-primary"
                onClick={openMahaRERA}
                style={{ whiteSpace: 'nowrap' }}
              >
                Search on MahaRERA →
              </button>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
              This will open the official MahaRERA portal in a new tab with your search pre-loaded.
              Registration No. format for Pune: <strong>P52100XXXXX</strong> · Mumbai: <strong>P51800XXXXX</strong>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <a
                href={RERA_PROJECT_SEARCH}
                target="_blank"
                rel="noopener noreferrer"
                className="rera-ext-link"
              >
                🏗️ All Registered Projects
              </a>
              <a
                href={RERA_PROMOTER_SEARCH}
                target="_blank"
                rel="noopener noreferrer"
                className="rera-ext-link"
              >
                👷 All Registered Builders
              </a>
              <a
                href="https://maharera.maharashtra.gov.in/complaints-search-result"
                target="_blank"
                rel="noopener noreferrer"
                className="rera-ext-link"
              >
                📋 Complaints Filed
              </a>
            </div>
          </div>

          {/* Step Guide */}
          <div style={{ marginTop: 36, marginBottom: 36 }}>
            <div className="rera-section-heading">How to Check on MahaRERA — Step by Step</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STEPS.map(s => (
                <div key={s.num} className="rera-step">
                  <div className="rera-step-num">{s.num}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags & Green Flags */}
          <div className="rera-flags-grid">
            {/* Red flags */}
            <div>
              <div className="rera-section-heading" style={{ color: '#dc2626' }}>🚨 Red Flags — Walk Away</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {RED_FLAGS.map((f, i) => {
                  const col = SEVERITY_COLORS[f.severity];
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 14px',
                        background: col.bg,
                        border: `1px solid ${col.border}`,
                        borderRadius: 10,
                      }}
                    >
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{f.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, lineHeight: 1.55, color: '#1a2636' }}>{f.text}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: col.text }}>{f.severity} Risk</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Green flags */}
            <div>
              <div className="rera-section-heading" style={{ color: '#16a34a' }}>✅ Green Flags — Proceed with Confidence</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GREEN_FLAGS.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      borderRadius: 10,
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: '#1a2636',
                    }}
                  >
                    {f}
                  </div>
                ))}
                <div style={{ padding: '14px 16px', background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 10, fontSize: 13, color: 'var(--teal)', fontWeight: 600, lineHeight: 1.6 }}>
                  💡 Even if RERA checks out, always verify title, OC, and society formation.
                  Use our <strong>Pre-Purchase Checklist</strong> for a full 25-point verification.
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: 28, padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
            ⚠️ This platform provides general legal information only. Always verify directly on the official MahaRERA portal (maharera.maharashtra.gov.in). This tool does not connect to MahaRERA's database — it opens the official portal for you to check directly. For legal matters, consult a qualified advocate.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
