import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../App';

// ─── Deep issue data ──────────────────────────────────────────────────────────
const ISSUES = [
  {
    id: 'conveyance',
    icon: '🏛️',
    title: 'Conveyance Deed / Deemed Conveyance',
    titleMr: 'हस्तांतरण दस्तऐवज',
    desc: 'Builder not conveying land to society, FSI fraud, deemed conveyance',
    subIssues: [
      'Builder not executing conveyance deed',
      'Deemed conveyance application pending',
      'Builder using society land for FSI',
      'Conveyance refused despite court order',
    ],
    laws: [
      { ref: 'MOFA 1963 § 11', detail: 'Builder must execute conveyance within 4 months of society formation' },
      { ref: 'MCS Act 1960 § 11(3)', detail: 'Deemed Conveyance — DDR can execute on behalf of builder if builder refuses' },
      { ref: 'RERA 2016 § 17', detail: 'Promoter must convey common areas within 3 months of OC' },
      { ref: 'UDCPR 2020 Reg. 2.2.3', detail: 'FSI must be computed only on land owned by and in possession of the applicant' },
    ],
    authorities: [
      { name: 'District Deputy Registrar (DDR)', role: 'Primary — Deemed Conveyance application under Section 11 MCS Act', portal: 'https://mahasahakar.maharashtra.gov.in', portalLabel: 'PRATYAY Portal', address: 'DDR Office, Pune District — contact your taluka DDR' },
      { name: 'MahaRERA', role: 'For RERA-registered projects — non-conveyance complaint', portal: 'https://maharerait.maharashtra.gov.in', portalLabel: 'MahaRERA Complaint Portal', address: 'Bandra-Kurla Complex, Mumbai' },
      { name: 'Sub-Registrar Office', role: 'Registration of Conveyance Deed once DDR passes order', portal: null, address: 'Your local Sub-Registrar office' },
      { name: 'Bombay High Court', role: 'Writ Petition for mandamus if DDR does not act in 6 months', portal: 'https://bombayhighcourt.nic.in', portalLabel: 'HC Filing', address: 'Bombay High Court, Fort, Mumbai / Nagpur Bench' },
    ],
    docs: [
      'Sale Deed / Agreement for Sale (registered)',
      'Index II from Sub-Registrar',
      '7/12 extract or Property Card',
      'Society Registration Certificate',
      'List of all members with flat numbers',
      'Copies of notices sent to builder',
      'Conveyance correspondence (emails, letters)',
      'Builder\'s reply (if any)',
    ],
    timeline: [
      { period: 'Week 1', action: 'Collect all documents. Pass MC resolution authorising filing of deemed conveyance.' },
      { period: 'Week 2', action: 'Send registered legal notice to builder giving 15-day deadline to execute deed.' },
      { period: 'Month 1', action: 'If no response, file online Deemed Conveyance application on PRATYAY portal. Pay prescribed fee.' },
      { period: 'Month 1–2', action: 'Simultaneously file RERA complaint at maharerait.maharashtra.gov.in for non-conveyance.' },
      { period: 'Month 2–6', action: 'DDR conducts hearing. Builder gets opportunity to appear. DDR must pass order within 6 months.' },
      { period: 'If stalled', action: 'File Writ Petition in Bombay High Court for mandamus directing DDR to pass speaking order.' },
    ],
    steps: [
      { n: 1, action: 'Pass MC Resolution', law: 'MCS Model Bye-Laws', detail: 'Hold a Managing Committee meeting. Pass a resolution authorising the Secretary/Chairman to file deemed conveyance application and engage an advocate. Keep certified copy of resolution.' },
      { n: 2, action: 'Send Registered Legal Notice to Builder', law: 'MOFA 1963 § 11', detail: 'Send notice via Registered Post AD giving 15-day deadline to execute Conveyance Deed. Cite MOFA Section 11 and RERA Section 17. Keep postal receipt and delivery proof.' },
      { n: 3, action: 'File on PRATYAY Portal (Deemed Conveyance)', law: 'MCS Act 1960 § 11(3)', detail: 'Apply online at mahasahakar.maharashtra.gov.in. Upload: member list, sale agreements, Index II, 7/12, society registration, notices to builder. Pay prescribed fee. Get acknowledgment number.' },
      { n: 4, action: 'File MahaRERA Complaint Simultaneously', law: 'RERA 2016 § 17', detail: 'File at maharerait.maharashtra.gov.in. Select "Conveyance" as issue type. Attach same documents. RERA can direct builder to execute deed and impose penalty of up to 5% of project cost.' },
      { n: 5, action: 'Follow Up DDR Hearing', law: 'MCS Act 1960 § 11(3)', detail: 'Attend DDR hearings. DDR must pass order within 6 months. If not, file complaint with Additional Registrar or approach Bombay High Court by Writ Petition.' },
      { n: 6, action: 'Register the Deed', law: 'Registration Act 1908', detail: 'Once DDR passes Deemed Conveyance order, get it registered at Sub-Registrar office. Pay stamp duty (1% of market value). This completes the title transfer to the society.' },
    ],
    draftLetter: (details) => `To,
The District Deputy Registrar,
Co-operative Societies,
${details.city || '[City]'} District

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Application for Deemed Conveyance under Section 11 of the Maharashtra 
Co-operative Societies Act, 1960 read with MOFA 1963

Respected Sir/Madam,

We, the Managing Committee of ${details.society || '[Society Name]'} Co-operative Housing 
Society Ltd., Registration No. [___], hereby submit this application for 
Deemed Conveyance of the land admeasuring [___] sq.m. at [Address].

The builder/promoter M/s [Builder Name] has failed and refused to execute a 
Conveyance Deed despite repeated requests. The society was registered on [Date] 
and possession of flats was given to [No.] members.

We request your honour to:
1. Accept this application for Deemed Conveyance under Section 11 MCS Act
2. Issue notice to the builder to appear and show cause
3. Pass an order for Deemed Conveyance in favour of this society
4. Direct the Sub-Registrar to register the Deemed Conveyance Deed

Enclosed: Member list, Sale Agreements, Index II, 7/12, Society Registration Certificate.

Yours faithfully,
[Secretary Name]
${details.society || '[Society Name]'} CHS Ltd.`,
  },
  {
    id: 'oc',
    icon: '📋',
    title: 'OC / Completion Certificate Pending',
    titleMr: 'भोगवटा प्रमाणपत्र',
    desc: 'Builder not obtaining OC, occupation without OC, partial OC',
    subIssues: [
      'Builder has not obtained OC/CC from authority',
      'Residents occupying without valid OC',
      'Partial OC only — full building not cleared',
      'Builder claiming OC obtained but not sharing copy',
    ],
    laws: [
      { ref: 'MOFA 1963 § 3', detail: 'Promoter must obtain OC before allowing occupation' },
      { ref: 'RERA 2016 § 11(4)(b)', detail: 'Promoter must obtain Completion Certificate and provide to allottees' },
      { ref: 'RERA 2016 § 18', detail: 'Right to compensation for failure to hand over possession with OC' },
      { ref: 'RERA 2016 § 63', detail: 'Penalty up to 5% of estimated project cost for non-compliance' },
    ],
    authorities: [
      { name: 'MahaRERA', role: 'Primary — complaint for non-OC, compensation, penalty on builder', portal: 'https://maharerait.maharashtra.gov.in', portalLabel: 'MahaRERA Complaint Portal', address: 'BKC, Mumbai / Regional offices' },
      { name: 'PMC / PMRDA / Municipal Authority', role: 'Issue OC after inspection — complain to them if builder has not applied', portal: 'https://pmccare.in', portalLabel: 'PMC Portal', address: 'Concerned Ward Office, Pune' },
      { name: 'District Consumer Forum', role: 'Deficiency of service — compensation for delay and expenses', portal: null, address: 'District Consumer Disputes Redressal Commission, Pune' },
    ],
    docs: [
      'Agreement for Sale (registered)',
      'Possession letter from builder',
      'Payment receipts',
      'Builder\'s correspondence regarding OC',
      'RERA project registration printout',
      'Photographs showing occupation without OC',
    ],
    timeline: [
      { period: 'Week 1', action: 'Write to builder demanding OC copy within 15 days. Send via registered post.' },
      { period: 'Week 2', action: 'Check RERA portal — does RERA registration show OC obtained? Print the page.' },
      { period: 'Month 1', action: 'File MahaRERA complaint. Select "OC/CC" as issue. Demand penalty and compensation.' },
      { period: 'Month 1', action: 'File complaint with PMC/PMRDA that builder is allowing occupation without OC.' },
      { period: 'Month 2–4', action: 'RERA hearing. RERA can direct builder to obtain OC within fixed time and pay compensation.' },
    ],
    steps: [
      { n: 1, action: 'Write to Builder Demanding OC', law: 'RERA 2016 § 11(4)(b)', detail: 'Send written demand by Registered Post AD. Give 15-day deadline. State that failure will result in RERA complaint and compensation claim. Keep delivery proof.' },
      { n: 2, action: 'Verify on RERA Portal', law: 'RERA 2016', detail: 'Check maharera.mahaonline.gov.in for your project. See if OC status is updated. Screenshot the page showing OC pending as evidence.' },
      { n: 3, action: 'File MahaRERA Complaint', law: 'RERA 2016 § 31, 18', detail: 'File at maharerait.maharashtra.gov.in. Select OC/Possession issue. Claim compensation for expenses incurred (rent, interest on loan) for delay period. RERA imposes penalty up to 5% of project cost.' },
      { n: 4, action: 'Complain to Municipal Authority', law: 'MOFA 1963 § 3', detail: 'Write to PMC/PMRDA stating builder is allowing occupation without OC. This creates official record and may prompt authority to issue notice to builder.' },
      { n: 5, action: 'File Consumer Forum Complaint', law: 'Consumer Protection Act 2019', detail: 'File in District Consumer Disputes Redressal Commission for deficiency of service. Claim rent paid for alternate accommodation, interest on home loan EMIs paid during delay period.' },
    ],
    draftLetter: (details) => `To,
The Adjudicating Officer,
Maharashtra Real Estate Regulatory Authority (MahaRERA),
Mumbai

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Complaint under Section 31 of RERA 2016 — Non-Obtaining of Occupation 
Certificate — ${details.society || '[Project Name]'}

RERA Registration No.: [___]

Dear Sir/Madam,

I/We, the residents/allottees of ${details.society || '[Project Name]'}, ${details.city || '[City]'}, 
hereby file this complaint against the Promoter/Builder for failure to obtain 
Occupancy Certificate despite handing over physical possession.

The builder has handed over flats without obtaining a valid OC from ${details.city || '[Authority]'}, 
causing serious legal, financial and practical difficulties to residents including:
- Inability to obtain home loan transfer/refinancing
- No valid water/drainage connection possible
- Risk of occupation being declared illegal
- Loss of insurance coverage

We request MahaRERA to:
1. Direct the Promoter to obtain OC within 30 days
2. Award compensation for delay under Section 18 RERA
3. Impose penalty under Section 63 RERA

Complainant: [Name], Flat No. [___]
Contact: [Phone / Email]`,
  },
  {
    id: 'maintenance',
    icon: '🔧',
    title: 'Maintenance Disputes & Levy',
    titleMr: 'देखभाल वाद',
    desc: 'Excess charges, no accounts, illegal levies, no receipts',
    subIssues: [
      'Maintenance charges increased without AGM approval',
      'Audited accounts not shared with members',
      'Illegal special levy imposed',
      'Receipts not issued for maintenance paid',
    ],
    laws: [
      { ref: 'MCS Act 1960 § 79A', detail: 'Every member has right to inspect books of accounts' },
      { ref: 'MCS Act 1960 § 73CB', detail: 'Duties of Managing Committee — must follow bye-laws' },
      { ref: 'MCS Bye-Laws 2014 Bye-Law 66–68', detail: 'Maintenance charges formula — must follow prescribed method' },
      { ref: 'MCS Bye-Laws 2014 Bye-Law 158', detail: 'Any special levy requires AGM approval' },
    ],
    authorities: [
      { name: 'District Deputy Registrar (DDR)', role: 'Complaint for bye-law violation, illegal levy, audit inspection', portal: null, address: 'DDR Office, your district' },
      { name: 'Co-operative Court', role: 'Dispute resolution for maintenance disputes, account inspection', portal: null, address: 'Co-operative Court, Pune' },
      { name: 'Maharashtra Co-operative Tribunal', role: 'Appeal against DDR orders', portal: null, address: 'MCS Tribunal' },
    ],
    docs: [
      'Maintenance demand letters received',
      'Bank statements showing payments made',
      'Receipts (if any) issued by society',
      'Written requests sent to MC for accounts',
      'MC\'s replies (if any)',
      'Copy of last audited accounts (if available)',
      'Copy of Model Bye-Laws',
    ],
    timeline: [
      { period: 'Week 1', action: 'Send written request to Secretary for audited accounts and maintenance calculation sheet. Registered post.' },
      { period: 'Week 2–3', action: 'If no response, send second notice citing MCS Act Section 79A right to inspect accounts.' },
      { period: 'Month 1', action: 'File complaint with DDR against MC for violation of bye-laws and non-disclosure of accounts.' },
      { period: 'Month 1', action: 'Pay undisputed maintenance amount. Withhold excess with written justification letter. Do not default entirely.' },
      { period: 'Month 2–3', action: 'DDR conducts inquiry. Can order audit and inspection of society accounts.' },
    ],
    steps: [
      { n: 1, action: 'Demand Accounts in Writing', law: 'MCS Act § 79A', detail: 'Write to Secretary requesting: (a) audited accounts for last 3 years, (b) maintenance calculation sheet showing how charges are derived, (c) receipts for your payments. Send by Registered Post AD. Keep receipt.' },
      { n: 2, action: 'Verify Against Bye-Laws', law: 'MCS Bye-Laws 66–68', detail: 'Download MCS Model Bye-Laws from mahasahakar.maharashtra.gov.in. Compare maintenance calculation against prescribed formula. Check if increase was approved at AGM.' },
      { n: 3, action: 'Pay Undisputed Amount', law: 'MCS Act', detail: 'Calculate what you believe is the correct maintenance. Pay that amount by cheque/NEFT. Write "paid under protest for excess amount charged" in the letter. This prevents you from being termed defaulter while dispute is ongoing.' },
      { n: 4, action: 'File Complaint with DDR', law: 'MCS Act § 73CB', detail: 'File written complaint with District Deputy Registrar. Attach: your letters, MC\'s replies/silence, maintenance bills, payment proof. Request: audit of accounts, inspection of records, action against MC for bye-law violation.' },
      { n: 5, action: 'Approach Co-operative Court', law: 'MCS Act', detail: 'If DDR does not act in 60 days, file dispute before the Co-operative Court. The court can order society to produce accounts, refund excess collected, and penalise errant MC members.' },
    ],
    draftLetter: (details) => `To,
The Secretary,
${details.society || '[Society Name]'} CHS Ltd.,
${details.city || '[City]'}

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Request for Audited Accounts and Maintenance Calculation Sheet 
under Section 79A of the Maharashtra Co-operative Societies Act, 1960

Dear Secretary,

I, [Name], flat owner of Flat No. [___], hereby demand the following 
under my statutory right under Section 79A of the MCS Act, 1960:

1. Audited accounts of the society for the years [20__ to 20__]
2. Maintenance charge calculation sheet showing how monthly charges 
   are computed per bye-laws 66–68
3. Copy of AGM resolution approving the current maintenance rate
4. Official receipts for maintenance paid by me

Please provide the above within 15 days of receipt of this letter.

If not provided, I shall be constrained to file a complaint before the 
District Deputy Registrar under MCS Act Section 79A and Bye-Law 158.

Yours faithfully,
[Name]
Flat No. [___], ${details.society || '[Society Name]'}`,
  },
  {
    id: 'parking',
    icon: '🚗',
    title: 'Parking Rights Violation',
    titleMr: 'पार्किंग हक्क',
    desc: 'Illegal parking sale, non-allotment, stilt encroachment',
    subIssues: [
      'Builder sold open parking slots (illegal per Supreme Court)',
      'Covered parking not allotted as per agreement',
      'Stilt/podium parking converted to shops',
      'Visitor parking blocked by builder or residents',
    ],
    laws: [
      { ref: 'Supreme Court — Nahalchand (2010)', detail: 'Open parking spaces are common amenities and CANNOT be sold separately' },
      { ref: 'MOFA 1963 § 3(f), 7A', detail: 'Promoter must disclose and allot parking as per agreement' },
      { ref: 'RERA 2016 § 14', detail: 'Builder must adhere to sanctioned plan — no conversion of parking' },
      { ref: 'Consumer Protection Act 2019 § 2(47)', detail: 'Unfair trade practice — selling something that cannot legally be sold' },
    ],
    authorities: [
      { name: 'MahaRERA', role: 'For RERA-registered projects — illegal parking sale, non-allotment', portal: 'https://maharerait.maharashtra.gov.in', portalLabel: 'MahaRERA Complaint Portal', address: 'BKC, Mumbai' },
      { name: 'District Consumer Forum', role: 'Deficiency of service, unfair trade practice, compensation', portal: null, address: 'District Consumer Disputes Redressal Commission' },
      { name: 'PMC / PMRDA', role: 'Stilt conversion to commercial use — building bye-law violation', portal: 'https://pmccare.in', portalLabel: 'PMC Portal', address: 'Concerned Ward Office' },
      { name: 'Police Station', role: 'If physical trespass of your allotted parking slot', portal: null, address: 'Local Police Station — IPC Section 447' },
    ],
    docs: [
      'Agreement for Sale showing parking clause',
      'Allotment letter for parking (if any)',
      'Payment receipts showing parking charges paid',
      'Photographs of encroachment / illegal sale',
      'Builder\'s advertisement / brochure showing parking',
      'Sanctioned building plan (showing stilt parking)',
      'Supreme Court 2010 judgment (Nahalchand case)',
    ],
    timeline: [
      { period: 'Week 1', action: 'Photograph encroachment. Collect your agreement and allotment letter. Note the Supreme Court 2010 judgment.' },
      { period: 'Week 2', action: 'Send legal notice to builder citing SC judgment and agreement clause. Give 15-day deadline.' },
      { period: 'Month 1', action: 'File RERA complaint at maharerait.maharashtra.gov.in for parking violation.' },
      { period: 'Month 1', action: 'File Consumer Forum complaint for unfair trade practice and deficiency of service.' },
      { period: 'Month 1–2', action: 'If physical trespass, file police complaint under IPC Section 447.' },
    ],
    steps: [
      { n: 1, action: 'Document the Violation Thoroughly', law: 'Evidence', detail: 'Take dated photographs and video of: encroachment, conversion of stilt to shops, any "For Sale" signboards on open parking. Print your Agreement for Sale showing parking clause. Download Nahalchand SC judgment from indiankanoon.org.' },
      { n: 2, action: 'Send Legal Notice to Builder', law: 'SC Nahalchand 2010 + MOFA § 7A', detail: 'Issue registered legal notice citing SC 2010 judgment. State: open parking cannot be sold; demand immediate allotment of covered parking as per agreement; demand removal of encroachment within 15 days.' },
      { n: 3, action: 'File MahaRERA Complaint', law: 'RERA 2016 § 14, 31', detail: 'File at maharerait.maharashtra.gov.in. Attach agreement, photographs, SC judgment. RERA can direct restoration of parking and impose penalty.' },
      { n: 4, action: 'File Consumer Forum Complaint', law: 'Consumer Protection Act 2019', detail: 'File in District Consumer Commission. Cite unfair trade practice (selling open parking) and deficiency of service (not allotting covered parking as agreed). Claim compensation for harassment + cost of alternate parking.' },
      { n: 5, action: 'Complain to PMC/PMRDA for Stilt Conversion', law: 'Building Bye-Laws', detail: 'If stilt parking is converted to shops/storage, file complaint with Ward Officer of PMC/PMRDA. This is unauthorised construction — authority can seal the premises.' },
    ],
    draftLetter: (details) => `To,
The Builder / Developer,
[Builder Name & Address]

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Legal Notice — Illegal Sale of Open Parking / Non-Allotment of 
Covered Parking — ${details.society || '[Project Name]'}, ${details.city || '[City]'}

Dear Sir/Madam,

Under instructions of my client [Name], flat owner of Flat No. [___] in 
${details.society || '[Project Name]'}, I hereby serve this legal notice:

1. The Supreme Court of India in Nahalchand Laloochand Pvt. Ltd. v. 
   Panchali CHS Ltd. (Civil Appeal 6239/2010) has categorically held that 
   OPEN PARKING SPACES ARE COMMON AMENITIES AND CANNOT BE SOLD.

2. As per Clause [___] of our registered Agreement for Sale dated [___], 
   one covered parking space was promised to my client. The same has 
   not been allotted despite possession.

3. The stilt parking areas have been illegally converted to commercial 
   shops in violation of the sanctioned building plan.

You are hereby directed to within 15 days:
(a) Allot covered parking as per the Agreement
(b) Cease all sales of open parking immediately  
(c) Restore stilt parking to its original use

Failing which, proceedings before MahaRERA, Consumer Forum, and 
Police authorities shall be initiated without further notice.

[Advocate Name, Enrollment No.]`,
  },
  {
    id: 'rera',
    icon: '⚖️',
    title: 'RERA — Project Delay / Violation',
    titleMr: 'RERA तक्रार',
    desc: 'Project delay, specification change, builder not updating RERA',
    subIssues: [
      'Possession not given beyond agreed date',
      'Specifications changed without consent',
      'Builder not updating RERA portal quarterly',
      'Project not registered on RERA',
    ],
    laws: [
      { ref: 'RERA 2016 § 18', detail: 'Right to refund with interest OR compensation if possession not given by due date' },
      { ref: 'RERA 2016 § 14', detail: 'Builder cannot change plans/specs without written consent of 2/3 allottees' },
      { ref: 'RERA 2016 § 11(2)', detail: 'Builder must update project quarterly on RERA portal' },
      { ref: 'RERA 2016 § 3', detail: 'All projects > 500 sq.m. must be registered on RERA before sale' },
    ],
    authorities: [
      { name: 'MahaRERA', role: 'Primary — file complaint for delay, spec change, non-registration', portal: 'https://maharerait.maharashtra.gov.in', portalLabel: 'MahaRERA Complaint Portal', address: 'World Trade Centre, BKC, Mumbai' },
      { name: 'MahaRERA Appellate Tribunal', role: 'Appeal against MahaRERA order', portal: null, address: 'Mumbai' },
      { name: 'District Consumer Forum', role: 'Alternative for deficiency of service, refund, compensation', portal: null, address: 'District Consumer Commission' },
    ],
    docs: [
      'Agreement for Sale with possession date clause',
      'Payment receipts / bank loan statements',
      'RERA registration printout from portal',
      'Builder\'s correspondence about delay',
      'Photographs of construction status',
      'Builder\'s original brochure / floor plan',
      'Any amendment agreement signed',
    ],
    timeline: [
      { period: 'Week 1', action: 'Check RERA portal (maharera.mahaonline.gov.in) — note registered completion date, quarterly update status.' },
      { period: 'Week 2', action: 'Calculate delay from agreed possession date. Calculate interest @ SBI MCLR + 2% on all amounts paid.' },
      { period: 'Month 1', action: 'File MahaRERA complaint. Choose: (a) compensation and possession OR (b) refund with interest. Both options available.' },
      { period: 'Month 2–4', action: 'MahaRERA hearing. Builder must appear and justify delay. RERA routinely awards interest on delayed possession.' },
      { period: 'Ongoing', action: 'Continue paying EMIs while complaint is pending — your RERA interest award will compensate this.' },
    ],
    steps: [
      { n: 1, action: 'Calculate Your Compensation', law: 'RERA 2016 § 18', detail: 'Compensation = SBI MCLR + 2% interest on all amounts paid, calculated from agreed possession date to actual/current date. Add rent paid for alternate accommodation. This is the amount you can claim from RERA.' },
      { n: 2, action: 'Verify RERA Registration', law: 'RERA 2016 § 3', detail: 'Go to maharera.mahaonline.gov.in → Search project by name or RERA number. Print the project page. Note: registered completion date, whether quarterly updates are filed, any existing complaints.' },
      { n: 3, action: 'Write to Builder Formally', law: 'RERA 2016 § 18', detail: 'Send registered letter stating: possession not given by [date]; you will exercise your right under Section 18 RERA to claim interest/refund; give 15-day final opportunity. This creates a record before filing.' },
      { n: 4, action: 'File MahaRERA Complaint', law: 'RERA 2016 § 31', detail: 'File at maharerait.maharashtra.gov.in. Select "Allottee Complaint". Specify relief: possession with compensation OR refund with interest. Attach: agreement, payment receipts, RERA printout. Pay nominal filing fee.' },
      { n: 5, action: 'Attend Hearing and Enforce Order', law: 'RERA 2016 § 40', detail: 'MahaRERA routinely awards interest for delayed possession. Once order is passed, if builder does not comply, file execution petition. RERA can issue recovery certificate like a court decree.' },
    ],
    draftLetter: (details) => `To,
The Adjudicating Officer,
Maharashtra Real Estate Regulatory Authority (MahaRERA)

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Complaint under Section 31 of RERA 2016 — Delay in Possession — 
${details.society || '[Project Name]'}, RERA No. [___]

Dear Sir/Madam,

I, [Complainant Name], allottee of Flat No. [___] in ${details.society || '[Project Name]'}, 
hereby file this complaint against the Respondent Promoter.

FACTS:
1. Agreement for Sale executed on [Date] for Rs. [Amount]
2. Agreed possession date: [Date as per Agreement]
3. Amount paid: Rs. [Amount] — fully/partially paid
4. Possession not given as of today — delay of [X] months/years
5. Builder has not provided any valid justification for delay

RELIEF CLAIMED:
Option A — Possession with Compensation:
  Interest @ SBI MCLR + 2% on Rs. [Amount] from [date] to date of 
  possession = approx. Rs. [Calculate]

Option B — Refund with Interest (if possession not desired):
  Full refund of Rs. [Amount] + interest @ SBI MCLR + 2%

Additional: Rs. [Amount] compensation for mental agony and 
alternative accommodation expenses.

[Complainant Name, Address, Contact]`,
  },
  {
    id: 'illegal_construction',
    icon: '🚧',
    title: 'Illegal Construction by Builder',
    titleMr: 'बेकायदेशीर बांधकाम',
    desc: 'Construction beyond sanctioned plan, SWO violation, encroachment',
    subIssues: [
      'Construction beyond sanctioned plan',
      'Building on society / common area land',
      'Violation of Stop Work Order',
      'Unauthorized additional floors',
    ],
    laws: [
      { ref: 'MRTP Act 1966 § 44/45', detail: 'No development without permission; unauthorized development is illegal' },
      { ref: 'MRTP Act 1966 § 51', detail: 'Planning authority can require removal of unauthorized development' },
      { ref: 'UDCPR 2020', detail: 'All development must conform to approved plans and FSI limits' },
      { ref: 'RERA 2016 § 14', detail: 'Builder cannot deviate from sanctioned/RERA-registered plans' },
    ],
    authorities: [
      { name: 'PMC / PMRDA (Town Planning)', role: 'Primary — Stop Work Order, demolition notice, Section 51 proceedings', portal: 'https://pmccare.in', portalLabel: 'PMC Portal', address: 'Town Planning Department, Ward Office' },
      { name: 'MahaRERA', role: 'For RERA projects — plan deviation complaint', portal: 'https://maharerait.maharashtra.gov.in', portalLabel: 'MahaRERA Complaint', address: 'BKC, Mumbai' },
      { name: 'Bombay High Court', role: 'Writ Petition for urgent stop work relief if authority is not acting', portal: 'https://bombayhighcourt.nic.in', portalLabel: 'HC Filing', address: 'Bombay High Court, Fort, Mumbai' },
      { name: 'Police Station', role: 'FIR for criminal trespass on society land (IPC § 447)', portal: null, address: 'Local Police Station' },
    ],
    docs: [
      'Photographs and video of illegal construction (dated)',
      'Copy of sanctioned building plan (from RTI)',
      'Comparison showing deviation from plan',
      'Copy of Stop Work Order (if any)',
      'Previous complaints filed (if any)',
      'Society Registration Certificate',
      '7/12 extract showing society ownership',
    ],
    timeline: [
      { period: 'Immediately', action: 'Photograph and video the construction with date/time stamp. This is your primary evidence.' },
      { period: 'Week 1', action: 'File RTI with PMRDA/PMC for sanctioned plan and any permissions given to builder.' },
      { period: 'Week 1', action: 'File urgent complaint with Ward Officer of PMC/PMRDA requesting immediate site inspection and Stop Work Order.' },
      { period: 'Week 2', action: 'File MahaRERA complaint for plan deviation (if RERA-registered project).' },
      { period: 'If urgent', action: 'File Writ Petition in Bombay High Court for interim injunction — can be filed and heard within 24-48 hours.' },
    ],
    steps: [
      { n: 1, action: 'Create Dated Evidence Immediately', law: 'Evidence Act', detail: 'Take photographs and videos with GPS location and date stamp. Note exact description: floor/location of unauthorized work, dimensions if possible, workers present. This evidence is critical — courts rely on contemporaneous records.' },
      { n: 2, action: 'File RTI for Sanctioned Plan', law: 'RTI Act 2005', detail: 'File RTI with PMRDA/PMC requesting: (a) sanctioned building plan, (b) commencement certificate, (c) any revised sanctions, (d) complaints received and action taken. You will get documents within 30 days that form the backbone of your legal case.' },
      { n: 3, action: 'File Complaint with Ward Officer', law: 'MRTP Act § 44/45', detail: 'File urgent written complaint with Ward Officer of PMC/PMRDA. Request: immediate site inspection, Stop Work Order under MRTP Act Section 45, Show Cause Notice to builder. Attach photographs. Keep acknowledgment copy.' },
      { n: 4, action: 'File MahaRERA Complaint', law: 'RERA 2016 § 14', detail: 'If RERA-registered project, file complaint at maharerait.maharashtra.gov.in for deviation from registered plans. RERA can direct restoration to original approved plan.' },
      { n: 5, action: 'Approach Bombay High Court if Urgent', law: 'Article 226 Constitution', detail: 'If construction is rapid and causing irreversible damage, and PMC/PMRDA is not acting, file Writ Petition in Bombay High Court. Courts can grant ex parte interim stay within 24-48 hours in urgent cases. Engage an experienced advocate.' },
    ],
    draftLetter: (details) => `To,
The Ward Officer / Town Planning Inspector,
[Ward Office Address],
PMC / PMRDA, ${details.city || 'Pune'}

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Urgent Complaint — Illegal / Unauthorized Construction at 
[Plot / Survey / Gat No. ___], ${details.city || '[City]'}

Respected Sir/Madam,

We, the members of ${details.society || '[Society Name]'}, hereby bring to your 
urgent attention the following illegal construction being carried out by 
M/s [Builder Name] at the above address:

DETAILS OF ILLEGAL CONSTRUCTION:
- Nature: [e.g. unauthorized floors / construction on society land / 
  deviation from sanctioned plan]  
- Location: [Specific location on site]
- Construction began: [Date]
- Current status: [e.g. 2 unauthorized floors constructed]

LEGAL VIOLATIONS:
- MRTP Act 1966 Section 44/45 — development without/beyond permission
- UDCPR 2020 — FSI and setback violations
- [Add Stop Work Order violation if SWO exists]

We request:
1. Immediate site inspection by Town Planning Inspector
2. Issuance of Stop Work Order under MRTP Act Section 45
3. Show Cause Notice to builder
4. Initiation of Section 51 proceedings

Photographs enclosed. Please acknowledge receipt.

Yours faithfully,
[Secretary Name]
${details.society || '[Society Name]'}`,
  },
  {
    id: 'elections',
    icon: '🗳️',
    title: 'Society Election Disputes',
    titleMr: 'निवडणूक वाद',
    desc: 'Elections not held, voter list manipulation, AGM not conducted',
    subIssues: [
      'Elections not held for more than 5 years',
      'AGM not conducted annually',
      'Voter list does not include all members',
      'Managing Committee acting without mandate',
    ],
    laws: [
      { ref: 'MCS Act 1960 § 73CB', detail: 'Elections of Managing Committee must be held every 5 years' },
      { ref: 'MCS Act 1960 § 75', detail: 'AGM must be held within 3 months of close of financial year' },
      { ref: 'MCS Election Rules 2014', detail: 'Voter list, election procedure, dispute resolution' },
      { ref: 'MCS Act 1960 § 78', detail: 'Supersession — DDR can appoint Administrator if MC fails in duties' },
    ],
    authorities: [
      { name: 'District Deputy Registrar (DDR)', role: 'Primary — complaint for non-conduct of elections, supersession', portal: null, address: 'DDR Office, your district' },
      { name: 'Co-operative Election Authority', role: 'Election conduct, voter list disputes, election-related complaints', portal: null, address: 'Maharashtra Co-operative Election Authority' },
      { name: 'Co-operative Court', role: 'Dispute over election results, eligibility challenges', portal: null, address: 'Co-operative Court, your district' },
    ],
    docs: [
      'Society Registration Certificate',
      'Last MC resolution / minutes showing no elections',
      'Written requests sent to MC for elections',
      'Voter list (current and previous)',
      'MC\'s correspondence (if any)',
      'Society bye-laws copy',
    ],
    timeline: [
      { period: 'Week 1', action: 'Check: When was last election? When does current MC term expire? Is 5-year limit exceeded?' },
      { period: 'Week 2', action: 'Send written demand to Secretary to conduct elections within 30 days citing MCS Act Section 73CB.' },
      { period: 'Month 1', action: 'File complaint with DDR if no response. Request appointment of Administrator under Section 78.' },
      { period: 'Month 1', action: 'File complaint with Co-operative Election Authority for election supervision.' },
      { period: 'Month 2–3', action: 'DDR can appoint Administrator and order elections to be held under supervision.' },
    ],
    steps: [
      { n: 1, action: 'Verify Election Default', law: 'MCS Act § 73CB', detail: 'Check: date of last election (from MC resolution or records), date current MC term expires, whether 5-year limit has passed. Get this from society records — you have a right to inspect under Section 79A.' },
      { n: 2, action: 'Demand Elections in Writing', law: 'MCS Act § 73CB', detail: 'Send registered notice to Secretary and Chairman demanding elections be conducted within 30 days citing Section 73CB. Request voter list be prepared and circulated 15 days before election date.' },
      { n: 3, action: 'File Complaint with DDR', law: 'MCS Act § 78', detail: 'File complaint with District Deputy Registrar. Request: (a) order directing MC to conduct elections within 30 days, (b) appoint Administrator under Section 78 till elections are held, (c) investigate any irregularities in voter list.' },
      { n: 4, action: 'File with Co-operative Election Authority', law: 'MCS Election Rules 2014', detail: 'File complaint with the Maharashtra Co-operative Election Authority for supervision of elections. They can depute an election officer to oversee the process and ensure fair conduct.' },
      { n: 5, action: 'Approach Co-operative Court if Needed', law: 'MCS Act', detail: 'If DDR orders are not complied with, file petition before Co-operative Court. Court can compel elections, declare MC\'s term invalid, and restrain illegal decisions taken by an MC without mandate.' },
    ],
    draftLetter: (details) => `To,
The District Deputy Registrar,
Co-operative Societies,
${details.city || '[District]'}

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Complaint — Non-Conduct of Elections of Managing Committee — 
${details.society || '[Society Name]'} CHS Ltd.
Society Registration No.: [___]

Respected Sir/Madam,

I/We, members of ${details.society || '[Society Name]'} CHS Ltd., hereby 
bring to your notice the following:

1. The last election of the Managing Committee was held on [Date].
2. The 5-year term expired on [Date].
3. Despite written demand dated [Date], the current MC has not conducted 
   elections, in violation of Section 73CB of the MCS Act, 1960.
4. The current MC is taking major financial and legal decisions 
   (maintenance increase, contracts worth Rs. [___]) without a 
   valid mandate.

We humbly request:
1. Direct the MC to conduct elections within 30 days
2. Appoint an Administrator under Section 78 MCS Act to manage 
   affairs till elections are held
3. Order preparation of correct voter list
4. Investigate financial irregularities if any

[Member Name(s), Flat No(s)., Signatures]`,
  },
  {
    id: 'defects',
    icon: '🏚️',
    title: 'Builder Defects & Warranty',
    titleMr: 'बांधकाम दोष',
    desc: 'Structural defects, leakage, inferior materials, warranty denial',
    subIssues: [
      'Structural cracks / seepage within warranty period',
      'Builder refusing warranty repairs',
      'Materials inferior to what was agreed',
      'Common area defects not rectified',
    ],
    laws: [
      { ref: 'RERA 2016 § 14(3)', detail: 'Builder responsible for structural defects for 5 years from possession — must rectify within 30 days' },
      { ref: 'MOFA 1963', detail: 'Builder liable for defects in construction if specifications not met' },
      { ref: 'Consumer Protection Act 2019 § 2(11)', detail: 'Deficiency in service — inferior quality construction is actionable' },
    ],
    authorities: [
      { name: 'MahaRERA', role: 'Structural defect complaint within 5-year warranty — fastest remedy', portal: 'https://maharerait.maharashtra.gov.in', portalLabel: 'MahaRERA Complaint Portal', address: 'BKC, Mumbai' },
      { name: 'District Consumer Forum', role: 'Deficiency of service, inferior materials, compensation', portal: null, address: 'District Consumer Commission' },
      { name: 'State Consumer Commission', role: 'If claim value > Rs. 50 lakh', portal: null, address: 'Maharashtra State Consumer Commission, Mumbai' },
    ],
    docs: [
      'Agreement for Sale with specification clause',
      'Possession letter',
      'Photographs / videos of defects (dated)',
      'Structural engineer\'s report (recommended)',
      'Written complaints sent to builder',
      'Builder\'s replies / silence',
      'RERA registration of project',
    ],
    timeline: [
      { period: 'Week 1', action: 'Document all defects: photographs, video, written description. Get structural engineer assessment if serious.' },
      { period: 'Week 2', action: 'Send written defect notice to builder by Registered Post AD. Cite RERA Section 14(3). Give 30-day deadline to rectify.' },
      { period: 'Month 1', action: 'If no response, file MahaRERA complaint. RERA can direct rectification within 30 days.' },
      { period: 'Month 1', action: 'Simultaneously file Consumer Forum complaint for deficiency of service and compensation.' },
    ],
    steps: [
      { n: 1, action: 'Document Defects Professionally', law: 'RERA 2016 § 14(3)', detail: 'Hire a structural engineer to inspect and write a report — this is critical evidence. Photograph every defect with measurements. Note: date of possession (5-year clock starts from possession date).' },
      { n: 2, action: 'Send Defect Rectification Notice', law: 'RERA 2016 § 14(3)', detail: 'Write to builder listing all defects. Cite RERA Section 14(3) — builder must rectify structural defects within 30 days of written notice. If builder ignores or refuses, you have clear RERA violation.' },
      { n: 3, action: 'File MahaRERA Complaint', law: 'RERA 2016 § 14(3), 31', detail: 'File at maharerait.maharashtra.gov.in. Attach: defect list, photographs, engineer report, notice to builder, builder\'s reply/silence. RERA regularly orders builders to rectify defects within fixed timeframes.' },
      { n: 4, action: 'File Consumer Forum Complaint', law: 'Consumer Protection Act 2019', detail: 'File in District Consumer Commission for: (a) cost of repairs if you had to do it yourself, (b) compensation for mental agony and inconvenience, (c) cost of alternative accommodation during repairs. Calculate total claim amount.' },
      { n: 5, action: 'Get Repairs Done and Recover Cost', law: 'Consumer Protection Act 2019', detail: 'If builder still does not rectify, get repairs done by a contractor. Keep all bills and records. Consumer Forum can direct builder to reimburse repair costs with interest plus additional compensation.' },
    ],
    draftLetter: (details) => `To,
[Builder/Developer Name],
[Builder\'s Office Address]

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Notice for Rectification of Structural Defects under Section 14(3) 
of the Real Estate (Regulation and Development) Act, 2016

Dear Sir/Madam,

I/We, owner(s) of Flat No. [___] in ${details.society || '[Project Name]'}, 
hereby bring to your notice the following defects/deficiencies:

DEFECTS OBSERVED:
1. [Defect 1 — e.g. Water seepage in master bedroom ceiling — noticed since monsoon 2024]
2. [Defect 2 — e.g. Cracks in living room wall — 3 cracks of 2–4 cm width]
3. [Defect 3 — e.g. Inferior grade tiles used in bathroom vs agreement]

Date of possession: [Date] (within 5-year warranty period)

Under Section 14(3) of RERA 2016, you are legally obligated to rectify 
all structural defects within 30 days of receipt of this notice.

If rectification is not completed within 30 days, we shall file a 
complaint before MahaRERA and the District Consumer Commission for 
deficiency of service and compensation, entirely at your risk.

[Name(s), Flat No., Contact]`,
  },
  {
    id: 'chs',
    icon: '🏢',
    title: 'CHS / Condominium Governance',
    titleMr: 'CHS / कोंडोमिनियम',
    desc: 'Share certificate, bye-law violations, MC not following rules',
    subIssues: [
      'Share certificate not issued',
      'MC not following Model Bye-Laws',
      'Transfer of flat — MC refusing NOC',
      'Condominium not registered under MAOA',
    ],
    laws: [
      { ref: 'MCS Act 1960 § 70', detail: 'Every member must be issued a share certificate within 6 months of registration' },
      { ref: 'MCS Model Bye-Laws 2014', detail: 'MC must follow Model Bye-Laws in all decisions' },
      { ref: 'Maharashtra Apartment Ownership Act 1970', detail: 'Condominium registration, rights of apartment owners' },
      { ref: 'MCS Act 1960 § 22', detail: 'Transfer of membership — society cannot unreasonably refuse NOC' },
    ],
    authorities: [
      { name: 'District Deputy Registrar (DDR)', role: 'Non-issuance of share certificate, MC violation of bye-laws', portal: null, address: 'DDR Office, your district' },
      { name: 'Co-operative Court', role: 'Dispute over transfer NOC, share certificate, MC decisions', portal: null, address: 'Co-operative Court' },
      { name: 'Sub-Registrar (MAOA)', role: 'Condominium registration under MAOA 1970', portal: null, address: 'Sub-Registrar Office' },
    ],
    docs: [
      'Agreement for Sale',
      'Payment receipts showing all dues cleared',
      'Written requests sent to MC',
      'MC\'s responses (if any)',
      'Society registration certificate',
      'Previous MC resolutions (if available)',
    ],
    timeline: [
      { period: 'Week 1', action: 'Send written demand to MC for share certificate / NOC / bye-law compliance. Registered post.' },
      { period: 'Month 1', action: 'If no response, file complaint with DDR for violation of MCS Act and bye-laws.' },
      { period: 'Month 2', action: 'DDR can issue directions to MC to comply. If MC ignores, DDR can take action against individual committee members.' },
    ],
    steps: [
      { n: 1, action: 'Send Written Demand to MC', law: 'MCS Act § 70', detail: 'Write to Secretary demanding: share certificate (if not issued), transfer NOC (if being withheld), compliance with specific bye-law. Give 15-day deadline. Send by Registered Post AD.' },
      { n: 2, action: 'File Complaint with DDR', law: 'MCS Act', detail: 'If MC does not comply, file with District Deputy Registrar. DDR has power to direct MC to comply, impose fine, and initiate supersession proceedings under Section 78.' },
      { n: 3, action: 'File Dispute in Co-operative Court', law: 'MCS Act', detail: 'For disputes requiring adjudication (e.g. transfer NOC withheld unfairly), file in Co-operative Court. Court can declare the refusal illegal and direct issuance of NOC/certificate.' },
      { n: 4, action: 'Register as Condominium (if not done)', law: 'MAOA 1970', detail: 'If your building is not registered under MCS Act (as a CHS) and not registered under MAOA 1970 either, approach a lawyer to register it as a condominium. This gives legal status to your apartment owners\' association.' },
    ],
    draftLetter: (details) => `To,
The Secretary,
${details.society || '[Society Name]'} CHS Ltd.,
${details.city || '[City]'}

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Demand for Issuance of Share Certificate under Section 70 of 
the Maharashtra Co-operative Societies Act, 1960

Dear Secretary,

I, [Name], member of the above society holding Flat No. [___], 
hereby demand immediate issuance of my Share Certificate.

FACTS:
1. I purchased Flat No. [___] on [Date] for Rs. [Amount]
2. All dues to the society have been cleared — receipt attached
3. The society was registered on [Date] — [X] months/years have elapsed
4. Despite my request dated [Date], Share Certificate has not been issued

Under Section 70 of the MCS Act, 1960, the society is obligated to 
issue Share Certificate within 6 months of registration. The same is 
now overdue.

Please issue the Share Certificate within 15 days, failing which I 
shall file a complaint before the District Deputy Registrar under the 
MCS Act, and seek appropriate relief including damages for delay.

Yours faithfully,
[Name]
Flat No. [___]`,
  },
];

