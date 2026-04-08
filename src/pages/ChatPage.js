import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { trackEvent } from '../analytics';
import { getApiKey } from '../utils/apiKey';

const SYSTEM_PROMPT = `You are GharHak AI, a housing rights advisor for Maharashtra, India. You help flat owners, CHS (Co-operative Housing Society) members, and condominium residents understand and assert their legal rights.

Your knowledge covers:
- Maharashtra Co-operative Societies Act 1960 (MCS Act)
- Maharashtra Ownership Flats Act 1963 (MOFA)
- Real Estate (Regulation & Development) Act 2016 (RERA) and MahaRERA Rules 2017
- UDCPR 2020 (Unified Development Control and Promotion Regulations)
- MRTP Act 1966 (Maharashtra Regional and Town Planning Act)
- Maharashtra Apartment Ownership Act 1970
- Consumer Protection Act 2019
- Supreme Court and High Court judgments on parking, conveyance, FSI
- Conveyance deed and deemed conveyance procedures
- FSI (Floor Space Index) rules and fraud patterns
- Society elections, bye-laws, maintenance disputes
- OC (Occupancy Certificate) rights and obligations
- RERA complaints and remedies
- Builder warranty obligations (5 years structural)
- RTI applications to municipal bodies and PMRDA

Guidelines:
1. Be specific — cite actual section numbers and act names
2. Give actionable next steps, not just information
3. Mention which authority to approach and in what order
4. If the issue involves fraud or urgency, say so clearly
5. Keep responses clear and structured — use numbered steps when giving action plans
6. If asked in Marathi (Devanagari script), respond in simple Marathi
7. Always add a brief disclaimer that this is general legal information, not a substitute for professional legal advice
8. For complex matters (court cases, criminal complaints), recommend consulting a qualified advocate
9. Be empathetic — these are real problems affecting families and their homes`;

const QUICK_QUESTIONS = [
  'Builder not giving conveyance deed',
  'Selling open parking illegally',
  'No OC from builder',
  'RERA project delayed',
  'Maintenance too high',
  'Illegal construction on society land',
];

function formatTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      <div className="message-bubble" style={{ whiteSpace: 'pre-wrap' }}>
        {msg.content}
      </div>
      <div className="message-time">{msg.time}</div>
    </div>
  );
}

export default function ChatPage() {
  const { navigate } = useContext(AppContext);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `Namaste! 🙏 I'm GharHak AI — your housing rights advisor for Maharashtra.\n\nI can help you with:\n• Conveyance Deed & FSI issues\n• RERA complaints & project delays\n• Parking rights violations\n• OC / Completion Certificate disputes\n• Maintenance & society governance\n• Illegal construction by builder\n• And much more...\n\nDescribe your issue in English or Marathi — I'll guide you step by step.\n\n⚠️ Note: I provide general legal information, not legal advice. For court matters, please consult an advocate.`,
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    trackEvent('chat_message_sent', { message_index: messages.filter(m => m.role === 'user').length + 1 });

    const userMsg = { role: 'user', content: userText, time: formatTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...newMessages.map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.content,
        })),
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'API error');
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';

      setMessages(prev => [...prev, { role: 'ai', content: aiText, time: formatTime() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `⚠️ Could not connect to AI service. Please check your internet connection and try again.\n\nError: ${err.message}`,
        time: formatTime(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <div className="page-header-band">
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to Home</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: '#ede9fe' }}>🤖</div>
            <div className="page-header-text">
              <div className="page-header-title">AI Legal Advisor</div>
              <div className="page-header-desc">Ask in English or Marathi · Powered by Groq · Trained on Maharashtra housing law</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-title">GharHak AI Advisor</div>
              <div className="chat-status">● Online · Maharashtra Housing Law Expert</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && (
              <div className="message ai">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="chat-quick">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} className="quick-btn" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder="Describe your housing issue in English or Marathi..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              ↑
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
          ⚠️ GharHak AI provides general legal information only. It is not a substitute for professional legal advice.
          For court proceedings, please consult a qualified advocate.
        </p>
      </div>
      </div>
    </div>
  );
}
