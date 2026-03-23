export const ISSUE_CATEGORIES = [
  {
    id: "conveyance",
    icon: "🏛️",
    title: "Conveyance Deed & FSI Fraud",
    titleMr: "हस्तांतरण दस्तऐवज व FSI फसवणूक",
    description: "Builder not conveying land, FSI misuse, illegal layout sanctions",
    color: "#e74c3c",
    laws: ["MCS Act Section 11", "MOFA 1963", "UDCPR Regulation 2.2.3", "MRTP Act Section 45"],
    authorities: ["Sub-Registrar", "District Deputy Registrar", "RERA", "PMRDA/Municipal Corporation"],
    commonIssues: [
      "Builder refusing to convey land to society",
      "FSI calculated on society land",
      "Illegal revised layout sanctions",
      "Amalgamation fraud in land records",
    ],
  },
  {
    id: "maintenance",
    icon: "🔧",
    title: "Maintenance Disputes & Levy",
    titleMr: "देखभाल वाद व आकारणी",
    description: "Excessive maintenance charges, non-transparent billing, illegal levies",
    color: "#e67e22",
    laws: ["MCS Act Section 79A", "MCS Bye-Laws 2014", "Model Bye-Laws"],
    authorities: ["District Deputy Registrar", "Co-operative Court", "MCS Tribunal"],
    commonIssues: [
      "Maintenance charges not matching bye-laws",
      "No audited accounts shared",
      "Illegal special levies without AGM approval",
      "Non-issuance of receipts",
    ],
  },
  {
    id: "parking",
    icon: "🚗",
    title: "Parking Rights",
    titleMr: "पार्किंग हक्क",
    description: "Illegal parking sale, open parking encroachment, stilts misuse",
    color: "#f39c12",
    laws: ["Supreme Court Order (2010)", "MOFA 1963", "Municipal Bye-Laws", "MahaRERA Regulations"],
    authorities: ["MahaRERA", "Municipal Corporation", "Local Police", "Consumer Forum"],
    commonIssues: [
      "Builder selling open parking slots (illegal per SC)",
      "Covered parking not allotted as per agreement",
      "Stilt parking converted to shops",
      "Visitor parking encroached by builder",
    ],
  },
  {
    id: "oc",
    icon: "📋",
    title: "OC / Completion Certificate",
    titleMr: "भोगवटा प्रमाणपत्र (OC)",
    description: "No OC from builder, partial OC, illegal occupation",
    color: "#27ae60",
    laws: ["MOFA 1963 Section 3", "MahaRERA Act 2016", "MRTP Act Section 45", "Maharashtra Buildings Rules"],
    authorities: ["MahaRERA", "Municipal Corporation / PMRDA", "District Consumer Forum"],
    commonIssues: [
      "Builder not obtaining full OC",
      "Residents occupying without OC (builder's fault)",
      "Partial OC with pending floors",
      "OC conditions not met but builder claims OC",
    ],
  },
  {
    id: "rera",
    icon: "⚖️",
    title: "RERA Complaints",
    titleMr: "RERA तक्रारी",
    description: "Project delays, specification changes, registration violations",
    color: "#2980b9",
    laws: ["Real Estate (Regulation & Development) Act 2016", "MahaRERA Rules 2017"],
    authorities: ["MahaRERA Adjudicating Officer", "MahaRERA Appellate Tribunal"],
    commonIssues: [
      "Project delayed beyond registered completion date",
      "Specifications changed without consent",
      "Builder selling without RERA registration",
      "No quarterly updates on RERA portal",
    ],
  },
  {
    id: "defects",
    icon: "🏚️",
    title: "Builder Defects & Warranty",
    titleMr: "बांधकाम दोष व वॉरंटी",
    description: "Structural defects, leakage, poor construction quality",
    color: "#8e44ad",
    laws: ["MOFA 1963", "MahaRERA Act Section 14", "Consumer Protection Act 2019"],
    authorities: ["MahaRERA", "District Consumer Forum", "State Consumer Commission"],
    commonIssues: [
      "Leakage within 5-year warranty period",
      "Structural cracks and defects",
      "Inferior materials used vs agreement",
      "Builder refusing warranty repairs",
    ],
  },
  {
    id: "illegal_construction",
    icon: "🚧",
    title: "Illegal Construction by Builder",
    titleMr: "बेकायदेशीर बांधकाम",
    description: "Unauthorized construction, plan deviations, encroachment on common areas",
    color: "#c0392b",
    laws: ["MRTP Act 1966 Section 51", "UDCPR 2020", "MCS Act", "Municipal Corporation Act"],
    authorities: ["PMRDA / Municipal Corporation", "Town Planning Department", "High Court (Writ)"],
    commonIssues: [
      "Construction beyond sanctioned plan",
      "Common area encroachment by builder",
      "Unauthorized additional floors",
      "Deviation from RERA-registered plans",
    ],
  },
  {
    id: "elections",
    icon: "🗳️",
    title: "Society Election Disputes",
    titleMr: "सोसायटी निवडणूक वाद",
    description: "Rigged elections, committee not formed, delayed AGM",
    color: "#16a085",
    laws: ["MCS Act Section 73CB", "MCS Election Rules 2014", "Model Bye-Laws"],
    authorities: ["District Deputy Registrar", "Co-operative Election Authority", "Co-operative Court"],
    commonIssues: [
      "Election not conducted for years",
      "Voter list manipulation",
      "AGM not held annually",
      "Committee acting without mandate",
    ],
  },
  {
    id: "chs_condominium",
    icon: "🏢",
    title: "CHS & Condominium Rights",
    titleMr: "CHS व कोंडोमिनियम हक्क",
    description: "Difference between CHS and Condominium, governance, rights",
    color: "#2c3e50",
    laws: ["MCS Act 1960", "Maharashtra Apartment Ownership Act 1970", "Model Bye-Laws"],
    authorities: ["District Deputy Registrar", "Co-operative Court", "Civil Court"],
    commonIssues: [
      "Understanding CHS vs Condominium governance",
      "Share certificate not issued",
      "Managing committee not following bye-laws",
      "Condominium not registered under MAOA",
    ],
  },
];