const URGENCY_LEVELS = [
  { id: 'critical', label: '🚨 Critical', desc: 'Builder actively constructing / registering sales on society land, Stop Work Order being violated, court order being flouted', color: '#e74c3c', bg: '#fef2f2', border: '#fca5a5' },
  { id: 'high',     label: '⚠️ High',     desc: 'Ongoing violation, legal proceedings started or needed urgently, significant financial risk', color: '#e67e22', bg: '#fff7ed', border: '#fed7aa' },
  { id: 'medium',   label: '📋 Medium',   desc: 'Violation exists, not yet escalating, want to take preventive / protective action', color: '#f39c12', bg: '#fffbf0', border: '#fde68a' },
  { id: 'low',      label: '💡 Low',      desc: 'Seeking information, future planning, or understanding rights before taking action', color: '#27ae60', bg: '#f0fdf4', border: '#bbf7d0' },
];

const TOTAL_STEPS = 5;

// ─── Utility ──────────────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 99, transition: 'all .3s',
            background: i + 1 < current ? 'rgba(0,200,150,0.4)'
              : i + 1 === current ? 'var(--teal)' : 'var(--border)',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
        Step {current} of {total}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function WizardPage() {
  const { navigate } = useContext(AppContext);
  const [step, setStep]               = useState(1);
  const [issueId, setIssueId]         = useState(null);
  const [subIssue, setSubIssue]       = useState(null);
  const [urgency, setUrgency]         = useState(null);
  const [details, setDetails]         = useState({ society: '', city: '', description: '', hasAdvocate: '' });
  const [result, setResult]           = useState(null);
  const [resultTab, setResultTab]     = useState('plan');
  const resultRef                     = useRef(null);

  const issue = ISSUES.find(i => i.id === issueId);
  const urgencyObj = URGENCY_LEVELS.find(u => u.id === urgency);

  const canNext = () => {
    if (step === 1) return !!issueId;
    if (step === 2) return !!subIssue;
    if (step === 3) return !!urgency;
    if (step === 4) return details.city.trim().length > 0;
    return true;
  };

  const goNext = () => {
    if (step === 4) buildResult();
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const buildResult = () => {
    setResult({
      issue,
      subIssue,
      urgency,
      urgencyObj,
      details,
    });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const restart = () => {
    setStep(1); setIssueId(null); setSubIssue(null); setUrgency(null);
    setDetails({ society: '', city: '', description: '', hasAdvocate: '' });
    setResult(null); setResultTab('plan');
  };

  const whatsappText = result ? encodeURIComponent(
    `🏠 GharHak Housing Rights Action Plan\n` +
    `Issue: ${result.issue.title}\n` +
    `Sub-issue: ${result.subIssue}\n` +
    `Urgency: ${result.urgencyObj.label}\n` +
    `City: ${result.details.city}\n\n` +
    `ACTION STEPS:\n` +
    result.issue.steps.map(s => `${s.n}. ${s.action} (${s.law})`).join('\n') +
    `\n\nFull plan: gharhak.in`
  ) : '';

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="section-title">Complaint <span>Wizard</span></h1>
          <p className="section-sub">5 questions — get a detailed, law-cited, authority-specific action plan with draft letter</p>
        </div>

        <div className="wizard-container">

          {/* ── STEP 1: Issue Category ────────────────────────────────────── */}
          {step === 1 && (
            <div className="wizard-card">
              <StepDots current={1} total={TOTAL_STEPS} />
              <div className="wizard-step-title">What is your issue?</div>
              <div className="wizard-step-sub">Select the category that best describes your problem</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                {ISSUES.map(iss => (
                  <button key={iss.id}
                    className={`option-btn ${issueId === iss.id ? 'selected' : ''}`}
                    onClick={() => { setIssueId(iss.id); setSubIssue(null); }}
                    style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 16px' }}>
                    <span style={{ fontSize: 20 }}>{iss.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{iss.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{iss.desc}</span>
                  </button>
                ))}
              </div>
              <div className="wizard-actions">
                <div />
                <button className="btn-next" onClick={goNext} disabled={!canNext()}>Next →</button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Sub-issue ─────────────────────────────────────────── */}
          {step === 2 && issue && (
            <div className="wizard-card">
              <StepDots current={2} total={TOTAL_STEPS} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 32 }}>{issue.icon}</span>
                <div>
                  <div className="wizard-step-title" style={{ marginBottom: 0 }}>{issue.title}</div>
                  <div className="wizard-step-sub" style={{ marginBottom: 0 }}>Which specific problem applies to you?</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {issue.subIssues.map((s, i) => (
                  <button key={i}
                    className={`option-btn ${subIssue === s ? 'selected' : ''}`}
                    onClick={() => setSubIssue(s)}
                    style={{ textAlign: 'left', padding: '14px 18px', fontSize: 14 }}>
                    {s}
                  </button>
                ))}
                <button
                  className={`option-btn ${subIssue === 'other' ? 'selected' : ''}`}
                  onClick={() => setSubIssue('other')}
                  style={{ textAlign: 'left', padding: '14px 18px', fontSize: 14, color: 'var(--text-muted)' }}>
                  Other / Multiple issues
                </button>
              </div>
              <div className="wizard-actions">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canNext()}>Next →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Urgency ───────────────────────────────────────────── */}
          {step === 3 && (
            <div className="wizard-card">
              <StepDots current={3} total={TOTAL_STEPS} />
              <div className="wizard-step-title">How urgent is this?</div>
              <div className="wizard-step-sub">This determines the priority of your action steps</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {URGENCY_LEVELS.map(u => (
                  <button key={u.id}
                    onClick={() => setUrgency(u.id)}
                    style={{
                      padding: '16px 20px', borderRadius: 12, border: `1.5px solid ${urgency === u.id ? u.color : 'var(--border)'}`,
                      background: urgency === u.id ? u.bg : 'var(--white)',
                      textAlign: 'left', cursor: 'pointer', transition: 'all .2s', fontFamily: 'var(--font)',
                    }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: urgency === u.id ? u.color : 'var(--text)', marginBottom: 4 }}>{u.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.desc}</div>
                  </button>
                ))}
              </div>
              <div className="wizard-actions">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canNext()}>Next →</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Details ───────────────────────────────────────────── */}
          {step === 4 && (
            <div className="wizard-card">
              <StepDots current={4} total={TOTAL_STEPS} />
              <div className="wizard-step-title">A few details</div>
              <div className="wizard-step-sub">Personalises your action plan and draft letter</div>
              <div className="form-field">
                <label className="form-label">Your city / area <span style={{ color: 'var(--red)' }}>*</span></label>
                <input className="form-input" placeholder="e.g. Pune, Wagholi, Thane, Mumbai, Nashik..."
                  value={details.city} onChange={e => setDetails(d => ({ ...d, city: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Society / Project name <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input className="form-input" placeholder="e.g. Solacia E1 E2 CHS, RMC Garden Phase 3..."
                  value={details.society} onChange={e => setDetails(d => ({ ...d, society: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Briefly describe the issue <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea className="form-input form-textarea" rows={3}
                  placeholder="e.g. Builder not giving conveyance since 2014. Society has 80 flats. Builder sold open parking. Stop work order issued but construction continues..."
                  value={details.description} onChange={e => setDetails(d => ({ ...d, description: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Do you have an advocate engaged?</label>
                <select className="form-input" value={details.hasAdvocate}
                  onChange={e => setDetails(d => ({ ...d, hasAdvocate: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="yes">Yes — advocate already engaged</option>
                  <option value="no">No — need to engage one</option>
                  <option value="looking">Looking / considering</option>
                </select>
              </div>
              <div className="wizard-actions">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canNext()}>Generate Action Plan →</button>
              </div>
            </div>
          )}

          {/* ── STEP 5: RESULTS ──────────────────────────────────────────── */}
          {step === 5 && result && (
            <div ref={resultRef}>

              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, var(--dark), var(--dark-2))',
                borderRadius: 20, padding: '32px 36px', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <span style={{ fontSize: 44 }}>{result.issue.icon}</span>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
                      Your Action Plan
                    </div>
                    <div style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                      {result.issue.title} · {result.details.city}
                    </div>
                  </div>
                </div>

                {/* Summary badges */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                    background: `${result.urgencyObj.color}22`, color: result.urgencyObj.color,
                    border: `1px solid ${result.urgencyObj.color}44` }}>
                    {result.urgencyObj.label} Urgency
                  </span>
                  <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                    {result.subIssue}
                  </span>
                  {result.details.society && (
                    <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                      {result.details.society}
                    </span>
                  )}
                </div>

                {/* Critical warning */}
                {urgency === 'critical' && (
                  <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(231,76,60,0.15)',
                    border: '1.5px solid rgba(231,76,60,0.4)', borderRadius: 12,
                    color: '#fca5a5', fontSize: 14, fontWeight: 600 }}>
                    🚨 Critical — Consider filing Writ Petition in Bombay High Court for urgent interim injunction.
                    Courts can grant relief within 24–48 hours. Do not delay.
                  </div>
                )}
              </div>

              {/* Result tabs */}
              <div className="wizard-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                  {[
                    { id: 'plan',       label: '🗺️ Action Plan' },
                    { id: 'timeline',   label: '📅 Timeline' },
                    { id: 'docs',       label: '📁 Documents' },
                    { id: 'laws',       label: '⚖️ Laws' },
                    { id: 'authorities',label: '🏛️ Authorities' },
                    { id: 'letter',     label: '📄 Draft Letter' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setResultTab(t.id)}
                      style={{
                        padding: '14px 18px', border: 'none', cursor: 'pointer',
                        background: resultTab === t.id ? 'var(--teal-light)' : 'transparent',
                        color: resultTab === t.id ? 'var(--teal)' : 'var(--text-muted)',
                        fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700,
                        borderBottom: resultTab === t.id ? '3px solid var(--teal)' : '3px solid transparent',
                        whiteSpace: 'nowrap', transition: 'all .2s',
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: 28 }}>

                  {/* ACTION PLAN TAB */}
                  {resultTab === 'plan' && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>
                        Step-by-Step Action Plan — {result.issue.steps.length} Steps
                      </div>
                      {result.issue.steps.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 24, position: 'relative' }}>
                          {i < result.issue.steps.length - 1 && (
                            <div style={{ position: 'absolute', left: 14, top: 30, width: 2,
                              height: 'calc(100% - 10px)', background: 'var(--border)' }} />
                          )}
                          <div style={{
                            width: 30, height: 30, background: 'var(--teal)', color: '#fff',
                            borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 800, flexShrink: 0, position: 'relative', zIndex: 1,
                          }}>{s.n}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 800, fontSize: 15 }}>{s.action}</span>
                              <span style={{
                                padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                background: 'var(--dark)', color: 'var(--teal)',
                              }}>{s.law}</span>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TIMELINE TAB */}
                  {resultTab === 'timeline' && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>
                        What to Do and When
                      </div>
                      {result.issue.timeline.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                          <div style={{
                            minWidth: 80, padding: '6px 12px', background: 'var(--dark)', color: 'var(--teal)',
                            borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: 'center',
                            height: 'fit-content', flexShrink: 0,
                          }}>{t.period}</div>
                          <div style={{
                            flex: 1, padding: '12px 16px', background: 'var(--bg)',
                            border: '1px solid var(--border)', borderRadius: 10,
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                          }}>{t.action}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DOCUMENTS TAB */}
                  {resultTab === 'docs' && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Documents to Collect Before Filing
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                        Collect all documents listed below before approaching any authority. Missing documents are the most common reason for complaint delays.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {result.issue.docs.map((doc, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '12px 16px', background: 'var(--bg)',
                            border: '1px solid var(--border)', borderRadius: 10,
                          }}>
                            <div style={{
                              width: 22, height: 22, background: 'var(--teal-light)',
                              borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'var(--teal)', fontSize: 11, fontWeight: 800, flexShrink: 0,
                            }}>{i + 1}</div>
                            <span style={{ fontSize: 14 }}>{doc}</span>
                          </div>
                        ))}
                      </div>
                      {result.details.hasAdvocate === 'no' && (
                        <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--teal-light)',
                          border: '1.5px solid rgba(0,200,150,0.3)', borderRadius: 12, fontSize: 13 }}>
                          💡 <strong>Tip:</strong> Collect all documents above before your first meeting with an advocate.
                          This saves consultation time and cost significantly.
                        </div>
                      )}
                    </div>
                  )}

                  {/* LAWS TAB */}
                  {resultTab === 'laws' && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>
                        Laws That Apply to Your Case
                      </div>
                      {result.issue.laws.map((law, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 0',
                          borderBottom: i < result.issue.laws.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <div style={{
                            padding: '6px 14px', background: 'var(--dark)', color: 'var(--teal)',
                            borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                            height: 'fit-content', flexShrink: 0,
                          }}>{law.ref}</div>
                          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, paddingTop: 4 }}>
                            {law.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AUTHORITIES TAB */}
                  {resultTab === 'authorities' && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>
                        Where to File Your Complaint
                      </div>
                      {result.issue.authorities.map((auth, i) => (
                        <div key={i} style={{
                          padding: '20px', background: i === 0 ? 'var(--teal-light)' : 'var(--bg)',
                          border: `1.5px solid ${i === 0 ? 'rgba(0,200,150,0.35)' : 'var(--border)'}`,
                          borderRadius: 14, marginBottom: 12,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                {i === 0 && <span style={{ padding: '2px 10px', background: 'var(--teal)', color: '#fff',
                                  borderRadius: 999, fontSize: 10, fontWeight: 700 }}>PRIMARY</span>}
                                <span style={{ fontWeight: 800, fontSize: 15 }}>{auth.name}</span>
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{auth.role}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {auth.address}</div>
                            </div>
                            {auth.portal && (
                              <a href={auth.portal} target="_blank" rel="noopener noreferrer"
                                style={{
                                  padding: '8px 16px', background: 'var(--teal)', color: '#fff',
                                  borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none',
                                  whiteSpace: 'nowrap', flexShrink: 0,
                                }}>
                                🔗 {auth.portalLabel || 'File Online'}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DRAFT LETTER TAB */}
                  {resultTab === 'letter' && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Draft Complaint Letter — Ready to Use
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                        Fill in the [bracketed] fields with your actual details. Have this reviewed by an advocate before sending.
                      </p>
                      <pre style={{
                        background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12,
                        padding: '20px 24px', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit', maxHeight: 480, overflowY: 'auto',
                      }}>
                        {result.issue.draftLetter(result.details)}
                      </pre>
                      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                        <button className="btn-primary"
                          onClick={() => navigator.clipboard.writeText(result.issue.draftLetter(result.details)).then(() => alert('Copied to clipboard!'))}>
                          📋 Copy Letter
                        </button>
                        <button onClick={() => navigate('docs')}
                          style={{ padding: '12px 20px', background: 'var(--dark)', color: 'var(--teal)',
                            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            fontFamily: 'var(--font)' }}>
                          📄 Get Full Formatted Document →
                        </button>
                      </div>
                      <div style={{ marginTop: 12, padding: '10px 16px', background: '#fffbf0',
                        border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                        ⚠️ This draft is a starting point only. Have it reviewed and customised by a qualified advocate before serving on any party.
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                <button className="btn-primary" onClick={restart}>↺ Start New Complaint</button>
                <button onClick={() => window.print()}
                  style={{ padding: '12px 20px', background: 'var(--white)', color: 'var(--text)',
                    border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'var(--font)' }}>
                  🖨️ Print / Save PDF
                </button>
                <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '12px 20px', background: '#25d366', color: '#fff',
                    borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  📲 Share on WhatsApp
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
