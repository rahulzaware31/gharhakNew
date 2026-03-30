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
  {
    id: 'transfer-premium',
    icon: '💸',
    category: 'Documentation',
    color: '#e74c3c',
    title: 'Society Charging Illegal Transfer Premium',
    titleMr: 'सोसायटीकडून बेकायदेशीर हस्तांतरण प्रीमियम',
    scenario: 'You are selling your flat and the society is demanding ₹1,00,000 or more as "transfer premium" or "NOC charges" — far above any legal limit — threatening to block the sale if you do not pay.',
    scenarioMr: 'तुम्ही फ्लॅट विकत असताना सोसायटी ₹१,००,००० पेक्षा जास्त "हस्तांतरण प्रीमियम" मागत आहे आणि न दिल्यास विक्री अडवण्याची धमकी देत आहे.',
    whyWrong: 'MCS Model Bye-Laws Rule 35 caps transfer premium at ₹25,000 for Mumbai city/suburbs and ₹5,000 for the rest of Maharashtra. Any amount charged beyond this limit is illegal and recoverable.',
    steps: [
      'Ask the Secretary in writing to provide the bye-law provision under which the premium is being charged.',
      'State in your reply that you are willing to pay only the legally capped amount (₹25,000 or ₹5,000).',
      'File a complaint with the District Deputy Registrar (DDR) citing MCS Model Bye-Laws Rule 35.',
      'Approach the Co-operative Court for an injunction if the society still blocks your NOC.',
      'You can also recover illegally collected amounts through the Consumer Forum as "unfair trade practice."',
    ],
    authority: 'District Deputy Registrar · Co-operative Court · District Consumer Forum',
    law: 'MCS Model Bye-Laws Rule 35 · Maharashtra Co-operative Societies Act',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Legal Notice', page: 'docs' }],
  },
  {
    id: 'membership',
    icon: '🚪',
    category: 'Member Rights',
    color: '#3498db',
    title: 'Society Refusing to Admit New Member',
    titleMr: 'सोसायटी नवीन सदस्यत्व नाकारत आहे',
    scenario: 'You bought a flat, registered the sale deed in your name, but the society refuses to admit you as a member — asking for impossible documents, delaying indefinitely, or simply ignoring your application.',
    scenarioMr: 'तुम्ही नोंदणीकृत खरेदी केले, पण सोसायटी अशक्य कागदपत्रे मागत आहे किंवा अर्ज दुर्लक्षित करत आहे.',
    whyWrong: 'Under MCS Act Section 22, a housing society must admit a new member within 30 days of a valid application. Refusal without written, legally valid reasons is illegal. A registered flat owner has an automatic right to membership.',
    steps: [
      'Submit a written membership application to the Secretary with all standard documents (sale deed, share application, ID proof). Keep the acknowledgement.',
      'If no reply in 30 days, send a legal notice reminding the society of its obligation under MCS Act Section 22.',
      'File a complaint with the District Deputy Registrar (DDR) — they can direct the society to admit you.',
      'Approach the Co-operative Court for an order compelling membership if DDR does not act.',
      'You can also file a Civil Court suit for declaration of membership rights.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court · Civil Court',
    law: 'MCS Act Section 22 · MCS Model Bye-Laws',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Membership Demand Notice', page: 'docs' }],
  },
  {
    id: 'agm',
    icon: '📅',
    category: 'Elections',
    color: '#1abc9c',
    title: 'Society Not Holding AGM for Years',
    titleMr: 'सोसायटी वर्षानुवर्षे AGM घेत नाही',
    scenario: 'The committee has not called an Annual General Meeting (AGM) for 2 or more years. Budget is not approved, accounts are not presented, and members have no say in how society funds are spent.',
    scenarioMr: 'कमिटीने २ वर्षांत AGM बोलवलेले नाही. बजेट मंजूर नाही, हिशेब सादर नाही, आणि सदस्यांना निर्णयप्रक्रियेत सहभाग नाही.',
    whyWrong: 'MCS Act Section 75 requires every co-operative housing society to hold its AGM within 15 months of the previous one. Non-compliance is a punishable offence and the DDR can call the meeting directly.',
    steps: [
      'Send a written demand letter to the Secretary asking them to call an AGM within 30 days.',
      'Gather signatures from at least 1/3rd of total members to requisition an SGM (Special General Meeting) under MCS Act Section 74.',
      'File a complaint with the District Deputy Registrar (DDR) who is empowered to order and supervise an AGM.',
      'If the DDR does not act within 60 days, approach the Co-operative Court for mandamus.',
      'Simultaneously, file an RTI under MCS Act Section 32 to obtain meeting minutes and accounts.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court',
    law: 'MCS Act Sections 74, 75 · MCS Model Bye-Laws',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate SGM Requisition', page: 'docs' }],
  },
  {
    id: 'amenities',
    icon: '🔌',
    category: 'Maintenance',
    color: '#d35400',
    title: 'Lift / Water / Common Amenities Not Maintained',
    titleMr: 'लिफ्ट / पाणी / सामाईक सुविधा दुरुस्त नाही',
    scenario: 'The building lift has been broken for months, the overhead water tank pump is not working, or the generator never functions during power cuts — and despite written complaints, the committee takes no action.',
    scenarioMr: 'लिफ्ट महिनाभर बंद आहे, पाण्याचा पंप काम करत नाही, किंवा जनरेटर वीज गेल्यावर चालत नाही. कमिटी तक्रारींकडे दुर्लक्ष करत आहे.',
    whyWrong: 'The managing committee has a statutory duty under MCS Model Bye-Laws to maintain all common assets (lifts, pumps, generators, corridors) in working order. Negligence resulting in injury can attract civil liability too.',
    steps: [
      'Write a formal complaint to the Secretary listing the defective amenities and the period of non-repair.',
      'Set a 15-day deadline in the complaint. Retain an acknowledgement copy.',
      'If unaddressed, file a complaint with the District Deputy Registrar (DDR) for committee negligence.',
      'For lift safety specifically, also file a complaint with the District Electrical Inspector under the Lift Act.',
      'Approach the District Consumer Forum if the neglect causes financial loss or personal injury.',
    ],
    authority: 'District Deputy Registrar · District Electrical Inspector · District Consumer Forum',
    law: 'MCS Model Bye-Laws · Maharashtra Lift Act · Consumer Protection Act 2019',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Complaint Letter', page: 'docs' }],
  },
  {
    id: 'illegal-construction',
    icon: '🔨',
    category: 'Member Rights',
    color: '#7f8c8d',
    title: 'Neighbor Doing Unauthorized Flat Modifications',
    titleMr: 'शेजाऱ्याने बेकायदेशीर बांधकाम / बदल केले',
    scenario: 'A neighbor is breaking load-bearing walls, enclosing a balcony, adding a mezzanine floor, or making structural changes to their flat — without permission from the society or the municipal authority.',
    scenarioMr: 'शेजारी लोड-बेअरिंग भिंती तोडत आहे, बाल्कनी बंद करत आहे, किंवा सोसायटी / महापालिकेच्या परवानगीशिवाय इमारतीत फेरबदल करत आहे.',
    whyWrong: 'Under MRTP Act Sections 44 and 52, any structural alteration requires prior municipal sanction. Unauthorised construction weakens the building structure and endangers all residents. The society can also be held liable if it ignores such violations.',
    steps: [
      'Write a complaint letter to the Secretary of the society demanding they stop the illegal work immediately.',
      'If the society does not act, file a complaint with the Ward Officer of your Municipal Corporation/PMRDA citing MRTP Act Sections 44 and 52.',
      'The municipality can issue a stop-work notice and, if ignored, demolish the unauthorised structure at the owner\'s cost.',
      'File a police complaint if the construction poses immediate danger (Section 188 IPC for disobeying public orders).',
      'Approach the Bombay High Court for urgent relief if the building structure is at serious risk.',
    ],
    authority: 'Municipal Corporation / PMRDA Ward Office · Local Police · Bombay High Court',
    law: 'MRTP Act 1966 Sections 44, 52 · MCS Model Bye-Laws · IPC Section 188',
    actions: [{ label: 'File Municipal Complaint', page: 'wizard' }, { label: 'Generate Complaint Letter', page: 'docs' }],
  },
  {
    id: 'society-formation',
    icon: '🏗️',
    category: 'Builder Fraud',
    color: '#c0392b',
    title: 'Builder Not Forming Housing Society',
    titleMr: 'बांधकाम व्यावसायिकाने गृहनिर्माण संस्था स्थापन केली नाही',
    scenario: 'The builder sold all flats 3-5 years ago, collected corpus funds, but has never initiated the formation of the Co-operative Housing Society — leaving flat owners with no legal entity to manage common areas or apply for conveyance.',
    scenarioMr: 'बांधकाम व्यावसायिकाने सर्व फ्लॅट ३-५ वर्षांपूर्वी विकले, पण आजपर्यंत गृहनिर्माण सोसायटी स्थापन केली नाही.',
    whyWrong: 'MOFA 1963 Section 10 requires the builder to apply for society registration within 4 months of minimum membership criteria being met (usually when 60% flats are sold). MahaRERA also mandates society formation as part of the builder\'s obligations.',
    steps: [
      'Flat owners collectively send a signed demand letter to the builder asking them to initiate society registration within 30 days.',
      'If the builder does not respond, file a complaint on the MahaRERA portal citing non-compliance with MOFA Section 10.',
      'File a complaint with the District Deputy Registrar asking for suo-motu registration of the society.',
      'Approach the District Consumer Forum for compensation for delay and inconvenience.',
      'Flat owners can self-register the society directly with the DDR under the MCS Act — a lawyer can help with the process.',
    ],
    authority: 'MahaRERA · District Deputy Registrar · District Consumer Forum',
    law: 'MOFA 1963 Section 10 · MCS Act · MahaRERA Act 2016',
    actions: [{ label: 'File RERA Complaint', page: 'wizard' }, { label: 'Generate Demand Notice', page: 'docs' }],
  },
  {
    id: 'corpus-fund',
    icon: '💼',
    category: 'Builder Fraud',
    color: '#f39c12',
    title: 'Corpus Fund Not Deposited by Builder',
    titleMr: 'बांधकाम व्यावसायिकाने कॉर्पस फंड जमा केला नाही',
    scenario: 'Each flat buyer paid ₹50,000-1,00,000 as "corpus fund" at the time of flat purchase. Years later, the society finds that the builder never deposited this money in the society\'s account.',
    scenarioMr: 'प्रत्येक खरेदीदाराने फ्लॅट खरेदी करताना ₹५०,०००-१,००,००० कॉर्पस फंड दिला. आता कळले की बांधकाम व्यावसायिकाने हे पैसे सोसायटीत जमाच केले नाहीत.',
    whyWrong: 'MahaRERA requires builders to deposit the corpus fund collected from buyers into the society\'s designated bank account at the time of handover. Withholding this amount is a breach of RERA obligations and a criminal breach of trust.',
    steps: [
      'Collectively obtain copies of all flat purchase agreements showing corpus fund payments.',
      'The society passes a resolution demanding the corpus fund from the builder with a 30-day deadline.',
      'File a complaint with MahaRERA Authority (maharerait.maharashtra.gov.in) citing non-deposit of corpus fund.',
      'RERA can order the builder to deposit the amount plus interest. Non-compliance can result in project registration cancellation.',
      'Simultaneously approach the District Consumer Forum and file an FIR under IPC Section 406 for criminal breach of trust.',
    ],
    authority: 'MahaRERA · District Consumer Forum · Local Police',
    law: 'MahaRERA Act 2016 · MOFA 1963 · IPC Section 406',
    actions: [{ label: 'File RERA Complaint', page: 'wizard' }, { label: 'Generate Demand Notice', page: 'docs' }],
  },
  {
    id: 'water-meter',
    icon: '💧',
    category: 'Maintenance',
    color: '#2980b9',
    title: 'Unequal / Unfair Water Charges',
    titleMr: 'असमान पाणी शुल्क आकारणी',
    scenario: 'The society charges every flat the same water bill — whether a 1BHK with one person or a 3BHK with a family of six. Or, the committee has installed meters only on some flats and charges others a flat rate.',
    scenarioMr: 'सोसायटी सर्व फ्लॅटना सारखेच पाणी बिल लावते — मग ती १BHK असो वा ३BHK. किंवा काही फ्लॅटवर मीटर लावले आहेत, इतरांवर नाही.',
    whyWrong: 'MCS Model Bye-Laws require water charges to be levied equitably — either by individual meters or by a formula approved at the AGM. Arbitrary or discriminatory billing can be challenged as a violation of bye-laws.',
    steps: [
      'Write to the Secretary asking for the AGM resolution under which the current water billing method was approved.',
      'If no resolution exists, raise the issue at the next AGM and demand a fair metered or proportional system.',
      'File a complaint with the DDR if the billing is arbitrary or discriminatory.',
      'Simultaneously, approach your municipal water authority if the society is inflating MCGM/PMC bills.',
      'Approach the Consumer Forum if overcharging has occurred for more than one year.',
    ],
    authority: 'District Deputy Registrar · Municipal Water Authority · District Consumer Forum',
    law: 'MCS Model Bye-Laws · Maharashtra Municipal Corporations Act',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate RTI Notice', page: 'docs' }],
  },
  {
    id: 'tenant-rights',
    icon: '🏠',
    category: 'Member Rights',
    color: '#16a085',
    title: 'Society Harassing Tenants / Banning Rentals',
    titleMr: 'सोसायटीकडून भाडेकरूंचा छळ / भाड्याला बंदी',
    scenario: 'The society imposes arbitrary "approval" processes for tenants, charges separate "tenant maintenance" fees not applicable to owners, or has passed a resolution banning flat rentals altogether.',
    scenarioMr: 'सोसायटी भाडेकरूंसाठी मनमानी मंजुरी प्रक्रिया आहे, मालकांना लागू नसलेले वेगळे शुल्क आकारते, किंवा फ्लॅट भाड्याने देण्यावर बंदी घातली आहे.',
    whyWrong: 'A flat owner has the right to rent out their property. The society can ask for a tenant notification form and police verification, but CANNOT charge differential maintenance from tenants or prohibit renting. Such resolutions are void and ultra vires.',
    steps: [
      'Inform the society Secretary in writing about the new tenant within 30 days (standard obligation).',
      'Provide police verification documentation as required by law.',
      'If the society demands extra fees not in the bye-laws, refuse in writing and file a DDR complaint.',
      'A society ban on rentals is illegal — challenge it in the Co-operative Court or DDR.',
      'Approach the Co-operative Court to quash any anti-rental resolution passed by the committee.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court',
    law: 'MCS Act · MCS Model Bye-Laws · Transfer of Property Act 1882',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Legal Notice', page: 'docs' }],
  },
  {
    id: 'redevelopment',
    icon: '🏢',
    category: 'Member Rights',
    color: '#8e44ad',
    title: 'Forced Redevelopment Without Consent',
    titleMr: 'बहुमताशिवाय जबरदस्तीचा पुनर्विकास',
    scenario: 'The managing committee has signed a redevelopment agreement with a builder, promising tenants an alternate accommodation — but most members were not consulted, the MOU was signed in a hurry, and minority members feel cheated.',
    scenarioMr: 'कमिटीने बांधकाम व्यावसायिकाशी पुनर्विकास करार केला, पण बहुतांश सदस्यांना विचारले नाही किंवा लवकरघाईत सह्या घेतल्या.',
    whyWrong: 'Under DC Regulations and MCS Act, redevelopment requires approval of minimum 75% of total society members in a Special General Meeting (SGM), not just the committee. Any agreement signed without this is void and challengeable.',
    steps: [
      'Immediately demand minutes of the SGM and the full redevelopment agreement from the Secretary.',
      'Verify whether 75% member consent was obtained at a properly convened SGM.',
      'If not, file a complaint with the District Deputy Registrar citing non-compliance with quorum rules.',
      'Approach the Co-operative Court for an interim stay on redevelopment proceedings.',
      'Engage a qualified advocate familiar with Mumbai/Maharashtra redevelopment law for personalized guidance.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court · Bombay High Court',
    law: 'MCS Act Section 74 · DC Regulations · Maharashtra Slum Areas Act (if applicable)',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Legal Notice', page: 'docs' }],
  },
  {
    id: 'cctv-privacy',
    icon: '📷',
    category: 'Member Rights',
    color: '#2c3e50',
    title: 'CCTV Installed Inside Private Areas',
    titleMr: 'खाजगी ठिकाणी CCTV बसवले',
    scenario: 'The committee installed CCTV cameras pointing inside flats, at front doors in a way that monitors private activity, or inside lifts without informing members — and denies access to the footage to individual members.',
    scenarioMr: 'कमिटीने फ्लॅटच्या दरवाज्यांवर, लिफ्टमध्ये किंवा खाजगी जागी CCTV बसवले, सदस्यांना न सांगता.',
    whyWrong: 'While societies can install CCTV in common areas for security, cameras pointing into private homes or placed inside lifts without member consent infringe on constitutional privacy rights (Article 21). The society must pass an AGM resolution before installation.',
    steps: [
      'Write to the Secretary asking for the AGM resolution authorizing CCTV installation and the camera placement plan.',
      'If no resolution exists or cameras are placed in privacy-violating locations, demand immediate removal in writing.',
      'File a complaint with the DDR citing breach of bye-laws and member rights.',
      'File a police complaint under IT Act Section 66E if cameras record private areas without consent.',
      'Approach the Bombay High Court for a writ petition citing violation of Article 21 (Right to Privacy).',
    ],
    authority: 'District Deputy Registrar · Local Police · Bombay High Court',
    law: 'Article 21 Constitution of India · IT Act Section 66E · MCS Model Bye-Laws',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Legal Notice', page: 'docs' }],
  },
  {
    id: 'gst-maintenance',
    icon: '🧾',
    category: 'Maintenance',
    color: '#27ae60',
    title: 'Society Wrongly Charging GST on Maintenance',
    titleMr: 'देखभाल शुल्कावर चुकीचा GST आकारणी',
    scenario: 'Your society charges GST (18%) on monthly maintenance, but you have heard that small societies are exempt. The committee cannot show a GST registration certificate or proper invoice, yet continues to collect tax.',
    scenarioMr: 'सोसायटी देखभाल शुल्कावर १८% GST आकारत आहे, पण GST नोंदणी प्रमाणपत्र दाखवत नाही.',
    whyWrong: 'GST on housing society maintenance applies ONLY when per-member monthly contribution exceeds ₹7,500 AND the society\'s annual turnover exceeds ₹20 lakhs. Below these thresholds, societies are exempt. Collecting GST without registration is illegal.',
    steps: [
      'Write to the Secretary asking for the society\'s GST Registration Certificate (GSTIN) and GST invoices.',
      'If the society is collecting GST but not depositing it with the government, this is fraud.',
      'If the society is below the threshold, demand a refund of all GST collected from members.',
      'File a complaint with the GST Department (GSTN helpline) if unregistered GST collection is happening.',
      'File a DDR complaint for financial irregularity and approach the Consumer Forum for refund.',
    ],
    authority: 'GST Department · District Deputy Registrar · District Consumer Forum',
    law: 'CGST Act 2017 · GST Circular 109/28/2019 · MCS Act',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate RTI for Accounts', page: 'docs' }],
  },
  {
    id: 'property-tax',
    icon: '🏛️',
    category: 'Builder Fraud',
    color: '#e67e22',
    title: 'Builder Not Paying Property Tax Before Handover',
    titleMr: 'ताब्यापूर्वी बांधकाम व्यावसायिकाने मालमत्ता कर भरला नाही',
    scenario: 'After society formation and building handover, the society discovers that the builder had not paid property tax to the municipality for years. Now the municipality is demanding payment from the society with heavy penalties.',
    scenarioMr: 'सोसायटी स्थापन झाल्यावर कळले की बांधकाम व्यावसायिकाने वर्षानुवर्षे महापालिकेला मालमत्ता कर भरला नाही. आता दंडासह कर भरण्याची मागणी येत आहे.',
    whyWrong: 'Property tax for the period before society handover is the builder\'s liability, not the society\'s. The builder cannot pass on pre-handover tax dues to flat buyers or the society. This is a contractual and statutory obligation of the builder.',
    steps: [
      'Obtain the property tax records from the municipal corporation using an RTI application.',
      'Identify the period of unpaid taxes and cross-check against the date of official building handover.',
      'Send a legal notice to the builder demanding payment of pre-handover taxes within 30 days.',
      'File a complaint on MahaRERA if the project is RERA-registered.',
      'Approach the District Consumer Forum and Civil Court for a declaration that the builder alone is liable for pre-handover dues.',
    ],
    authority: 'MahaRERA · Municipal Corporation · District Consumer Forum · Civil Court',
    law: 'MOFA 1963 · MahaRERA Act 2016 · Mumbai Municipal Corporation Act · RTI Act',
    actions: [{ label: 'File RERA Complaint', page: 'wizard' }, { label: 'Generate RTI Application', page: 'docs' }],
  },
  {
    id: 'notice-board',
    icon: '📌',
    category: 'Member Rights',
    color: '#c0392b',
    title: 'Committee Not Publishing Meeting Notices / Minutes',
    titleMr: 'कमिटी सभेच्या नोटिसा आणि इतिवृत्त प्रसिद्ध करत नाही',
    scenario: 'The committee holds meetings without proper advance notice to members, or decisions are taken but minutes are never posted on the notice board or shared with members who request them.',
    scenarioMr: 'कमिटी सदस्यांना आधीच सूचना न देता सभा घेते, किंवा निर्णय घेतल्यावर इतिवृत्त नोटीस बोर्डवर लागत नाही.',
    whyWrong: 'MCS Model Bye-Laws require that notice of any General Body meeting be given at least 14 days in advance. Meeting minutes must be prepared and posted on the society notice board within 3 days of the meeting. Members have the right to inspect all minutes.',
    steps: [
      'Write to the Secretary formally requesting copies of all meeting notices and minutes for the past 2 years under MCS Act Section 32.',
      'If denied, file an RTI application with the DDR\'s office to obtain these records.',
      'File a complaint with the DDR citing violation of bye-laws requiring advance notice and minute publication.',
      'Raise the issue formally at the next AGM and have it minuted as a complaint.',
      'If decisions were taken in improperly convened meetings, approach the Co-operative Court to declare such decisions void.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court',
    law: 'MCS Act Section 32 · MCS Model Bye-Laws Rules 96, 97, 99',
    actions: [{ label: 'File RTI for Minutes', page: 'docs' }, { label: 'File DDR Complaint', page: 'wizard' }],
  },
  {
    id: 'share-certificate',
    icon: '📝',
    category: 'Documentation',
    color: '#6c3483',
    title: 'Society Not Transferring Share Certificate',
    titleMr: 'सोसायटी शेअर सर्टिफिकेट हस्तांतरित करत नाही',
    scenario: 'You bought a flat and registered the sale deed in your name, but the society is refusing to transfer the share certificate — citing pending dues of the previous owner, missing documents, or simply ignoring your requests for months.',
    scenarioMr: 'नोंदणीकृत खरेदीनंतरही सोसायटी शेअर सर्टिफिकेट तुमच्या नावावर करत नाही — मागील मालकाचे थकीत, कागदपत्रे किंवा दुर्लक्ष हे कारण देत आहे.',
    whyWrong: 'Under MCS Act Section 22 and Model Bye-Laws Rule 35, upon a valid transfer application with registered sale deed, the society must transfer the share certificate within 30 days. Pending dues of the previous owner cannot be demanded from the new buyer (buyer is not liable for seller\'s dues).',
    steps: [
      'Submit a written share transfer application to the Secretary with the registered sale deed, share transfer form, NOC from previous owner, and ID proof. Keep the acknowledgement.',
      'If no reply in 30 days, send a legal notice citing MCS Act Section 22.',
      'File a complaint with the District Deputy Registrar (DDR) who can direct the society to complete the transfer.',
      'Approach the Co-operative Court for an order if DDR is not responsive.',
      'Note: If the society claims "pending dues," get a written statement. You are liable ONLY for dues that arose after you became owner — not the previous owner\'s arrears.',
    ],
    authority: 'District Deputy Registrar · Co-operative Court',
    law: 'MCS Act Section 22 · MCS Model Bye-Laws Rule 35',
    actions: [{ label: 'File DDR Complaint', page: 'wizard' }, { label: 'Generate Transfer Demand Notice', page: 'docs' }],
  },
];

const CATEGORIES = ['All', 'Maintenance', 'Parking', 'Elections', 'Builder Fraud', 'Documentation', 'Member Rights'];

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