export const COMPLAINT_STEPS = {
  conveyance: [
    { step: 1, action: "Collect Documents", detail: "Gather: Sale Deed, Index II, 7/12 extract, society registration certificate, any conveyance correspondence" },
    { step: 2, action: "Society Resolution", detail: "Pass MC resolution authorizing filing of deemed conveyance application" },
    { step: 3, action: "Apply to District Deputy Registrar", detail: "File deemed conveyance application under Section 11 MCS Act with all documents" },
    { step: 4, action: "RERA Complaint", detail: "Simultaneously file complaint on maharerait.maharashtra.gov.in for non-conveyance" },
    { step: 5, action: "Follow Up", detail: "If DDR doesn't act in 60 days, file Writ Petition in Bombay High Court for mandamus" },
  ],
  parking: [
    { step: 1, action: "Document the Violation", detail: "Photograph encroachment, collect your allotment letter, check sale agreement parking clause" },
    { step: 2, action: "Legal Notice", detail: "Send registered legal notice to builder citing Supreme Court 2010 judgment (open parking cannot be sold)" },
    { step: 3, action: "RERA Complaint", detail: "File on maharerait.maharashtra.gov.in — attach sale agreement and parking allotment" },
    { step: 4, action: "Consumer Forum", detail: "File complaint in District Consumer Forum for deficiency of service" },
    { step: 5, action: "Police Complaint", detail: "If criminal trespass — file complaint at local police station under IPC Section 447" },
  ],
  maintenance: [
    { step: 1, action: "Demand Accounts", detail: "Send written request to secretary for audited accounts, maintenance calculation sheet" },
    { step: 2, action: "Check Bye-Laws", detail: "Compare charges against Model Bye-Laws — maintenance must follow prescribed formula" },
    { step: 3, action: "File Complaint with DDR", detail: "File complaint with District Deputy Registrar for audit and inspection" },
    { step: 4, action: "Co-operative Court", detail: "If DDR doesn't act, file before Co-operative Court under MCS Act" },
    { step: 5, action: "Withhold Excess", detail: "Pay undisputed amount; withold excess with written justification (do not default entirely)" },
  ],
};

