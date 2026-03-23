import React, { useState } from 'react';
import { DOCUMENT_TEMPLATES, ISSUE_CATEGORIES } from '../data/issues';

const FIELD_LABELS = {
  societyName: 'Society Name',
  builderName: 'Builder / Developer Name',
  address: 'Address of Property',
  issueDescription: 'Describe the Issue',
  demand: 'What do you demand from the builder?',
  complainantName: 'Your Full Name',
  projectName: 'Project / Building Name',
  reraRegNo: 'RERA Registration Number',
  reliefSought: 'Relief / Remedy Sought',
  applicantName: 'Your Full Name',
  informationSought: 'Information / Documents Sought',
  authority: 'Authority Name (e.g. PMRDA, Pune Municipal Corporation)',
  regNo: 'Society Registration Number',
  resolutionSubject: 'Subject / Purpose of Resolution',
  resolutionText: 'Resolution Text',
  plotDetails: 'Plot / Survey / Gat Number',
  dateOfPossession: 'Date of Possession',
  accusedName: 'Name of Accused (Builder / Developer)',
  incidentDescription: 'Describe the Illegal Construction',
  witnesses: 'Names of Witnesses (if any)',
};

const DOC_ICONS = {
  legal_notice_builder: '⚖️',
  rera_complaint: '🏛️',
  rti_application: '📋',
  mc_resolution: '🗳️',
  deemed_conveyance: '🏠',
  police_complaint: '👮',
};

function generateDocument(template, formData, aiContent) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  if (aiContent) return aiContent;

  // Fallback template-based generation
  if (template.id === 'legal_notice_builder') {
    return `LEGAL NOTICE

Date: ${today}

To,
${formData.builderName || '[Builder Name]'},
[Builder Address]

Subject: Legal Notice — ${formData.issueDescription || 'Housing Rights Violation'}

Dear Sir/Madam,

Under instructions from and on behalf of ${formData.societyName || '[Society Name]'} (hereinafter referred to as "my client"), having their registered office at ${formData.address || '[Address]'}, I hereby serve you with the following legal notice:

FACTS:
${formData.issueDescription || '[Issue Description]'}

LEGAL GROUNDS:
1. The above acts are in violation of the Maharashtra Ownership Flats Act 1963
2. The same are in breach of the Maharashtra Co-operative Societies Act 1960
3. The acts constitute deficiency of service under Consumer Protection Act 2019

DEMAND:
My client demands the following:
${formData.demand || '[Demands]'}

You are hereby called upon to comply within 15 (fifteen) days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings before competent authorities — including MahaRERA, Consumer Forum, and Civil Court — entirely at your risk and cost.

This notice is issued Without Prejudice to all other rights and remedies of my client.

Issued by:
[Advocate Name]
[Bar Registration No.]
[Address]

Copy to: District Deputy Registrar, Sub-Registrar Office`;
  }

  return `[Document: ${template.title}]
Generated on: ${today}

Society: ${formData.societyName || formData.complainantName || formData.applicantName || '—'}
${Object.entries(formData).filter(([k, v]) => v).map(([k, v]) => `${FIELD_LABELS[k] || k}: ${v}`).join('\n')}

[Full document content will be AI-generated when API key is configured]`;
}

export default function DocGeneratorPage() {
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const selectTemplate = (tpl) => {
    setSelected(tpl);
    setFormData({});
    setGenerated('');
  };

  const handleField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateWithAI = async () => {
    setLoading(true);
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    const prompt = `Generate a professional legal document: ${selected.title}.
Date: ${today}
Details provided:
${Object.entries(formData).filter(([k, v]) => v).map(([k, v]) => `- ${FIELD_LABELS[k] || k}: ${v}`).join('\n')}

Requirements:
- Maharashtra law context (MCS Act, MOFA, RERA, UDCPR as applicable)
- Professional legal language
- Include relevant section numbers
- Include proper addressing and signing blocks
- Ready to use after filling [Advocate Name] / [Signature]
- Be specific and actionable`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: 'You are a Maharashtra housing law expert. Generate professional legal documents citing exact section numbers and applicable laws. Output only the document text, no preamble.' },
            { role: 'user', content: prompt },
          ],
        }),
      });
      const data = await res.json();
      setGenerated(data.choices?.[0]?.message?.content || generateDocument(selected, formData, null));
    } catch {
      setGenerated(generateDocument(selected, formData, null));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    alert('Copied to clipboard!');
  };

  const getCatLabel = (catId) => {
    const cat = ISSUE_CATEGORIES.find(c => c.id === catId);
    return cat?.title || catId;
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="section-title">Document <span>Generator</span></h1>
          <p className="section-sub">AI-powered legal documents for Maharashtra flat owners</p>
        </div>

        {!selected ? (
          <>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24 }}>
              Select a document type to get started. All documents are generated using Maharashtra-specific legal language.
            </p>
            <div className="doc-grid">
              {DOCUMENT_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="doc-card" onClick={() => selectTemplate(tpl)}>
                  <div className="doc-card-icon">{DOC_ICONS[tpl.id] || '📄'}</div>
                  <div className="doc-card-title">{tpl.title}</div>
                  <div className="doc-card-mr mr">{tpl.titleMr}</div>
                  <span className="doc-card-cat">{getCatLabel(tpl.category)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Choose different document
            </button>

            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 36, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{ fontSize: 40 }}>{DOC_ICONS[selected.id] || '📄'}</div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selected.title}</h2>
                  <div className="mr" style={{ color: 'var(--text-muted)', fontSize: 14 }}>{selected.titleMr}</div>
                </div>
              </div>

              {selected.fields.map(field => (
                <div key={field} className="form-field">
                  <label className="form-label">{FIELD_LABELS[field] || field}</label>
                  {['issueDescription', 'demand', 'informationSought', 'resolutionText', 'incidentDescription', 'reliefSought'].includes(field) ? (
                    <textarea
                      className="form-input form-textarea"
                      value={formData[field] || ''}
                      onChange={e => handleField(field, e.target.value)}
                      placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}...`}
                    />
                  ) : (
                    <input
                      className="form-input"
                      value={formData[field] || ''}
                      onChange={e => handleField(field, e.target.value)}
                      placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}...`}
                    />
                  )}
                </div>
              ))}

              <button
                className="btn-primary"
                onClick={generateWithAI}
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                {loading ? '⏳ Generating...' : '✨ Generate Document with AI'}
              </button>
            </div>

            {generated && (
              <div style={{ background: 'var(--white)', border: '1.5px solid var(--teal)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ background: 'var(--teal-light)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--teal)' }}>✓ Document Generated</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={copyToClipboard}
                      style={{ padding: '8px 16px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => window.print()}
                      style={{ padding: '8px 16px', background: 'var(--white)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                    >
                      Print
                    </button>
                  </div>
                </div>
                <pre style={{
                  padding: '28px 32px',
                  fontSize: 14,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  color: 'var(--text)',
                  maxHeight: 500,
                  overflow: 'auto',
                }}>
                  {generated}
                </pre>
                <div style={{ padding: '12px 24px', background: '#fffbf0', borderTop: '1px solid #fde68a', fontSize: 12, color: '#92400e' }}>
                  ⚠️ Review this document carefully before use. Have it reviewed by a qualified advocate before serving on any party.
                  Replace all [bracketed] placeholders with actual details.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
