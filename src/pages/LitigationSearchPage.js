import React, { useState, useMemo } from 'react';
import {
  DEVELOPER_LITIGATIONS,
  searchLitigations,
  getDeveloperNames,
  getProjectNames,
  getLitigationStats,
} from '../data/litigations';

const STATUS_STYLES = {
  Resolved: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', label: '✓ Resolved' },
  Ongoing:  { bg: '#fffbf0', border: '#fde68a', color: '#92400e', label: '⏳ Ongoing' },
  Pending:  { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af', label: '◷ Pending' },
  default:  { bg: 'var(--bg)', border: 'var(--border)', color: 'var(--text-muted)', label: 'Case' },
};

function LitigationCard({ item }) {
  const status = STATUS_STYLES[item.status] || STATUS_STYLES.default;
  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Card header */}
      <div style={{ background: 'var(--dark)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
            {item.projectName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700, marginTop: 3 }}>
            {item.developerName}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            📍 {item.location}
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>{item.year}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: status.bg, border: `1px solid ${status.border}`, color: status.color,
          }}>{status.label}</span>
          <span style={{ padding: '3px 10px', background: 'var(--teal-light)', color: 'var(--teal-dark)',
            borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
            {item.litigationType}
          </span>
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 14 }}>
          {item.description}
        </div>

        {/* Outcome */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '10px 14px', marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            Outcome
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)' }}>{item.outcome}</div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Court / Forum</div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.court}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Case No.</div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.caseNumber}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Affected</div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.plaintiffCount} residents</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</div>
            <div style={{ fontWeight: 700, color: 'var(--teal-dark)' }}>{item.amount}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {item.sourceUrl && (
        <div style={{ padding: '10px 18px 14px', borderTop: '1px solid var(--border)' }}>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none' }}>
            📎 View Source / Order →
          </a>
        </div>
      )}
    </div>
  );
}

export default function LitigationSearchPage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const stats = useMemo(() => getLitigationStats(), []);
  const suggestions = useMemo(() => {
    const all = [...getDeveloperNames(), ...getProjectNames()];
    if (query.trim().length < 2) return [];
    const term = query.toLowerCase().trim();
    return [...new Set(all.filter(n => n.toLowerCase().includes(term) && n.toLowerCase() !== term))].slice(0, 6);
  }, [query]);

  const results = useMemo(() => {
    if (!submitted) return [];
    return searchLitigations(query);
  }, [query, submitted]);

  const handleSearch = (term) => {
    const q = (term ?? query).trim();
    setQuery(q);
    setSubmitted(true);
  };

  const showAll = () => {
    setQuery('');
    setSubmitted(true);
  };

  const displayed = submitted && query.trim() === '' ? DEVELOPER_LITIGATIONS : results;

  return (
    <div className="section">
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
            Developer & Project Litigation Search
          </div>
          <h1 className="section-title">Check a Builder's <span>Track Record</span></h1>
          <p className="section-sub" style={{ maxWidth: 600, margin: '0 auto' }}>
            Search by developer or project name to see past litigations — RERA orders,
            consumer forum verdicts, and court cases filed by flat owners and societies.
          </p>
        </div>

        {/* Search box */}
        <div style={{ maxWidth: 680, margin: '0 auto 28px', position: 'relative' }}>
          <div style={{
            background: 'var(--dark)', borderRadius: 16, padding: '18px 22px',
            display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              className="form-input"
              style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
              placeholder="Enter developer or project — e.g. 'Lodha' or 'Palava City'"
              value={query}
              onChange={e => { setQuery(e.target.value); setSubmitted(false); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-primary" style={{ flexShrink: 0 }}
              onClick={() => handleSearch()} disabled={!query.trim()}>
              Search
            </button>
          </div>

          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && !submitted && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, zIndex: 20,
              background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12,
              boxShadow: '0 8px 28px rgba(0,0,0,0.12)', overflow: 'hidden',
            }}>
              {suggestions.map((s, i) => (
                <button key={i}
                  onClick={() => handleSearch(s)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '11px 18px',
                    background: 'transparent', border: 'none', borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                    fontSize: 14, color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  🔍 {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={showAll}
              style={{ background: 'transparent', border: 'none', color: 'var(--teal)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
              Or browse all {stats.total} litigations →
            </button>
          </div>
        </div>

        {/* Stats bar — shown before any search */}
        {!submitted && (
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            {[
              { n: stats.total, l: 'Total Litigations' },
              { n: stats.resolved, l: 'Resolved' },
              { n: stats.ongoing, l: 'Ongoing' },
              { n: stats.totalPlaintiffs.toLocaleString('en-IN'), l: 'Residents Represented' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14,
                padding: '16px 24px', textAlign: 'center', minWidth: 130,
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal-dark)' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Results header */}
        {submitted && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              {displayed.length > 0
                ? <>Found <span style={{ color: 'var(--teal-dark)' }}>{displayed.length}</span> {displayed.length === 1 ? 'litigation' : 'litigations'}{query.trim() && <> for "{query.trim()}"</>}</>
                : <>No litigations found{query.trim() && <> for "{query.trim()}"</>}</>}
            </div>
          </div>
        )}

        {/* Results grid */}
        {submitted && displayed.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {displayed.map(item => <LitigationCard key={item.id} item={item} />)}
          </div>
        )}

        {/* Empty state */}
        {submitted && displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No litigations on record</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
              We don't have any litigation records for "{query.trim()}" yet. This does not mean the
              developer or project is litigation-free — always verify independently on MahaRERA and IndianKanoon.
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 40, padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a',
          borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
          ⚠️ This litigation database is compiled for educational and awareness purposes and may be incomplete
          or simplified. It is not a substitute for professional legal advice. For court proceedings, consult a
          qualified advocate. Always verify case details on official sources (MahaRERA, IndianKanoon) before relying on them.
        </div>

      </div>
    </div>
  );
}
