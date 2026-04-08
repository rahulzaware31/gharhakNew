import React from 'react';

export default function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-logo${compact ? ' compact' : ''}`}>
      <svg className="brand-logo-mark" viewBox="0 0 64 64" role="img" aria-label="GharHak logo">
        <defs>
          <linearGradient id="gharhakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#13d5a6" />
            <stop offset="100%" stopColor="#009a73" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#gharhakGradient)" />
        <path d="M15 32L32 18L49 32V48H37V37H27V48H15V32Z" fill="white" fillOpacity="0.95" />
        <path d="M41 19C37 19 34 22 34 26C34 31 38 35 41 38C44 35 48 31 48 26C48 22 45 19 41 19Z" fill="#0f1923" fillOpacity="0.85" />
        <path d="M38 26L40.5 28.5L44 24.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="brand-logo-text-wrap">
        <div className="brand-logo-title">Ghar<span>Hak</span></div>
        {!compact && <div className="brand-logo-subtitle mr">घरमालक हक्क सहाय्य</div>}
      </div>
    </div>
  );
}
