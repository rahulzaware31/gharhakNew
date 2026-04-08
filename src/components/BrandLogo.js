import React from 'react';

const BLUE = '#06379b';
const GOLD = '#f4bc18';

export default function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-logo${compact ? ' compact' : ''}`}>
      <svg
        className="brand-logo-mark"
        viewBox="0 0 520 200"
        role="img"
        aria-label="Gharhak logo"
      >
        {/* House shield */}
        <path
          d="M260 15 150 80v50c0 22 56 44 110 56 54-12 110-34 110-56V80Z"
          fill="none"
          stroke={BLUE}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path d="M320 38h20v36" fill="none" stroke={BLUE} strokeWidth="8" strokeLinecap="round" />

        {/* Scales */}
        <line x1="198" y1="84" x2="322" y2="84" stroke={BLUE} strokeWidth="8" strokeLinecap="round" />
        <rect x="252" y="90" width="16" height="48" fill={BLUE} rx="2" />
        <rect x="244" y="136" width="32" height="8" fill={BLUE} rx="2" />
        <path d="M248 84C252 76 258 70 260 64c2 6 8 12 12 20" fill={GOLD} />
        <line x1="198" y1="84" x2="178" y2="118" stroke={GOLD} strokeWidth="3" />
        <line x1="198" y1="84" x2="218" y2="118" stroke={GOLD} strokeWidth="3" />
        <line x1="322" y1="84" x2="302" y2="118" stroke={GOLD} strokeWidth="3" />
        <line x1="322" y1="84" x2="342" y2="118" stroke={GOLD} strokeWidth="3" />
        <path d="M166 118h24c0 8-6 14-12 14s-12-6-12-14Z" fill={GOLD} />
        <path d="M330 118h24c0 8-6 14-12 14s-12-6-12-14Z" fill={GOLD} />

        {/* Wordmark */}
        <text
          x="260"
          y="176"
          textAnchor="middle"
          fill={BLUE}
          className="brand-logo-wordmark"
        >
          GHARHAK
        </text>

        {!compact && (
          <>
            <line x1="112" y1="188" x2="152" y2="188" stroke={GOLD} strokeWidth="3" />
            <line x1="368" y1="188" x2="408" y2="188" stroke={GOLD} strokeWidth="3" />
            <text
              x="260"
              y="194"
              textAnchor="middle"
              fill={GOLD}
              className="brand-logo-tagline"
            >
              Know Your Property Rights
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
