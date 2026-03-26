import React, { useState } from 'react';
import { trackEvent } from '../analytics';

const TOPICS = [
  'General Feedback',
  'Report a Bug',
  'Suggest a Feature',
  'Submit a Real Case',
  'Legal Content Issue',
  'Other',
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const subject = encodeURIComponent(`GharHak – ${topic}`);
    const body = encodeURIComponent(message.trim());
    trackEvent('feedback_sent', { topic });
    window.location.href = `mailto:rahulzaware31@gmail.com?subject=${subject}&body=${body}`;
    setOpen(false);
    setMessage('');
    setTopic(TOPICS[0]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
      >
        ✉️ Feedback
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="feedback-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-modal" onClick={e => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <div style={{ fontWeight: 800, fontSize: 17 }}>Write to Us</div>
              <button className="feedback-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.6 }}>
              Your message goes directly to the GharHak team. We read every email.
            </div>

            <div className="feedback-field">
              <label className="feedback-label">Topic</label>
              <select
                className="feedback-select"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              >
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="feedback-field">
              <label className="feedback-label">Your message</label>
              <textarea
                className="feedback-textarea"
                placeholder="Describe your feedback, bug, or suggestion..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
              <button className="btn-outline" onClick={() => setOpen(false)} style={{ padding: '9px 20px', fontSize: 13 }}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSend}
                style={{ padding: '9px 22px', fontSize: 13 }}
                disabled={!message.trim()}
              >
                Open in Email →
              </button>
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              This will open your email app pre-filled and addressed to us.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
