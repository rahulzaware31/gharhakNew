import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

const AWARENESS_TOPICS = [
  {
    id: 'maintenance',
    icon: '🔧',
    category: 'Maintenance',
    color: '#e67e22',
    title: 'Excess Maintenance Charges',
    titleMr: 'जास्त देखभाल शुल्क',
    scenario: 'Your society committee suddenly increased maintenance from ₹1,500 to ₹3,500 per month — without calling an AGM or showing any bill breakdown.',
    scenarioMr: 'सोसायटी कमिटीने AGM न बोलवता किंवा बिलाचा तपशील न देता देखभाल शुल्क अचानक वाढवले.',
    whyWrong: 'Under MCS Bye-Laws, the committee cannot levy any charges beyond what was approved at the Annual General Meeting (AGM). Every member has the right to see audited accounts.',
    steps: [
      'Write a written request to the Secretary asking for the AGM resolution that approved the hike.',
      'If no reply in 30 days, file a complaint with the District Deputy Registrar (DDR) of Co-operative Societies.',
      'Simultaneously, file an RTI under the MCS Act demanding audited accounts and meeting minutes.',
      'If overcharging continues, approach the Co-operative Court for a stay order and refund.',
    ],
    authority: 'District Deputy Registrar (DDR) · Co-operative Court',
    law: 'MCS Act Section 79A · Model Bye-Laws Rule 69',
    actions: [{ label: 'File Complaint', page: 'wizard' }, { label: 'Generate RTI Notice', page: 'docs' }],
  },
  {
    id: 'parking',
    icon: '🚗',
    category: 'Parking',
    color: '#f39c12',
    title: 'Builder Sold Your Parking Spot',
    titleMr: 'बांधकाम व्यावसायिकाने पार्किंग विकले',
    scenario: 'You bought a flat with a "parking slot" in the agreement, but someone else has been allotted the same spot — or the builder sold open parking to other buyers.',
    scenarioMr: 'करारात पार्किंग असूनही दुसऱ्याला तेच पार्किंग दिले गेले, किंवा उघडे पार्किंग इतरांना विकले गेले.',
    whyWrong: 'The Supreme Court ruled in 2010 (Nahalchand Laloochand) that open parking spaces are common areas — builders CANNOT sell them. Only stilts/covered parking can be sold separately if mentioned in the agreement.',
    steps: [
      'Collect your sale agreement and highlight the parking clause. Note the spot number.',
      'Write a legal notice to the builder demanding allotment within 15 days.',
      'File a complaint on MahaRERA portal (maharerait.maharashtra.gov.in) if the project is RERA-registered.',
      'Approach District Consumer Forum for compensation if the builder ignores you.',
      'File a police complaint under IPC Section 420 (cheating) if spot was double-sold.',
    ],
    authority: 'MahaRERA · District Consumer Forum · Local Police',
    law: 'Supreme Court 2010 · MOFA 1963 · MahaRERA Act 2016',
    actions: [{ label: 'File RERA Complaint', page: 'wizard' }, { label: 'Generate Legal Notice', page: 'docs' }],
  },
  {
    id: 'elections',
    icon: '🗳️',
    category: 'Elections',
    color: '#16a085',
    title: 'Committee Not Holding Elections',
    titleMr: 'कमिटी निवडणूक घेत नाही',
    scenario: 'The same managing committee has been running the society for 5+ years. They postpone elections every time, give excuses, and refuse to step down.',
    scenarioMr: 'तीच कमिटी ५+ वर्षांपासून सोसायटी चालवत आहे. निवडणूक टाळण्यासाठी वेळोवेळी कारणे दिली जातात.',
    whyWrong: 'MCS Act Section 73CB mandates elections every 5 years. The Co-operative Election Authority (CEA) supervises elections. Continued occupation without election is illegal.',
    steps: [
      'Send a written demand letter to the current committee asking them to initiate election proceedings.',
      'File a complaint with the Co-operative Election Authority (CEA) of Maharashtra.',
      'Approach the District Deputy Registrar (DDR) who has power to order/conduct elections.',
      'If no action, file a petition in the Co-operative Court under Section 73CB read with MCS Rules.',
      'Mobilise at least 1/3rd of members to sign a requisition for a Special General Meeting (SGM) to resolve this.',
    ],
    authority: 'Co-operative Election Authority (CEA) · District Deputy Registrar',
    law: 'MCS Act Section 73CB · MCS Election Rules 2014',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Complaint Letter', page: 'docs' }],
  },
  {
    id: 'noc',
    icon: '📑',
    category: 'Documentation',
    color: '#8e44ad',
    title: 'Society Withholding NOC for Sale/Rent',
    titleMr: 'सोसायटी NOC देत नाही',
    scenario: 'You want to sell or rent your flat, but the society is refusing to give an NOC — demanding bribes, pending dues you\'ve already paid, or simply ignoring your application.',
    scenarioMr: 'तुम्हाला फ्लॅट विकायचा/भाड्याने द्यायचा आहे, पण सोसायटी लाच मागत आहे किंवा NOC देण्यास नकार देत आहे.',
    whyWrong: 'The Bombay High Court ruled in 2018 that societies cannot withhold NOC beyond 30 days of a valid application without written justified reasons. Demanding money for NOC is illegal.',
    steps: [
      'Submit a written NOC application to the Secretary with acknowledgement copy. Keep the receipt.',
      'If no response in 30 days, send a legal notice citing the Bombay HC 2018 ruling.',
      'File a complaint with the District Deputy Registrar (DDR) for obstruction of member rights.',
      'Approach the Co-operative Court for a mandatory injunction directing the society to issue NOC.',
      'File a police complaint if bribe is demanded — this is punishable under Prevention of Corruption Act.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court · Local Police',
    law: 'MCS Act · Bombay HC 2018 Ruling · Prevention of Corruption Act',
    actions: [{ label: 'Generate Legal Notice', page: 'docs' }, { label: 'File DDR Complaint', page: 'wizard' }],
  },
  {
    id: 'oc',
    icon: '📋',
    category: 'Builder Fraud',
    color: '#27ae60',
    title: 'Builder Has Not Obtained OC',
    titleMr: 'बांधकाम व्यावसायिकाने OC घेतले नाही',
    scenario: 'You\'ve been living in your flat for years, but the builder never obtained the Occupancy Certificate (OC) from the municipality. Your property is technically "illegal occupation."',
    scenarioMr: 'तुम्ही वर्षांपासून फ्लॅटमध्ये राहत आहात, पण बांधकाम व्यावसायिकाने महापालिकेकडून OC घेतलेच नाही.',
    whyWrong: 'Under MOFA 1963 Section 3 and MahaRERA Act 2016, the builder is legally required to obtain OC before handing over possession. Without OC, banks won\'t give loans, and you can\'t sell the flat easily.',
    steps: [
      'Write to the builder demanding OC within 30 days, citing MOFA 1963 Section 3.',
      'File a complaint on MahaRERA portal if the project is RERA registered.',
      'File a complaint with your Municipal Corporation/PMRDA for non-issuance of OC.',
      'Approach the District Consumer Forum for compensation and direction to obtain OC.',
      'If the society is formed, apply for Deemed OC through the municipality collectively.',
    ],
    authority: 'MahaRERA · Municipal Corporation / PMRDA · District Consumer Forum',
    law: 'MOFA 1963 Section 3 · MahaRERA Act 2016 Section 11',
    actions: [{ label: 'File RERA Complaint', page: 'wizard' }, { label: 'Generate OC Demand Notice', page: 'docs' }],
  },
  {
    id: 'conveyance',
    icon: '🏛️',
    category: 'Builder Fraud',
    color: '#e74c3c',
    title: 'Builder Has Not Given Conveyance Deed',
    titleMr: 'बांधकाम व्यावसायिकाने जमीन सोसायटीला दिली नाही',
    scenario: 'Your housing society was registered years ago, but the land underneath the building is still in the builder\'s name. The builder keeps delaying or making excuses.',
    scenarioMr: 'सोसायटी नोंदणी होऊन वर्षे झाली, पण जमीन अजूनही बांधकाम व्यावसायिकाच्या नावावरच आहे.',
    whyWrong: 'Under MCS Act Section 11, the builder must convey land to the society within 4 months of society registration. Failure to do so enables the society to apply for "Deemed Conveyance" without the builder\'s consent.',
    steps: [
      'Society passes a resolution at the AGM demanding conveyance from the builder.',
      'Send a legal notice to the builder giving 30 days to execute the conveyance deed.',
      'If builder refuses, apply to the District Deputy Registrar for Deemed Conveyance under MCS Act.',
      'DDR will issue a Deemed Conveyance Certificate after hearing both parties.',
      'Register the Deemed Conveyance at the Sub-Registrar\'s office — land title transfers to society.',
    ],
    authority: 'District Deputy Registrar · Sub-Registrar Office',
    law: 'MCS Act Section 11 · MOFA 1963 · Maharashtra Ownership Flats Rules',
    actions: [{ label: 'Start Conveyance Process', page: 'wizard' }, { label: 'Generate Demand Notice', page: 'docs' }],
  },
  {
    id: 'accounts',
    icon: '📊',
    category: 'Maintenance',
    color: '#2c3e50',
    title: 'Committee Hiding Financial Accounts',
    titleMr: 'कमिटी हिशेब देत नाही',
    scenario: 'The society collects thousands of rupees monthly, but the committee has not presented audited accounts at the AGM for 2+ years. Members don\'t know where the money is going.',
    scenarioMr: 'सोसायटी दरमहा हजारो रुपये गोळा करते, पण कमिटीने २+ वर्षांत AGM मध्ये ऑडिट केलेले हिशेब सादर केले नाहीत.',
    whyWrong: 'The MCS Act requires every co-operative society to conduct an annual audit and present accounts to members at the AGM. Members have the right to inspect account books. Hiding accounts is a violation punishable with penalties.',
    steps: [
      'Send a written application to the Secretary requesting to inspect account books under MCS Act Section 32.',
      'File an RTI application (Rs. 10 fee) with the District Deputy Registrar to obtain society records.',
      'If AGM has not been held in 15 months, file a complaint with the DDR demanding AGM.',
      'File a formal complaint with the DDR for non-compliance with audit and account sharing rules.',
      'In serious cases (fund diversion), file an FIR under IPC Section 406 (criminal breach of trust).',
    ],
    authority: 'District Deputy Registrar · Co-operative Auditor · Local Police',
    law: 'MCS Act Sections 32, 75, 79 · Maharashtra Co-operative Societies Rules',
    actions: [{ label: 'File RTI for Accounts', page: 'docs' }, { label: 'File DDR Complaint', page: 'wizard' }],
  },
  {
    id: 'common-area',
    icon: '🚧',
    category: 'Builder Fraud',
    color: '#c0392b',
    title: 'Builder Encroaching on Common Areas',
    titleMr: 'बांधकाम व्यावसायिकाने सामाईक जागा बळकावली',
    scenario: 'The builder has converted the terrace, stilts, or compound parking into shops/showrooms/offices and is collecting rent — without the society\'s permission.',
    scenarioMr: 'बांधकाम व्यावसायिकाने सोसायटीच्या परवानगीशिवाय गच्ची, स्टिल्ट्स किंवा कंपाऊंड दुकाने/ऑफिसमध्ये रूपांतरित केले आहे.',
    whyWrong: 'Common areas (terrace, stilts, compound, garden) belong to all flat owners collectively after conveyance. The builder cannot use, lease, or sell these areas. This is an illegal encroachment on members\' rights.',
    steps: [
      'Document the encroachment with photos, videos, and written description.',
      'Society passes a resolution demanding the builder vacate the common area immediately.',
      'Send a legal notice under MOFA 1963 and MCS Act demanding vacation within 15 days.',
      'File a complaint with Municipal Corporation/PMRDA for unauthorized construction.',
      'File a writ petition in Bombay High Court if authorities fail to act — courts have been strict on this.',
    ],
    authority: 'Municipal Corporation / PMRDA · District Consumer Forum · Bombay High Court',
    law: 'MOFA 1963 · MRTP Act Section 51 · MCS Act',
    actions: [{ label: 'File Municipal Complaint', page: 'wizard' }, { label: 'Generate Legal Notice', page: 'docs' }],
  },
  {
    id: 'sinking-fund',
    icon: '💰',
    category: 'Maintenance',
    color: '#27ae60',
    title: 'Sinking Fund Being Misused',
    titleMr: 'सिंकिंग फंडचा गैरवापर',
    scenario: 'Members have been paying sinking fund for years for major repairs, but when the building needed urgent waterproofing, the committee said "there\'s no money in the fund."',
    scenarioMr: 'सदस्य वर्षांपासून सिंकिंग फंड भरत आहेत, पण जेव्हा इमारतीला दुरुस्ती लागली, तेव्हा कमिटी म्हणाली "फंडात पैसे नाहीत."',
    whyWrong: 'The Sinking Fund is a statutory fund under MCS Model Bye-Laws for major repairs and reconstruction. It cannot be used for other purposes. The committee is legally responsible for its proper maintenance.',
    steps: [
      'Request a written statement of Sinking Fund account from the Secretary.',
      'File an RTI under MCS Act to obtain the complete Sinking Fund transaction history.',
      'If funds are missing or misused, file a complaint with the District Deputy Registrar.',
      'Demand a special audit of the Sinking Fund from the DDR under MCS Act Section 81.',
      'For serious embezzlement, file an FIR under IPC Sections 406/408 (breach of trust by employee).',
    ],
    authority: 'District Deputy Registrar · Co-operative Auditor · Local Police',
    law: 'MCS Model Bye-Laws · MCS Act Section 81',
    actions: [{ label: 'File RTI Application', page: 'docs' }, { label: 'File DDR Complaint', page: 'wizard' }],
  },
  {
    id: 'defects',
    icon: '🏚️',
    category: 'Builder Fraud',
    color: '#9b59b6',
    title: 'Builder Ignoring Structural Defects',
    titleMr: 'बांधकाम व्यावसायिक बांधकाम दोष दुरुस्त करत नाही',
    scenario: 'Within 3 years of possession, serious problems appeared — cracked walls, seepage, broken tiles, poor electrical work. The builder stopped responding to calls and messages.',
    scenarioMr: 'ताबा मिळाल्यानंतर ३ वर्षांत गंभीर समस्या आल्या — भिंतींना भेगा, गळती, तुटलेल्या टाइल्स. बांधकाम व्यावसायिक फोनच उचलत नाही.',
    whyWrong: 'MahaRERA Act Section 14 gives flat buyers a 5-year structural defect warranty. MOFA 1963 also mandates builders to rectify defects reported within 3 years of possession, at no cost to buyers.',
    steps: [
      'Document all defects with photos, dates, and written descriptions.',
      'Send a formal defect notice to the builder citing MahaRERA Section 14 warranty.',
      'File a complaint on the MahaRERA portal demanding repair or compensation.',
      'Approach the District Consumer Forum for compensation under Consumer Protection Act 2019.',
      'If builder is bankrupt/absconding, approach RERA Appellate Tribunal for relief.',
    ],
    authority: 'MahaRERA · District Consumer Forum · State Consumer Commission',
    law: 'MahaRERA Act 2016 Section 14 · MOFA 1963 · Consumer Protection Act 2019',
    actions: [{ label: 'File RERA Complaint', page: 'wizard' }, { label: 'Generate Defect Notice', page: 'docs' }],
  },
];

const CATEGORIES = ['All', 'Maintenance', 'Parking', 'Elections', 'Builder Fraud', 'Documentation'];

export default function SocietyAwarenessPage() {
  const { navigate } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = AWARENESS_TOPICS.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.scenario.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="awareness-page">
      {/* Header */}
      <section className="awareness-hero">
        <div className="awareness-hero-inner">
          <div className="awareness-hero-badge">सोसायटी हक्क जागृती</div>
          <h1 className="awareness-hero-title">
            Know Your <span>Society Rights</span>
          </h1>
          <p className="awareness-hero-sub mr">
            सामान्य समस्यांचे सोपे उपाय — तुमच्या हक्कांसाठी कुठे जायचे, काय करायचे ते जाणा
          </p>
          <p className="awareness-hero-sub-en">
            Plain-language guides for the 10 most common society problems — what's wrong, what law protects you, and exactly what to do.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <div className="awareness-controls">
        <div className="awareness-search-wrap">
          <span className="awareness-search-icon">🔍</span>
          <input
            className="awareness-search-input"
            placeholder="Search issues… e.g. parking, maintenance, NOC"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="awareness-search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
        <div className="awareness-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`awareness-filter-chip${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="awareness-count">
        {filtered.length === 0
          ? 'No issues found'
          : `${filtered.length} issue${filtered.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Cards */}
      <div className="awareness-grid">
        {filtered.map(topic => {
          const isOpen = expandedId === topic.id;
          return (
            <div
              key={topic.id}
              className={`awareness-card${isOpen ? ' open' : ''}`}
              style={{ borderTopColor: topic.color }}
            >
              {/* Card Header */}
              <div className="awareness-card-header" onClick={() => setExpandedId(isOpen ? null : topic.id)}>
                <div className="awareness-card-left">
                  <div className="awareness-card-icon" style={{ background: topic.color + '18', color: topic.color }}>
                    {topic.icon}
                  </div>
                  <div>
                    <div className="awareness-card-cat" style={{ color: topic.color }}>
                      {topic.category}
                    </div>
                    <div className="awareness-card-title">{topic.title}</div>
                    <div className="awareness-card-title-mr mr">{topic.titleMr}</div>
                  </div>
                </div>
                <div className={`awareness-card-chevron${isOpen ? ' up' : ''}`}>›</div>
              </div>

              {/* Scenario always visible */}
              <div className="awareness-card-scenario">
                <span className="awareness-scenario-label">Common scenario:</span>
                <p>{topic.scenario}</p>
                <p className="mr awareness-scenario-mr">{topic.scenarioMr}</p>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div className="awareness-card-body">
                  {/* Why it's wrong */}
                  <div className="awareness-section awareness-section-why">
                    <div className="awareness-section-title">
                      <span className="awareness-section-icon">⚠️</span> Why this is illegal
                    </div>
                    <p>{topic.whyWrong}</p>
                    <div className="awareness-law-badge">
                      <span>📜</span> {topic.law}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="awareness-section">
                    <div className="awareness-section-title">
                      <span className="awareness-section-icon">✅</span> Step-by-step: What you can do
                    </div>
                    <ol className="awareness-steps">
                      {topic.steps.map((step, i) => (
                        <li key={i} className="awareness-step">
                          <span className="awareness-step-num" style={{ background: topic.color }}>{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Authority */}
                  <div className="awareness-authority">
                    <span className="awareness-authority-label">🏛️ Approach:</span>
                    <span>{topic.authority}</span>
                  </div>

                  {/* Actions */}
                  <div className="awareness-card-actions">
                    {topic.actions.map((action, i) => (
                      <button
                        key={i}
                        className={`awareness-action-btn${i === 0 ? ' primary' : ' ghost'}`}
                        style={i === 0 ? { background: topic.color } : { borderColor: topic.color, color: topic.color }}
                        onClick={() => navigate(action.page)}
                      >
                        {action.label} →
                      </button>
                    ))}
                    <button
                      className="awareness-action-btn ghost"
                      style={{ borderColor: '#6366f1', color: '#6366f1' }}
                      onClick={() => navigate('chat')}
                    >
                      💬 Ask AI Advisor
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="awareness-bottom-cta">
        <div className="awareness-bottom-cta-inner">
          <div className="awareness-bottom-cta-title">
            Still unsure what to do?
          </div>
          <p className="awareness-bottom-cta-sub">
            Our AI Advisor can answer your specific question in plain English or Marathi — for free.
          </p>
          <div className="awareness-bottom-cta-actions">
            <button className="hero-btn-primary" onClick={() => navigate('chat')}>
              💬 Ask AI Advisor
            </button>
            <button className="hero-btn-ghost" onClick={() => navigate('wizard')}>
              🧭 Start Complaint Wizard
            </button>
          </div>
        </div>
      </div>

      <div className="awareness-disclaimer">
        ⚖️ This platform provides general legal information only. It is not a substitute for professional legal advice. For court proceedings, consult a qualified advocate.
      </div>
    </div>
  );
}
