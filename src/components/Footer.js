import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
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
              { label: 'Conveyance Calculator', page: 'conveyance' },
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
          <div>
            <div className="footer-col-title">Contact Us</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              Have feedback, found a bug, or want to share a case judgment? We'd love to hear from you.
            </p>
            <a
              href="mailto:rahulzaware31@gmail.com?subject=GharHak Feedback"
              style={{ display: 'inline-block', padding: '9px 18px', background: 'var(--teal)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
            >
              ✉️ Write to Us.
            </a>
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
