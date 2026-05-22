import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { chatCompletion } from '../utils/groqClient';
import { trackEvent } from '../analytics';

const SYSTEM_EN = `You are GharHak Helper — a friendly guide who helps ordinary people in Maharashtra understand their flat or housing problems and what they can do about it.

CRITICAL RULES — follow every one of these exactly:
1. NEVER mention section numbers, act names, or legal citations (do NOT write things like "Section 11 of MCS Act" or "under RERA 2016"). Say "the law says" or "you have a right to" instead.
2. NEVER use legal jargon — no Latin terms, no technical legal words. Write like you are explaining to a worried neighbor.
3. Be warm and empathetic — this person is stressed about their home.
4. Give very specific, concrete steps — not vague advice like "approach the authorities." Say exactly which office to visit or what message to send.
5. Maximum 5 steps in whatToDo.
6. messageToCopy must be a short, ready-to-send message (max 150 words) they can actually copy and send via WhatsApp or email.

Respond ONLY with a valid JSON object in this exact format. No extra text before or after:
{
  "yourProblem": "2-3 sentences in simple everyday words explaining what is happening and why it is wrong. Make the person feel understood and not alone.",
  "yourRights": "2-3 sentences about what they deserve and are entitled to, without any legal jargon or section numbers.",
  "whatToDo": [
    {"step": 1, "action": "The first concrete thing they should do, explained simply", "tip": "A practical short tip or null"},
    {"step": 2, "action": "Second step", "tip": null}
  ],
  "whoToContact": [
    {"name": "Name of office or authority", "role": "What this office does, explained in plain words", "how": "Simple way to reach them or what to say when you go"}
  ],
  "messageToCopy": "Subject: Complaint about [specific issue]\\n\\nDear Sir/Madam,\\n\\nI am [Your Name], flat owner at [Your Address].\\n\\n[Describe the issue in 3-4 simple sentences]\\n\\nI request you to please look into this and help resolve it.\\n\\nThank you,\\n[Your Name]\\n[Mobile Number]",
  "urgencyNote": "An important warning if there is time pressure or serious risk, or null if not urgent"
}`;

const SYSTEM_MR = `तुम्ही GharHak Helper आहात — महाराष्ट्रातील सामान्य लोकांना त्यांच्या घर किंवा फ्लॅटच्या समस्या आणि त्यावर काय करायचे ते सोप्या मराठीत समजावून सांगणारे मित्रत्वाचे सहाय्यक.

अत्यंत महत्त्वाचे नियम — हे सर्व काटेकोरपणे पाळा:
1. कधीही कलम क्रमांक किंवा कायद्याची नावे सांगू नका (उदा. "MCS Act चे कलम 11" किंवा "RERA 2016 अंतर्गत" असे लिहू नका). त्याऐवजी "कायद्यानुसार" किंवा "तुम्हाला हक्क आहे" असे म्हणा.
2. कायदेशीर भाषा वापरू नका — शेजाऱ्याशी बोलल्यासारखे सांगा ज्याला कायद्याची माहिती नाही.
3. उबदार आणि सहानुभूतीपूर्ण रहा — ही व्यक्ती आपल्या घराबद्दल काळजीत आहे.
4. अगदी स्पष्ट, करण्यायोग्य पावले सांगा — "संबंधित कार्यालयाशी संपर्क करा" असे अस्पष्ट सांगू नका.
5. whatToDo मध्ये जास्तीत जास्त 5 पावले द्या.
6. messageToCopy हा एक छोटा, तयार संदेश असावा (जास्तीत जास्त 150 शब्द) जो WhatsApp किंवा email वर लगेच पाठवता येईल.

फक्त खालील JSON format मध्ये उत्तर द्या. आधी किंवा नंतर काहीही लिहू नका:
{
  "yourProblem": "2-3 वाक्यांत सोप्या भाषेत सांगा काय होत आहे आणि ते चुकीचे का आहे. व्यक्तीला वाटले पाहिजे की त्यांना समजले आणि ते एकटे नाहीत.",
  "yourRights": "2-3 वाक्यांत त्यांना काय मिळायला हवे ते सांगा, कायदेशीर भाषेशिवाय.",
  "whatToDo": [
    {"step": 1, "action": "आधी काय करायचे ते साध्या भाषेत सांगा", "tip": "एक व्यावहारिक टीप किंवा null"},
    {"step": 2, "action": "दुसरे पाऊल", "tip": null}
  ],
  "whoToContact": [
    {"name": "कार्यालयाचे नाव", "role": "हे कार्यालय काय करते साध्या भाषेत", "how": "त्यांच्यापर्यंत कसे पोहोचायचे किंवा गेल्यावर काय सांगायचे"}
  ],
  "messageToCopy": "विषय: [समस्येबद्दल] तक्रार\\n\\nमाननीय महोदय/महोदया,\\n\\nमी [तुमचे नाव], [तुमचा पत्ता] येथील फ्लॅटमालक आहे.\\n\\n[3-4 साध्या वाक्यांत समस्या सांगा]\\n\\nकृपया यावर लक्ष घालून उपाय करावा.\\n\\nधन्यवाद,\\n[तुमचे नाव]\\n[मोबाईल नंबर]",
  "urgencyNote": "वेळेची मर्यादा किंवा गंभीर धोका असल्यास महत्त्वाचा इशारा, नाहीतर null"
}`;

