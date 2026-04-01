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
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setStatus('');

    try {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        topic,
        message: trimmed,
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem('gharhak_feedback') || '[]');
      existing.push(entry);
      localStorage.setItem('gharhak_feedback', JSON.stringify(existing));

      trackEvent('feedback_sent', { topic });
      setStatus('✅ Feedback saved. Thank you!');
      setMessage('');
      setTopic(TOPICS[0]);
    } catch (err) {
      setStatus(`⚠️ Could not save feedback. Please try again.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        className="feedback-fab"
        onClick={() => {
          setOpen(true);
          setStatus('');
        }}
        aria-label="Send feedback"
      >
        ✉️ Feedback
      </button>

      {open && (
        <div className="feedback-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-modal" onClick={e => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <div style={{ fontWeight: 800, fontSize: 17 }}>Write to Us</div>
              <button className="feedback-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.6 }}>
              Your feedback will be saved in your browser's local storage.
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

            {status && (
              <div style={{ fontSize: 12, marginBottom: 10, color: status.startsWith('✅') ? '#15803d' : '#b45309' }}>
                {status}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
              <button className="btn-outline" onClick={() => setOpen(false)} style={{ padding: '9px 20px', fontSize: 13 }}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSend}
                style={{ padding: '9px 22px', fontSize: 13 }}
                disabled={!message.trim() || sending}
              >
                {sending ? 'Saving...' : 'Save Feedback'}
              </button>
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              Stored in browser local storage.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
