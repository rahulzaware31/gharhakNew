import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">Ghar<span>Hak</span> — घरहक्क</div>
            <p className="footer-desc">
              Free public platform for Maharashtra flat owners and housing society members.
              Know your rights. Take action. Protect your home.
            </p>
            <div className="footer-disclaimer">
              ⚠️ This platform provides general legal information only. It does not constitute legal advice.
              For specific legal matters, please consult a qualified advocate. Laws may change — always verify
              with official sources.
            </div>
          </div>
          <div>
            <div className="footer-col-title">Quick Links</div>
            {[
              { label: 'Home', page: 'home' },
              { label: 'AI Advisor', page: 'chat' },
              { label: 'Complaint Wizard', page: 'wizard' },
              { label: 'Draft Documents', page: 'docs' },
            ].map(l => (
              <span key={l.page} className="footer-link" onClick={() => navigate(l.page)}>{l.label}</span>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Key Laws</div>
            {[
              'MCS Act 1960',
              'MOFA 1963',
              'MahaRERA Act 2016',
              'UDCPR 2020',
              'MRTP Act 1966',
              'Consumer Protection Act 2019',
            ].map(l => (
              <span key={l} className="footer-link" style={{ cursor: 'default' }}>{l}</span>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 GharHak. Free for all Maharashtra residents.</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Built with ❤️ as a public service
          </span>
        </div>
      </div>
    </footer>
  );
}