const QUICK_EN = [
  { icon: '📄', text: 'Builder not giving flat papers' },
  { icon: '💰', text: 'Society charging too much money' },
  { icon: '🚗', text: 'My parking was taken away' },
  { icon: '🏗️', text: 'Flat not given on time' },
  { icon: '🗳️', text: 'Society elections not happening' },
  { icon: '🏚️', text: 'Builder did illegal construction' },
];

const QUICK_MR = [
  { icon: '📄', text: 'बिल्डर कागदपत्रे देत नाही' },
  { icon: '💰', text: 'सोसायटी जास्त पैसे मागत आहे' },
  { icon: '🚗', text: 'माझी पार्किंग गेली' },
  { icon: '🏗️', text: 'फ्लॅट वेळेवर मिळाला नाही' },
  { icon: '🗳️', text: 'सोसायटी निवडणुका नाहीत' },
  { icon: '🏚️', text: 'बिल्डरचे बेकायदेशीर बांधकाम' },
];

export default function SimpleHelpPage() {
  const { navigate, simpleHelpQuery, setSimpleHelpQuery } = useContext(AppContext);
  const [lang, setLang] = useState('en');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (simpleHelpQuery && simpleHelpQuery.trim()) {
      const q = simpleHelpQuery;
      setSimpleHelpQuery('');
      setQuery(q);
      doSubmit(q, 'en');
    }
  }, []); // eslint-disable-line

  const doSubmit = async (q, language) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);
    trackEvent('simple_help_submit', { lang: language, query_length: trimmed.length });

    const systemPrompt = language === 'mr' ? SYSTEM_MR : SYSTEM_EN;
    const userMessage = language === 'mr'
      ? `माझी समस्या: ${trimmed}\n\nकृपया JSON format मध्ये उत्तर द्या.`
      : `My problem: ${trimmed}\n\nPlease respond with JSON only.`;

    try {
      const data = await chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        maxTokens: 1500,
        temperature: 0.3,
      });

      const raw = data.choices?.[0]?.message?.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse AI response. Please try again.');
      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => doSubmit(query, lang);

  const handleCopy = () => {
    if (!result?.messageToCopy) return;
    navigator.clipboard.writeText(result.messageToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setQuery('');
  };

  const isMr = lang === 'mr';
  const QUICK = isMr ? QUICK_MR : QUICK_EN;

  const T = {
    mainTitle:     isMr ? 'तुमची समस्या सांगा' : 'Tell us your problem',
    mainSub:       isMr ? 'सोप्या भाषेत लिहा — जसे मित्राला सांगता' : 'Write in simple words — no legal knowledge needed',
    quickLabel:    isMr ? 'सामान्य समस्या निवडा:' : 'Or pick a common problem:',
    placeholder:   isMr ? 'उदा. माझ्या बिल्डरने 8 वर्षांत कागदपत्रे दिली नाहीत...' : 'e.g. My builder has not given me the conveyance deed in 8 years...',
    submitBtn:     isMr ? 'सोप्या भाषेत मदत मिळवा →' : 'Get Help in Simple Words →',
    backBtn:       isMr ? '← दुसरी समस्या विचारा' : '← Ask about another problem',
    loadingText:   isMr ? 'तुमची समस्या समजून घेत आहोत...' : 'Understanding your problem...',
    loadingSub:    isMr ? 'हे 10–15 सेकंद लागू शकते' : 'This may take 10–15 seconds',
    yourProblem:   isMr ? 'तुमची परिस्थिती' : 'Your Situation',
    yourRights:    isMr ? 'तुमचे हक्क' : 'What You\'re Entitled To',
    whatToDo:      isMr ? 'काय करायचे' : 'What To Do',
    whoToContact:  isMr ? 'कोणाशी संपर्क करायचा' : 'Who To Contact',
    messageTitle:  isMr ? 'पाठवायचा संदेश' : 'Message You Can Send',
    copyBtn:       isMr ? 'संदेश कॉपी करा' : 'Copy Message',
    copiedBtn:     isMr ? '✓ कॉपी झाले!' : '✓ Copied!',
    queryLabel:    isMr ? 'तुमची समस्या:' : 'Your problem:',
    goDeeper:      isMr ? 'अधिक तपशीलासाठी:' : 'Need more detailed help?',
    tryWizard:     isMr ? '🧭 तक्रार विझार्ड' : '🧭 Complaint Wizard',
    tryDocs:       isMr ? '📄 अधिकृत पत्र तयार करा' : '📄 Generate Official Letter',
    tryChat:       isMr ? '💬 AI सल्लागाराशी बोला' : '💬 Talk to AI Advisor',
    disclaimer:    isMr
      ? '⚠️ GharHak सामान्य माहिती देते. हे कायदेशीर सल्ल्याचा पर्याय नाही. न्यायालयाच्या कामासाठी पात्र वकिलाचा सल्ला घ्या.'
      : '⚠️ GharHak provides general legal information only. It is not a substitute for professional legal advice. For court proceedings, consult a qualified advocate.',
    errorMsg:      isMr ? 'काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.' : 'Something went wrong. Please try again.',
    retryBtn:      isMr ? 'पुन्हा प्रयत्न करा' : 'Try Again',
  };

  return (
    <div>
      <div className="page-header-band">
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to Home</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: '#e6faf5' }}>🤝</div>
            <div className="page-header-text">
              <div className="page-header-title">{isMr ? 'साधी मदत' : 'Simple Help'}</div>
              <div className="page-header-desc">
                {isMr ? 'कायद्याची माहिती नसली तरी तुमच्या भाषेत मदत' : 'Get answers in plain language — no legal knowledge needed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">

          <div className="sh-lang-row">
            <span className="sh-lang-label">{isMr ? 'भाषा:' : 'Language:'}</span>
            <button className={`sh-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>English</button>
            <button className={`sh-lang-btn${lang === 'mr' ? ' active' : ''}`} onClick={() => setLang('mr')}>मराठी</button>
          </div>

          {!result && !loading && (
            <div className="sh-input-section">
              <h2 className="sh-main-title">{T.mainTitle}</h2>
              <p className="sh-main-sub">{T.mainSub}</p>

              <p className="sh-quick-label">{T.quickLabel}</p>
              <div className="sh-quick-grid">
                {QUICK.map((q, i) => (
                  <button
                    key={i}
                    className={`sh-quick-chip${query === q.text ? ' selected' : ''}`}
                    onClick={() => setQuery(q.text)}
                  >
                    <span>{q.icon}</span> {q.text}
                  </button>
                ))}
              </div>

              <textarea
                className="sh-textarea"
                placeholder={T.placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); }}
                rows={4}
              />

              <button
                className="sh-submit-btn"
                onClick={handleSubmit}
                disabled={!query.trim()}
              >
                {T.submitBtn}
              </button>
            </div>
          )}

          {loading && (
            <div className="sh-loading">
              <div className="sh-loading-dots">
                <span /><span /><span />
              </div>
              <p className="sh-loading-text">{T.loadingText}</p>
              <p className="sh-loading-sub">{T.loadingSub}</p>
            </div>
          )}

          {error && !loading && (
            <div className="sh-error-state">
              <p className="sh-error-msg">⚠️ {T.errorMsg}</p>
              <p className="sh-error-detail">{error}</p>
              <button className="sh-submit-btn" onClick={handleSubmit}>{T.retryBtn}</button>
            </div>
          )}

          {result && !loading && (
            <div className="sh-result">
              <button className="sh-back-link" onClick={handleReset}>{T.backBtn}</button>

              <div className="sh-query-recap">
                <span className="sh-query-label">{T.queryLabel}</span>
                <span className="sh-query-text">{query}</span>
              </div>

              {result.urgencyNote && (
                <div className="sh-urgency">
                  <span className="sh-urgency-icon">⚠️</span>
                  <span>{result.urgencyNote}</span>
                </div>
              )}

              <div className="sh-card sh-card-blue">
                <div className="sh-card-header">
                  <span className="sh-card-icon">💡</span>
                  <h3 className="sh-card-title">{T.yourProblem}</h3>
                </div>
                <p className="sh-card-body">{result.yourProblem}</p>
              </div>

              <div className="sh-card sh-card-teal">
                <div className="sh-card-header">
                  <span className="sh-card-icon">✅</span>
                  <h3 className="sh-card-title">{T.yourRights}</h3>
                </div>
                <p className="sh-card-body">{result.yourRights}</p>
              </div>

              <div className="sh-card sh-card-orange">
                <div className="sh-card-header">
                  <span className="sh-card-icon">📋</span>
                  <h3 className="sh-card-title">{T.whatToDo}</h3>
                </div>
                <div className="sh-steps">
                  {result.whatToDo?.map((s, i) => (
                    <div key={i} className="sh-step">
                      <div className="sh-step-num">{s.step}</div>
                      <div className="sh-step-content">
                        <p className="sh-step-action">{s.action}</p>
                        {s.tip && <p className="sh-step-tip">💡 {s.tip}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.whoToContact?.length > 0 && (
                <div className="sh-card sh-card-purple">
                  <div className="sh-card-header">
                    <span className="sh-card-icon">📞</span>
                    <h3 className="sh-card-title">{T.whoToContact}</h3>
                  </div>
                  <div className="sh-contacts">
                    {result.whoToContact.map((c, i) => (
                      <div key={i} className="sh-contact-card">
                        <div className="sh-contact-name">{c.name}</div>
                        <div className="sh-contact-role">{c.role}</div>
                        <div className="sh-contact-how">📍 {c.how}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.messageToCopy && (
                <div className="sh-card sh-card-dark">
                  <div className="sh-card-header">
                    <span className="sh-card-icon">📧</span>
                    <h3 className="sh-card-title sh-card-title-light">{T.messageTitle}</h3>
                  </div>
                  <div className="sh-message-box">
                    <pre className="sh-message-text">{result.messageToCopy}</pre>
                    <button className="sh-copy-btn" onClick={handleCopy}>
                      {copied ? T.copiedBtn : T.copyBtn}
                    </button>
                  </div>
                </div>
              )}

              <div className="sh-go-deeper">
                <p className="sh-go-deeper-title">{T.goDeeper}</p>
                <div className="sh-go-deeper-btns">
                  <button className="sh-deeper-btn" onClick={() => navigate('wizard')}>{T.tryWizard}</button>
                  <button className="sh-deeper-btn" onClick={() => navigate('docs')}>{T.tryDocs}</button>
                  <button className="sh-deeper-btn" onClick={() => navigate('chat')}>{T.tryChat}</button>
                </div>
              </div>

              <p className="sh-disclaimer">{T.disclaimer}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
