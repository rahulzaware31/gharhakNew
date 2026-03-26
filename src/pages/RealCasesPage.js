import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'all',          label: 'All',              icon: '📚', query: 'Maharashtra housing rights flat owner builder fraud court judgment RERA 2024' },
  { id: 'judgment',     label: 'Court Judgments',  icon: '⚖️', query: 'Bombay High Court Supreme Court housing society builder judgment Maharashtra 2024' },
  { id: 'rera',         label: 'RERA Orders',      icon: '🏛️', query: 'MahaRERA order flat owner wins builder penalty possession delay Maharashtra 2024' },
  { id: 'consumer',     label: 'Consumer Forum',   icon: '🛒', query: 'consumer forum NCDRC Maharashtra builder deficiency service flat owner wins 2024' },
  { id: 'rti',          label: 'RTI Success',      icon: '📋', query: 'RTI success Maharashtra housing society builder information obtained 2024' },
  { id: 'news',         label: 'Builder Fraud News',icon: '📰', query: 'builder fraud arrested Maharashtra housing society cheating flat owners news 2024' },
];

const TYPE_STYLES = {
  judgment: { bg: '#0f1923', accent: '#00c896',  label: 'Court Judgment' },
  rera:     { bg: '#0d2240', accent: '#7fc8f8',  label: 'RERA Order' },
  consumer: { bg: '#1e0a38', accent: '#d8b4fe',  label: 'Consumer Forum' },
  rti:      { bg: '#0a2010', accent: '#86efac',  label: 'RTI Success' },
  news:     { bg: '#2d0d0d', accent: '#fca5a5',  label: 'News Article' },
  default:  { bg: '#1a2636', accent: '#00c896',  label: 'Case / Article' },
};

const WIN_MESSAGES = [
  'Flat owner won', 'Society won', 'Residents won',
  'Buyer won', 'Members won', 'Complainant won',
];