export const DOCUMENT_TEMPLATES = [
  // ── General / Legal Notice ──────────────────────────────────────────────
  { id: "legal_notice_builder", title: "Legal Notice to Builder", titleMr: "बिल्डरला कायदेशीर नोटीस", category: "conveyance", authority: "Legal Notice", fields: ["societyName", "builderName", "address", "issueDescription", "demand"] },

  // ── PMC / Municipal Corporation ─────────────────────────────────────────
  { id: "pmc_illegal_construction", title: "PMC Complaint: Illegal Construction", titleMr: "PMC तक्रार: बेकायदेशीर बांधकाम", category: "illegal_construction", authority: "PMC", fields: ["complainantName", "address", "surveyNo", "builderName", "incidentDescription", "demand"] },
  { id: "pmc_no_oc", title: "PMC Complaint: No Occupancy Certificate", titleMr: "PMC तक्रार: भोगवटा प्रमाणपत्र नाही", category: "oc", authority: "PMC", fields: ["complainantName", "address", "projectName", "builderName", "dateOfPossession", "demand"] },
  { id: "pmc_water_sewage", title: "PMC Complaint: Water / Sewage Issue", titleMr: "PMC तक्रार: पाणी / सांडपाणी समस्या", category: "chs_condominium", authority: "PMC", fields: ["complainantName", "address", "societyName", "issueDescription", "demand"] },

  // ── DDR — District Deputy Registrar (Co-op) ─────────────────────────────
  { id: "ddr_maintenance_audit", title: "DDR Complaint: Maintenance & Audit", titleMr: "DDR तक्रार: देखभाल व लेखापरीक्षण", category: "maintenance", authority: "DDR", fields: ["complainantName", "societyName", "regNo", "address", "issueDescription", "demand"] },
  { id: "ddr_election_dispute", title: "DDR Complaint: Election Dispute", titleMr: "DDR तक्रार: निवडणूक वाद", category: "elections", authority: "DDR", fields: ["complainantName", "societyName", "regNo", "electionDate", "issueDescription", "reliefSought"] },
  { id: "ddr_committee_misconduct", title: "DDR Complaint: Committee Misconduct", titleMr: "DDR तक्रार: समिती गैरवर्तन", category: "chs_condominium", authority: "DDR", fields: ["complainantName", "societyName", "regNo", "respondentName", "issueDescription", "reliefSought"] },
  { id: "deemed_conveyance", title: "Deemed Conveyance Application (DDR)", titleMr: "अभिहस्तांतरण अर्ज (DDR)", category: "conveyance", authority: "DDR", fields: ["societyName", "regNo", "plotDetails", "builderName", "dateOfPossession"] },

  // ── DR / Sub-Registrar ──────────────────────────────────────────────────
  { id: "rti_application", title: "RTI Application (Municipal / PMRDA)", titleMr: "माहिती अधिकार अर्ज", category: "illegal_construction", authority: "RTI", fields: ["applicantName", "address", "informationSought", "authorityName"] },
  { id: "dr_rti_property", title: "RTI to Sub-Registrar: Property Records", titleMr: "उप-निबंधक: मालमत्ता नोंदी RTI अर्ज", category: "conveyance", authority: "RTI", fields: ["applicantName", "address", "surveyNo", "documentNo", "registrationDate", "informationSought"] },

  // ── MahaRERA ────────────────────────────────────────────────────────────
  { id: "rera_complaint", title: "MahaRERA Complaint Draft", titleMr: "MahaRERA तक्रार मसुदा", category: "rera", authority: "MahaRERA", fields: ["complainantName", "projectName", "reraRegNo", "issueDescription", "reliefSought"] },

  // ── Consumer Forum ──────────────────────────────────────────────────────
  { id: "consumer_forum_builder", title: "Consumer Forum Complaint: Builder", titleMr: "ग्राहक न्यायालय तक्रार: बिल्डर", category: "defects", authority: "Consumer Forum", fields: ["complainantName", "address", "builderName", "projectName", "purchaseDate", "amountPaid", "issueDescription", "reliefSought"] },
  { id: "consumer_forum_society", title: "Consumer Forum Complaint: Society", titleMr: "ग्राहक न्यायालय तक्रार: सोसायटी", category: "maintenance", authority: "Consumer Forum", fields: ["complainantName", "address", "societyName", "regNo", "issueDescription", "amountPaid", "reliefSought"] },

  // ── Co-operative Court ──────────────────────────────────────────────────
  { id: "coop_court_petition", title: "Co-operative Court Petition", titleMr: "सहकारी न्यायालय याचिका", category: "chs_condominium", authority: "Co-op Court", fields: ["complainantName", "address", "societyName", "regNo", "respondentName", "issueDescription", "reliefSought"] },

  // ── Society Internal ────────────────────────────────────────────────────
  { id: "mc_resolution", title: "Managing Committee Resolution", titleMr: "व्यवस्थापन समिती ठराव", category: "chs_condominium", authority: "Society", fields: ["societyName", "regNo", "resolutionSubject", "resolutionText"] },

  // ── Police ──────────────────────────────────────────────────────────────
  { id: "police_complaint", title: "Police Complaint (Illegal Construction)", titleMr: "पोलीस तक्रार", category: "illegal_construction", authority: "Police", fields: ["complainantName", "address", "accusedName", "incidentDescription", "witnesses"] },
];
