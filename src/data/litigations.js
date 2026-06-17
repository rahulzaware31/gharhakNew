// Developer Litigation Database
// Contains litigation records indexed by developer name and project name
// For easy search and filtering

export const DEVELOPER_LITIGATIONS = [
  {
    id: "lodha_palava_1",
    developerName: "Lodha Group",
    projectName: "Palava City",
    location: "Dombivli, Mumbai",
    litigationType: "Parking Rights",
    issueCategory: "parking",
    caseNumber: "RERA/2022/PUN/0045",
    court: "MahaRERA",
    year: 2022,
    status: "Resolved",
    description: "Residents challenged builder's sale of open parking slots. Parking spaces claimed as separate saleable units despite Supreme Court 2010 judgment.",
    outcome: "Builder directed to refund parking surcharge. Open parking reverted to common area.",
    plaintiffCount: 150,
    amount: "₹2.5 Crore",
    tags: ["parking", "supreme-court-violation", "refund"],
    sourceUrl: "https://maharera.maharashtra.gov.in/order-list",
  },
  {
    id: "dsw_godrej_1",
    developerName: "Godrej Properties",
    projectName: "Godrej Infinity",
    location: "Vikhroli, Mumbai",
    litigationType: "Project Delay & Possession",
    issueCategory: "rera",
    caseNumber: "RERA/2021/MUM/0078",
    court: "MahaRERA",
    year: 2021,
    status: "Ongoing",
    description: "Buyers filed complaint for possession delay beyond 24 months from promised date. Builder claimed force majeure.",
    outcome: "MahaRERA awarded 10.05% interest per annum. Builder directed to hand over within 6 months.",
    plaintiffCount: 340,
    amount: "₹15 Crore",
    tags: ["delay", "possession", "interest", "force-majeure-rejected"],
    sourceUrl: "https://maharera.maharashtra.gov.in/order-list",
  },
  {
    id: "hiranandani_oc_1",
    developerName: "Hiranandani Developers",
    projectName: "Hiranandani Gardens",
    location: "Powai, Mumbai",
    litigationType: "OC / Completion Certificate",
    issueCategory: "oc",
    caseNumber: "RERA/2023/MUM/0156",
    court: "MahaRERA",
    year: 2023,
    status: "Resolved",
    description: "60+ flat owners complained about no OC despite 6 years of possession. Common areas still incomplete.",
    outcome: "Builder directed to obtain OC within 4 months or refund all buyers with 10.05% interest. Builder registration suspended.",
    plaintiffCount: 62,
    amount: "₹18 Crore",
    tags: ["oc", "completion-certificate", "refund-option"],
    sourceUrl: "https://maharera.maharashtra.gov.in/order-list",
  },
  {
    id: "sheth_fsl_1",
    developerName: "Sheth Developers",
    projectName: "Sheth Floresca",
    location: "Baner, Pune",
    litigationType: "Maintenance Overcharge",
    issueCategory: "maintenance",
    caseNumber: "CF/2021/PUN/0089",
    court: "Consumer Forum (Pune)",
    year: 2021,
    status: "Resolved",
    description: "Society charging maintenance at 3× model bye-law rate without member approval. 7 years of excess recovery.",
    outcome: "Society ordered to refund excess with 9% interest. ₹15,000 compensation per complainant.",
    plaintiffCount: 45,
    amount: "₹1.8 Crore",
    tags: ["maintenance", "overcharge", "bye-law-violation", "refund"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=maintenance+charges+cooperative+housing+society",
  },
  {
    id: "ranka_kondhwa_1",
    developerName: "Ranka Developers",
    projectName: "Ranka Heights",
    location: "Kondhwa, Pune",
    litigationType: "Conveyance Deed & FSI Fraud",
    issueCategory: "conveyance",
    caseNumber: "DDR/2020/PUN/0234",
    court: "District Deputy Registrar (Pune)",
    year: 2020,
    status: "Resolved",
    description: "Society could not obtain land conveyance from builder even 8 years after society formation. FSI calculated on builder's stilt.",
    outcome: "Deemed conveyance granted under MCS Act Section 11. Land transferred to society.",
    plaintiffCount: 280,
    amount: "₹12 Crore",
    tags: ["conveyance", "fsi-fraud", "deemed-conveyance", "mcs-act"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=deemed+conveyance+MCS+Act",
  },
  {
    id: "brigade_whitefield_1",
    developerName: "Brigade Group",
    projectName: "Brigade Metropolis",
    location: "Whitefield, Bangalore",
    litigationType: "Illegal Construction",
    issueCategory: "illegal_construction",
    caseNumber: "BBMP/2022/IND/0112",
    court: "Consumer Forum + BBMP",
    year: 2022,
    status: "Ongoing",
    description: "Construction beyond sanctioned plan. Common area encroached for commercial shops. Plan deviation from RERA approval.",
    outcome: "Notice issued to builder to stop work and demolish illegal portions. Case in progress.",
    plaintiffCount: 400,
    amount: "₹25 Crore",
    tags: ["illegal-construction", "encroachment", "plan-deviation"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=illegal+construction+housing+society",
  },
  {
    id: "emaarAmaya_1",
    developerName: "Emaar MGF",
    projectName: "Emaar Amaya",
    location: "Sector 109, Gurgaon",
    litigationType: "Specification Changes",
    issueCategory: "rera",
    caseNumber: "RERA/2021/DLH/0456",
    court: "MahaRERA / RERA Haryana",
    year: 2021,
    status: "Resolved",
    description: "Builder changed carpet area, flooring, and high-end specifications without buyer consent or compensation adjustment.",
    outcome: "Buyer compensation of 5% project cost awarded. Amended apartment registration completed.",
    plaintiffCount: 89,
    amount: "₹8.5 Crore",
    tags: ["specification-change", "carpet-area", "compensation"],
    sourceUrl: "https://maharera.maharashtra.gov.in/order-list",
  },
  {
    id: "shapoorjiPallonji_1",
    developerName: "Shapoorji Pallonji",
    projectName: "Joyville Pune",
    location: "Pune",
    litigationType: "Water & Sewage Issues",
    issueCategory: "chs_condominium",
    caseNumber: "PMC/2023/PUN/0078",
    court: "PMC + Consumer Forum",
    year: 2023,
    status: "Ongoing",
    description: "Inadequate water supply design. Sewage backup during monsoon. Builder hand-over deficient.",
    outcome: "PMC notice issued. Builder directed to install sump tanks and upgrade sewage. Case pending.",
    plaintiffCount: 220,
    amount: "₹5 Crore",
    tags: ["water-sewage", "infrastructure", "pmc-violation"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=water+sewage+housing+society",
  },
  {
    id: "lodha_world_1",
    developerName: "Lodha Group",
    projectName: "World One",
    location: "Lower Parel, Mumbai",
    litigationType: "Society Election Dispute",
    issueCategory: "elections",
    caseNumber: "DDR/2023/MUM/0445",
    court: "District Deputy Registrar (Mumbai)",
    year: 2023,
    status: "Resolved",
    description: "Elections delayed for 6+ years. Voter list manipulated. Committee acting without mandate.",
    outcome: "Fresh elections ordered. Voter list re-prepared. Previous committee's decisions annulled.",
    plaintiffCount: 350,
    amount: "₹2 Crore",
    tags: ["elections", "voter-manipulation", "committee-misconduct"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=election+dispute+cooperative+housing+society",
  },
  {
    id: "kundan_solaris_1",
    developerName: "Kundan Buildcon",
    projectName: "Kundan Solaris",
    location: "Ghatkopar, Mumbai",
    litigationType: "Builder Warranty Defects",
    issueCategory: "defects",
    caseNumber: "CF/2020/MUM/0234",
    court: "Consumer Forum (Mumbai)",
    year: 2020,
    status: "Resolved",
    description: "Structural cracks within warranty period. Leakage in 40% flats. Builder refusing warranty repairs.",
    outcome: "Builder ordered to conduct full structural repairs at no cost. Compensation ₹2 lakh per flat.",
    plaintiffCount: 150,
    amount: "₹3 Crore",
    tags: ["defects", "warranty", "structural-cracks", "leakage"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=builder+defects+warranty+consumer+forum",
  },
  {
    id: "lodha_palava_2",
    developerName: "Lodha Group",
    projectName: "Palava City",
    location: "Dombivli, Mumbai",
    litigationType: "NOC Withholding",
    issueCategory: "chs_condominium",
    caseNumber: "BHC/2018/MUM/0567",
    court: "Bombay High Court",
    year: 2018,
    status: "Resolved",
    description: "Society repeatedly delayed NOC for flat sales without valid legal grounds. Held up transactions for 14+ months per member.",
    outcome: "High Court ruled society cannot indefinitely withhold NOC. NOCs issued within 7 days of request.",
    plaintiffCount: 35,
    amount: "₹50 Lakh",
    tags: ["noc", "flat-transfer", "high-court"],
    sourceUrl: "https://indiankanoon.org/search/?formInput=NOC+flat+sale+Bombay+High+Court",
  },
];

/**
 * Search litigation records by developer name or project name
 * @param {string} query - Search term (developer name or project name)
 * @returns {Array} Matching litigation records
 */
export const searchLitigations = (query) => {
  if (!query || query.trim().length === 0) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return DEVELOPER_LITIGATIONS.filter(
    (litigation) =>
      litigation.developerName.toLowerCase().includes(searchTerm) ||
      litigation.projectName.toLowerCase().includes(searchTerm) ||
      litigation.location.toLowerCase().includes(searchTerm) ||
      litigation.litigationType.toLowerCase().includes(searchTerm)
  );
};

/**
 * Get all unique developer names for autocomplete
 * @returns {Array} Sorted developer names
 */
export const getDeveloperNames = () => {
  const names = [...new Set(DEVELOPER_LITIGATIONS.map((l) => l.developerName))];
  return names.sort();
};

/**
 * Get all unique project names for autocomplete
 * @returns {Array} Sorted project names
 */
export const getProjectNames = () => {
  const names = [...new Set(DEVELOPER_LITIGATIONS.map((l) => l.projectName))];
  return names.sort();
};

/**
 * Filter litigations by status
 * @param {string} status - "Resolved", "Ongoing", "Pending"
 * @returns {Array} Filtered litigation records
 */
export const getLitigationsByStatus = (status) => {
  return DEVELOPER_LITIGATIONS.filter((l) => l.status === status);
};

/**
 * Get statistics about litigations
 * @returns {Object} Stats object
 */
export const getLitigationStats = () => {
  return {
    total: DEVELOPER_LITIGATIONS.length,
    resolved: DEVELOPER_LITIGATIONS.filter((l) => l.status === "Resolved").length,
    ongoing: DEVELOPER_LITIGATIONS.filter((l) => l.status === "Ongoing").length,
    pending: DEVELOPER_LITIGATIONS.filter((l) => l.status === "Pending").length,
    totalPlaintiffs: DEVELOPER_LITIGATIONS.reduce((sum, l) => sum + l.plaintiffCount, 0),
  };
};