async function fetchCases(query) {
  const SYSTEM = `You are a Maharashtra housing rights researcher. Return ONLY a valid JSON array of 6 real recent cases, judgments, RERA orders, consumer forum verdicts, RTI outcomes, or news articles about Maharashtra housing rights based on the query.

Each item must have ALL these fields:
- title: string (headline, max 12 words)
- type: one of "judgment" | "rera" | "consumer" | "rti" | "news"
- court_or_source: string (e.g. "Bombay High Court" / "MahaRERA" / "Times of India")
- citation_or_date: string (case citation OR publication date)
- location: string (city/district in Maharashtra)
- summary: string (2-3 sentences — what happened, who filed, what was the issue)
- outcome: string (1 sentence — specific result: amount awarded, order passed, penalty imposed)
- resident_won: boolean (true if flat owner/society won)
- win_detail: string (e.g. "Rs. 4.2 lakh compensation awarded" or "Builder ordered to convey land")
- law_cited: string (key law/section applied e.g. "RERA 2016 § 18")
- url: string (real URL — use indiankanoon.org for judgments, maharerait.maharashtra.gov.in for RERA, timesofindia.com/livelaw.in/barandbench.com for news)
- year: number

Focus on cases where flat owners or societies WON. Return ONLY the JSON array. No markdown, no explanation.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: query },
      ],
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '[]';
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed)) throw new Error('Invalid response format');
  return parsed;
}

function CaseCard({ item }) {
  const style = TYPE_STYLES[item.type] || TYPE_STYLES.default;
  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Card header */}
      <div style={{ background: style.bg, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, color: style.accent, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            {style.label}
          </span>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
            {item.court_or_source}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
            {item.citation_or_date} · {item.location}
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>{item.year}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.4, color: 'var(--dark)', marginBottom: 10 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 14 }}>
          {item.summary}
        </div>

        {/* Outcome */}
        <div style={{
          background: item.resident_won ? '#f0fdf4' : '#fef9ec',
          border: `1px solid ${item.resident_won ? '#bbf7d0' : '#fde68a'}`,
          borderRadius: 9, padding: '10px 14px', marginBottom: 12,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: item.resident_won ? '#166534' : '#92400e',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            {item.resident_won ? '✓ Outcome — Resident Won' : '⚠ Outcome'}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)' }}>{item.outcome}</div>
        </div>

        {/* Win detail + law */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {item.resident_won && item.win_detail && (
            <span style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0',
            }}>🏆 {item.win_detail}</span>
          )}
          {item.law_cited && (
            <span style={{ padding: '3px 10px', background: 'var(--dark)', color: 'var(--teal)', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
              {item.law_cited}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 18px 14px', borderTop: '1px solid var(--border)' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none' }}>
          📎 Read Full Case / Article →
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ background: '#0f1923', height: 72 }} />
      <div style={{ padding: '16px 18px' }}>
        {[80, 100, 60, 40].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? 16 : 12, width: `${w}%`, background: 'var(--border)',
            borderRadius: 4, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    </div>
  );
}

export default function RealCasesPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [cases, setCases]                   = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [customQuery, setCustomQuery]       = useState('');
  const [hasLoaded, setHasLoaded]           = useState(false);

  const load = async (query) => {
    setLoading(true);
    setError('');
    setCases([]);
    try {
      const results = await fetchCases(query);
      setCases(results);
      setHasLoaded(true);
    } catch (err) {
      setError('Could not fetch cases. Please check your API key is configured, or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(activeCategory.query);
  // eslint-disable-next-line
  }, [activeCategory]);

  const handleCustomSearch = () => {
    if (!customQuery.trim()) return;
    load(`Maharashtra housing ${customQuery} flat owner society builder`);
  };

  const wonCount = cases.filter(c => c.resident_won).length;

  return (
    <div className="section">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
            Real Cases · AI-Curated · Updated Automatically
          </div>
          <h1 className="section-title">People Like You <span>Won</span></h1>
          <p className="section-sub" style={{ maxWidth: 580, margin: '0 auto' }}>
            Court judgments, RERA orders, Consumer Forum verdicts, and RTI success stories
            from Maharashtra — fetched live by AI so you always see the latest outcomes.
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, justifyContent: 'center' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              onClick={() => { setActiveCategory(cat); setCustomQuery(''); }}
              style={{
                padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
                background: activeCategory.id === cat.id ? 'var(--teal)' : 'var(--white)',
                color: activeCategory.id === cat.id ? '#fff' : 'var(--text-muted)',
                border: activeCategory.id === cat.id ? 'none' : '1px solid var(--border)',
                boxShadow: activeCategory.id === cat.id ? '0 4px 14px rgba(0,200,150,0.3)' : 'none',
              }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Custom search */}
        <div style={{
          background: 'var(--dark)', borderRadius: 16, padding: '20px 24px',
          marginBottom: 28, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            className="form-input"
            style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            placeholder="Search specific topic — e.g. 'open parking Pune 2024' or 'conveyance deed refused'"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomSearch()}
          />
          <button className="btn-primary" style={{ flexShrink: 0 }}
            onClick={handleCustomSearch} disabled={loading || !customQuery.trim()}>
            Search Cases
          </button>
        </div>

        {/* Stats bar — shown when results loaded */}
        {hasLoaded && !loading && cases.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 18px', background: 'var(--teal-light)',
              border: '1px solid rgba(0,200,150,0.25)', borderRadius: 999,
              fontSize: 13, fontWeight: 700, color: 'var(--teal-dark)' }}>
              🏆 {wonCount} of {cases.length} cases — residents won
            </div>
            <div style={{ padding: '8px 18px', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: 999,
              fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
              {activeCategory.label} · AI-fetched {new Date().toLocaleDateString('en-IN')}
            </div>
            <button onClick={() => load(activeCategory.query)}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 999, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'var(--font)' }}>
              🔄 Refresh
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12,
            padding: '16px 20px', marginBottom: 24, fontSize: 14, color: '#991b1b', lineHeight: 1.6 }}>
            <strong>Could not load cases.</strong> {error}
            <br />
            <span style={{ fontSize: 12 }}>
              Make sure your Groq API key is set as <code>REACT_APP_GROQ_API_KEY</code> in GitHub Secrets.
            </span>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Cases grid */}
        {!loading && cases.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {cases.map((item, i) => <CaseCard key={i} item={item} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && hasLoaded && cases.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No cases found</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Try a different category or search term</div>
          </div>
        )}

        {/* Contribute + disclaimer */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'var(--teal-light)', border: '1.5px solid rgba(0,200,150,0.25)',
            borderRadius: 14, padding: '20px 24px', display: 'flex',
            alignItems: 'center', gap: 20, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>🏆 Did you win a case?</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Help others by sharing your judgment or RERA order. Email us at{' '}
                <a href="mailto:hello@gharhak.in" style={{ color: 'var(--teal)', fontWeight: 700 }}>
                  hello@gharhak.in
                </a>
              </div>
            </div>
            <a href="mailto:hello@gharhak.in?subject=GharHak Case Submission"
              style={{ padding: '10px 22px', background: 'var(--teal)', color: '#fff',
                borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Share Your Case →
            </a>
          </div>

          <div style={{ padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a',
            borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
            ⚠️ Cases are AI-generated summaries for educational purposes. Facts may be simplified.
            Always read the full judgment before relying on any case. This is not legal advice — consult a qualified advocate for your situation.
          </div>
        </div>

      </div>
    </div>
  );
}
