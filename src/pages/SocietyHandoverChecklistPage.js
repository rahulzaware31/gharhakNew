import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

const STORAGE_KEY = 'gharhak_handover_v1';

const CHECKLIST = [
  // ── Category 1: Legal Documents ─────────────────────────────────────────
  {
    id: 'society_reg_cert',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'Critical',
    title: 'Society Registration Certificate received from builder',
    why: 'Without the registration certificate, the society has no legal identity. All management, contracts, and bank accounts require this document.',
    how: 'The registration certificate is issued by the District Deputy Registrar (Co-operative Societies). Ensure it bears the official seal and your society\'s correct name, registration number, and registered address.',
  },
  {
    id: 'bye_laws',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'Certified copy of Model Bye-Laws / registered Bye-Laws obtained',
    why: 'Bye-laws govern how the society is managed — elections, meetings, charges, maintenance. Without them, the managing committee has no clear legal basis to act.',
    how: 'The registered bye-laws (either Model Bye-Laws or the society\'s own approved bye-laws) must be obtained from the DDR office or from the builder if they facilitated registration.',
  },
  {
    id: 'conveyance_deed',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'Critical',
    title: 'Conveyance Deed executed — land registered in society\'s name',
    why: 'Without conveyance, the builder legally owns the land your building stands on. They can mortgage, sell, or build further on it. This is one of the biggest risks for housing societies.',
    how: 'The conveyance deed must be registered at the Sub-Registrar office in the society\'s name. Ask the builder for the registered conveyance deed with document number. If not done within 3 years of OC, apply for Deemed Conveyance to the DDR.',
  },
  {
    id: 'oc_society',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'Critical',
    title: 'Occupancy Certificate (OC) copy handed over to society',
    why: 'The society needs the OC for municipal water connection, property tax, and defending against demolition notices. Builder must hand this over at society formation.',
    how: 'Demand OC from the builder. Check it is issued by the Municipal Authority / PMRDA, covers all wings and floors of your project, and is the original or certified copy.',
  },
  {
    id: 'approved_plans',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'Sanctioned building plans — all floor layouts, sections, and elevations handed over',
    why: 'Sanctioned plans are the legal blueprint of your building. Without them, the society cannot prove what was approved, challenge illegal deviations, obtain further approvals, or defend against municipal demolition notices. Every floor change, utility shaft, and staircase position is legally fixed by these plans.',
    how: 'Demand Municipal Corporation / PMRDA-stamped copies of: (1) Site plan showing plot boundary, setbacks, and road access, (2) Floor plans for every floor of every wing including basement, stilt, podium, terrace, and refuge floor, (3) Elevation drawings (all four sides), (4) Section drawings (longitudinal and cross-section), (5) Amenity and clubhouse floor layouts, (6) Landscape and open space layout, (7) Typical floor plan if applicable. Each plan sheet must bear the municipal stamp, approval number, and architect\'s seal. Compare actual construction against plans — deviations must be justified or an IOD/CC amendment must have been obtained.',
  },
  {
    id: 'parking_sanctioned_layout',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'Critical',
    title: 'Sanctioned parking layout — stilt, basement, and open parking areas demarcated',
    why: 'Parking disputes are one of the most common post-handover flashpoints. Builders frequently sell open parking spaces separately, which the Supreme Court has ruled is illegal (Nahalchand Laloochand, 2010). The sanctioned parking layout is the definitive legal document establishing which parking is common area and which is paid/covered parking.',
    how: 'Obtain the Municipal Corporation-approved parking layout plan separately. Verify: (a) Total sanctioned parking count vs. what was sold in agreements, (b) Stilt/covered parking marked as attached to specific flats, (c) Open parking areas — these must be common area and cannot be sold per SC ruling, (d) Visitor parking locations, (e) Parking for disabled persons (mandatory under accessibility norms). Cross-check with RERA parking disclosures on the MahaRERA portal. Any mismatch between sold parking and the sanctioned layout is a RERA violation.',
  },
  {
    id: 'title_docs_society',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'Title documents chain — all original title papers handed over',
    why: 'The society needs a complete chain of title to defend ownership, apply for government schemes, and prove land rights in any future dispute.',
    how: 'Builder must hand over the original or certified copies of the title documents chain for the land on which the society stands. This includes the original sale deed from the landowner.',
  },
  {
    id: 'na_order_society',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'NA (Non-Agricultural) order and all government clearances obtained',
    why: 'These documents prove the land use is legally permitted. Essential for defending against any government action or encroachment claims.',
    how: 'Demand NA order, environmental clearance, fire NOC, airport authority NOC (if applicable), and any other statutory approvals from the builder.',
  },
  {
    id: 'completion_certificate',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'Critical',
    title: 'Building Completion Certificate (BCC) obtained from Municipal Authority',
    why: 'The BCC confirms the building is structurally complete as per approved plans and safe for occupation. Without it, the structure is technically incomplete in municipal records — residents face demolition notices and cannot claim building insurance.',
    how: 'Request a certified copy of the BCC issued by the Municipal Corporation or PMRDA. Ensure it covers all wings, phases, and floors of the project. BCC is separate from OC and must have been issued before OC was granted. Verify the document number and issuing authority signature.',
  },
  {
    id: 'encumbrance_certificate',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'Critical',
    title: 'Encumbrance Certificate (EC) — land free of all mortgages and charges confirmed',
    why: 'If the builder has mortgaged the land or building to a bank as security for a construction loan, that mortgage legally supersedes the residents\' rights. An EC reveals all registered encumbrances — mortgages, loans, and charges — since the property\'s recorded history.',
    how: 'Obtain the EC from the Sub-Registrar office for the full period from the land\'s recorded history to the present date. Any bank mortgage must be formally discharged (Memorandum of Satisfaction filed) before handover. If a bank mortgage exists, insist on a No Objection Certificate (NOC) from the lending bank confirming full discharge.',
  },
  {
    id: 'development_agreement',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'Development Agreement and Power of Attorney between landowner and builder obtained',
    why: 'This document governs the builder\'s rights over the land. Without it, the society cannot verify the builder had legitimate authority to construct and sell. If the DA was cancelled or expired, the entire project title could be in dispute.',
    how: 'Request a certified copy of the registered Development Agreement (DA) and the associated Power of Attorney (POA). Verify the DA is registered at the Sub-Registrar office, is still valid, and was not subsequently cancelled or challenged in court. Check whether any landowner compensation claims remain outstanding.',
  },
  {
    id: 'no_dues_builder',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'No-Dues Certificate from builder — all pre-handover liabilities cleared',
    why: 'Builders may have unpaid dues to contractors, material suppliers, and utility companies at the time of handover. After handover, such creditors may pursue the society. A No-Dues Certificate transfers that liability clearly back to the builder.',
    how: 'Ask the builder to provide a sworn affidavit or No-Dues Certificate confirming all contractor bills, vendor dues, statutory dues, utility charges, and labour welfare contributions up to the handover date are fully paid. Retain this on society records — it is your protection against pre-handover claims.',
  },
  {
    id: 'defect_liability_bond',
    cat: 'Legal Documents',
    catIcon: '📜',
    risk: 'High',
    title: 'Defect Liability undertaking from builder (RERA Section 14 — 5-year structural warranty)',
    why: 'Under RERA Section 14(3), builders are legally responsible for repairing structural defects reported within 5 years from the date of possession. A written undertaking at handover ensures the builder cannot later deny this obligation or claim the defect pre-existed handover.',
    how: 'Insist on a signed undertaking from the builder acknowledging their 5-year structural defect liability under RERA Section 14(3). During the handover inspection, photograph and document all visible defects and list them in the undertaking. File a MahaRERA complaint for any structural defect within 5 years of the possession date.',
  },

  // ── Category 2: Financial Handover ─────────────────────────────────────
  {
    id: 'corpus_transfer',
    cat: 'Financial Handover',
    catIcon: '💰',
    risk: 'Critical',
    title: 'Corpus fund / sinking fund fully transferred to society bank account',
    why: 'Builder collects corpus fund from all flat buyers at possession. This money belongs to the society. Without transfer, the society has no reserve for emergencies.',
    how: 'Get a statement from the builder of all corpus fund collected (flat-wise amounts). Verify the total against the society bank account credit. Get a builder certificate confirming full transfer.',
  },
  {
    id: 'advance_maintenance',
    cat: 'Financial Handover',
    catIcon: '💰',
    risk: 'Critical',
    title: 'All advance maintenance charges collected transferred to society',
    why: 'Builders often collect 1–2 years of advance maintenance from buyers. Until the society takes over, this money is held by the builder. It must be transferred without deductions.',
    how: 'Get an account-wise statement of maintenance collected from all flat owners. Reconcile with actual expenses incurred during builder management. Balance must be transferred to society account.',
  },
  {
    id: 'accounts_audited',
    cat: 'Financial Handover',
    catIcon: '💰',
    risk: 'High',
    title: 'Accounts maintained by builder during management period are audited',
    why: 'Without audit, you have no way to verify if maintenance was spent properly or if the builder misappropriated funds.',
    how: 'Builder must provide income-and-expenditure statements for the entire period of management. Society should appoint a Chartered Accountant to audit these accounts before accepting handover.',
  },
  {
    id: 'security_deposits',
    cat: 'Financial Handover',
    catIcon: '💰',
    risk: 'High',
    title: 'Security deposits with utility companies transferred / details handed over',
    why: 'Security deposits with electricity board, water supply department etc. are assets of the society. These must be transferred or the society must be notified of the amounts.',
    how: 'Get a list of all security deposits paid by the builder on behalf of the society — MSEDCL, water authority, lift company, etc. Confirm these are transferred to the society\'s name.',
  },
  {
    id: 'insurance_policies',
    cat: 'Financial Handover',
    catIcon: '💰',
    risk: 'Medium',
    title: 'Insurance policies for building and common areas handed over',
    why: 'Builder may have taken insurance for the construction period. The society needs to know about any existing policies and take fresh insurance in its own name.',
    how: 'Ask for copies of any insurance policies. Check expiry dates. The society should renew or take fresh insurance for the building in the society\'s name immediately after handover.',
  },

  // ── Category 3: Physical Infrastructure ────────────────────────────────
  {
    id: 'common_areas_handover',
    cat: 'Physical Infrastructure',
    catIcon: '🏗️',
    risk: 'High',
    title: 'Detailed inventory of all common area assets prepared and signed',
    why: 'Without a signed inventory, the society cannot hold the builder accountable for missing or defective common area items after handover.',
    how: 'Prepare a room-by-room, area-by-area inventory of all assets: lifts, pumps, generator, gym equipment, CCTV, intercom, fire systems, landscape fixtures, etc. Both the builder and the managing committee should sign this document.',
  },
  {
    id: 'lift_handover',
    cat: 'Physical Infrastructure',
    catIcon: '🏗️',
    risk: 'High',
    title: 'Lift maintenance AMC documents and inspection certificates handed over',
    why: 'Lifts require annual inspection by the government. Without the inspection certificates and AMC details, the society may unknowingly operate illegal lifts.',
    how: 'Get all lift inspection certificates, AMC (Annual Maintenance Contract) agreements with the lift company, and any pending service complaints. Check AMC expiry dates.',
  },
  {
    id: 'pump_generator',
    cat: 'Physical Infrastructure',
    catIcon: '🏗️',
    risk: 'High',
    title: 'Water pumps, generator, and electrical panels — manuals and warranties received',
    why: 'Without technical documentation, maintaining complex equipment becomes expensive and prone to errors. Warranty transfer may also be required.',
    how: 'Get operation manuals, warranty cards, and installation records for all water pumps, DG sets, electrical transformers, and distribution panels. Confirm AMC details if any exist.',
  },
  {
    id: 'terrace_waterproofing',
    cat: 'Physical Infrastructure',
    catIcon: '🏗️',
    risk: 'Medium',
    title: 'Terrace and external waterproofing done and warranty obtained',
    why: 'Terrace leakage is one of the most common and expensive post-handover issues. Under RERA Section 14(3), structural defects must be repaired by the builder for 5 years.',
    how: 'Inspect the terrace and external walls. Ask for the waterproofing warranty from the contractor. Note any existing cracks or seepage. File a RERA complaint for defects within 5 years of possession.',
  },
  {
    id: 'security_system',
    cat: 'Physical Infrastructure',
    catIcon: '🏗️',
    risk: 'Medium',
    title: 'CCTV, intercom, and access control systems operational with documentation',
    why: 'These systems are part of building security. If they are non-functional at handover, getting the builder to fix them later is difficult.',
    how: 'Test all CCTV cameras, intercoms to each flat, entrance gates, and access control systems. Get passwords/admin credentials for all systems. Ensure DVR/NVR is functional.',
  },

  // ── Category 4: Maintenance Contracts ──────────────────────────────────
  {
    id: 'service_contracts',
    cat: 'Maintenance Contracts',
    catIcon: '🔧',
    risk: 'Medium',
    title: 'All service contracts (lift, fire, horticulture, housekeeping) details handed over',
    why: 'If the society inherits contracts without reviewing them, they may be locked into unfavourable terms or the builder\'s preferred vendors.',
    how: 'Get copies of all AMC / service contracts currently in force. Review each for: cost, coverage, duration, notice period, and whether they can be terminated or renegotiated.',
  },
  {
    id: 'vendor_accounts',
    cat: 'Maintenance Contracts',
    catIcon: '🔧',
    risk: 'Medium',
    title: 'All utility and vendor accounts transferred to society\'s name',
    why: 'If accounts remain in the builder\'s name, the builder can disconnect services or the society may not be able to manage them independently.',
    how: 'Get transfer confirmation for: electricity common meter (MSEDCL), water supply (PMC/corporation), PNG/LPG, telecom (if any common OFC). Each must be transferred to the society\'s name/account.',
  },
  {
    id: 'staff_records',
    cat: 'Maintenance Contracts',
    catIcon: '🔧',
    risk: 'Low',
    title: 'Records of security and housekeeping staff handed over',
    why: 'The society becomes the employer of these staff. Without records, PF, ESIC, and gratuity liabilities may be disputed.',
    how: 'Get a list of all staff currently employed (security, housekeeping, plumber, electrician) with their joining dates, salary, PF and ESIC account numbers. Confirm if they are direct employees or through a contractor.',
  },

  // ── Category 5: Statutory Compliances ──────────────────────────────────
  {
    id: 'property_tax_society',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'High',
    title: 'Property tax transferred to society / individual flat owners\' names',
    why: 'Property tax remaining in the builder\'s name can accumulate penalties and create ownership disputes. It also prevents the society from paying tax directly.',
    how: 'Check with the Municipal Corporation that property tax records for common areas are in the society\'s name. Individual flat owners should also verify their flat tax is in their own name.',
  },
  {
    id: 'fire_noc_society',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'High',
    title: 'Fire NOC is valid and annual renewal responsibility is clear',
    why: 'Operating a building without valid fire NOC is illegal and a safety risk. Without knowing the renewal dates, the society may miss deadlines and face penalties.',
    how: 'Get a copy of the current fire NOC. Check its validity date. Confirm the renewal process and typical timeline. The society must apply for renewal before the expiry date each year.',
  },
  {
    id: 'rera_final_report',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'Medium',
    title: 'Builder has filed final project report with MahaRERA after completion',
    why: 'Builder is required to file a Form 4 Completion Certificate with MahaRERA after project completion. Without this, the RERA record remains incomplete.',
    how: 'Check the MahaRERA portal for the project. The status should show "Project Completed" with a Form 4 filing date. If not, the society can file a complaint with MahaRERA.',
  },
  {
    id: 'gst_closure',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'Medium',
    title: 'GST reconciliation for maintenance charges during builder management period done',
    why: 'If the builder was charging GST on maintenance, they must account for it. Unaccounted GST can lead to tax demands on the society later.',
    how: 'Ask the builder for GST invoices or GST payment proof for all maintenance charges collected during their management period. If GST was charged but not deposited, it is the builder\'s liability.',
  },
  {
    id: 'elections_held',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'High',
    title: 'First managing committee election held as per Model Bye-Laws',
    why: 'Without a properly elected managing committee, decisions taken by the society can be challenged. Builder-appointed committees have no legal standing under MCS Act.',
    how: 'Ensure the first election is conducted under the supervision of the Election Authority appointed by the Registrar as per Model Bye-Law 114A. All members should have received notice and the election should be recorded in minutes.',
  },
  {
    id: 'rera_escrow_closure',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'High',
    title: 'RERA escrow account closed and funds fully reconciled — builder certificate obtained',
    why: 'Under RERA, builders must maintain a project-specific designated escrow account where 70% of collections are deposited. After project completion, the escrow must be formally closed with a reconciliation statement. Unclosed escrow accounts indicate potential misappropriation of buyer funds.',
    how: 'Ask the builder for the RERA escrow account closure certificate and final reconciliation statement showing all withdrawals and their purposes. Verify on the MahaRERA portal that the project status shows completion and all escrow withdrawal approvals were properly obtained. Any residual balance must be returned to buyers or transferred as per RERA rules.',
  },
  {
    id: 'labour_clearance',
    cat: 'Statutory Compliances',
    catIcon: '⚖️',
    risk: 'Medium',
    title: 'Labour welfare and contractor dues clearance certificates obtained',
    why: 'EPF contributions, ESIC, and Maharashtra Labour Welfare Fund contributions for construction workers are the builder\'s statutory responsibility. If dues are unpaid, government authorities (EPFO, ESIC, Labour Department) may approach the society after handover seeking liability.',
    how: 'Ask for EPF compliance certificates, ESIC compliance certificates, and Maharashtra Labour Welfare Board clearance from the builder confirming all construction worker dues are paid. Get a dues clearance confirmation for major sub-contractors (civil, electrical, plumbing, lift). Retain as protection against post-handover labour claims.',
  },

  // ── Category 6: Technical Completion Documents ─────────────────────────
  {
    id: 'structural_stability_cert',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'Critical',
    title: 'Structural Stability Certificate from licensed structural engineer obtained',
    why: 'This certificate confirms the building has been constructed as per the approved structural design and is safe for occupancy. Without it, the society has no documentary proof of structural integrity — critical for building insurance, housing loans to flat buyers, and resale. Required by most banks for loan approvals.',
    how: 'Request the Structural Stability Certificate signed and stamped by the licensed structural engineer who designed or supervised the project. It should cover all wings, floors, and the basement. Also obtain the structural design drawings (foundation, column, slab details) for society records. Compare key structural dimensions against approved plans.',
  },
  {
    id: 'electrical_completion_cert',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'High',
    title: 'Electrical Completion Certificate from licensed Electrical Inspector obtained',
    why: 'All electrical installations must be inspected and certified by a government-licensed Electrical Inspector under the Electricity Act 2003 and Maharashtra Electricity Supply Code. Without this certificate, the electrical system is technically non-compliant and could void insurance claims in the event of fire or electrocution.',
    how: 'Request the Electrical Completion Certificate (ECC) issued by the Maharashtra Electrical Inspectorate (or empanelled inspecting authority) for all HT/LT electrical installations — substation, DG set, main distribution boards, common area wiring. Confirm the single-line diagram and load schedules are included in the handover documents.',
  },
  {
    id: 'lift_erection_cert',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'Critical',
    title: 'Lift Erection Certificate and valid annual inspection certificate from Electrical Inspector',
    why: 'Under the Maharashtra Lifts, Escalators and Moving Walks Act 2017, no lift can legally be operated without a valid inspection certificate from the Maharashtra Electrical Inspectorate. Operating lifts without valid certificates is a criminal offence. Any accident in an uncertified lift creates unlimited legal liability on the managing committee.',
    how: 'Get the Lift Erection Certificate (initial approval issued after installation) and the current annual inspection certificate from the Maharashtra Electrical Inspectorate for each lift individually. Note the expiry date of each certificate — the society must apply for renewal before expiry each year. Retain the lift manufacturer\'s test reports and load test certificates.',
  },
  {
    id: 'fire_system_completion',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'High',
    title: 'Fire fighting system test report and fire department acceptance certificate obtained',
    why: 'The integrated fire fighting system (fire pumps, sprinklers, hose reels, hydrants, fire extinguishers, fire alarms) must be tested under pressure and accepted by the local fire department. A malfunction during a fire creates direct criminal liability on society committee members under fire safety laws.',
    how: 'Get the fire system hydraulic pressure test report, fire department inspection report, and acceptance certificate from the local fire brigade / fire safety department. Check that all fire extinguishers have valid service tags showing last and next service dates. Confirm the fire pump (main + jockey) operational test was conducted. Get passwords for the fire alarm panel.',
  },
  {
    id: 'stp_oandm_docs',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'Medium',
    title: 'STP completion certificate, MPCB consent, and O&M manual obtained',
    why: 'Sewage Treatment Plants are mandatory for most urban Maharashtra buildings above specified size. Operating an uncertified STP can attract Maharashtra Pollution Control Board (MPCB) penalties, closure notices, and fines on the society. Untreated sewage discharge is also a criminal offence under the Environment Protection Act.',
    how: 'Get the STP completion certificate, MPCB Consent to Operate (CTO), treated water quality test report showing compliance with MPCB standards, and the Operation & Maintenance manual. Ensure at least one committee member or hired operator is trained in the treatment cycle. Know the monitoring parameters and record-keeping requirements.',
  },
  {
    id: 'as_built_drawings',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'High',
    title: 'As-built drawings for all services (structural, plumbing, electrical, firefighting) handed over',
    why: 'As-built drawings show the actual layout of hidden plumbing lines, electrical conduits, gas pipes, and structural elements as they were actually built — which often differs from the approved drawings. Without them, repairs require destructive exploration, are costly, and risk damaging hidden infrastructure.',
    how: 'Demand a full set of as-built drawings covering: structural layout, architectural floor plans, plumbing and drainage layout, electrical single-line diagram and conduit routing, fire fighting system layout, CCTV/intercom/access control wiring, STP/ETP layout. Compare critical dimensions with sanctioned plans. Note and demand justification or rectification for any unauthorised deviations.',
  },
  {
    id: 'rainwater_harvesting',
    cat: 'Technical Completion',
    catIcon: '🏛️',
    risk: 'Medium',
    title: 'Rainwater harvesting system documentation and municipal compliance certificate obtained',
    why: 'Maharashtra Municipal Corporations mandate rainwater harvesting for buildings above a specified plot area. Non-compliance attracts property tax penalty surcharges and can result in rejection of water connection applications. Society is responsible for maintaining the system once operational.',
    how: 'Request the rainwater harvesting system design documents and the municipal compliance / completion certificate. Physically inspect recharge pits or storage tanks for functionality. Understand the maintenance cycle (cleaning of filter beds, desilting of recharge pits) and ensure this is included in annual maintenance planning. Confirm the system is connected as per the compliance certificate.',
  },
];

const CATEGORIES = [...new Set(CHECKLIST.map(c => c.cat))];

const RISK_COLORS = {
  Critical: { bg: '#fef2f2', border: '#fca5a5', dot: '#dc2626', label: 'Critical' },
  High: { bg: '#fff1f0', border: '#f1948a', dot: '#c0392b', label: 'High Risk' },
  Medium: { bg: '#fffbeb', border: '#fcd34d', dot: '#d97706', label: 'Medium Risk' },
  Low: { bg: '#f0fdf4', border: '#86efac', dot: '#16a34a', label: 'Low Risk' },
};

export default function SocietyHandoverChecklistPage() {
  const { navigate } = useContext(AppContext);
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [expanded, setExpanded] = useState({});
  const [activecat, setActiveCat] = useState('All');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const total = CHECKLIST.length;
  const done = CHECKLIST.filter(c => checked[c.id]).length;
  const pct = Math.round((done / total) * 100);

  const criticalUnchecked = CHECKLIST.filter(c => c.risk === 'Critical' && !checked[c.id]).length;
  const visible = activecat === 'All' ? CHECKLIST : CHECKLIST.filter(c => c.cat === activecat);

  const reset = () => {
    if (window.confirm('Reset all checklist progress?')) {
      setChecked({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const progressColor = pct === 100 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';

  return (
    <div>
      <div className="page-header-band">
        <div className="page-header-inner">
          <button className="page-back-btn" onClick={() => navigate('home')}>← Back to Home</button>
          <div className="page-header-meta">
            <div className="page-header-icon" style={{ background: '#f0f9ff' }}>🏘️</div>
            <div className="page-header-text">
              <div className="page-header-title">Society Handover Checklist</div>
              <div className="page-header-desc">For housing society managing committee — before accepting handover from developer · {total} points to verify</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>

            {/* Info banner */}
            <div style={{ padding: '14px 18px', background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: 12, marginBottom: 24, fontSize: 13, color: '#1d4ed8', lineHeight: 1.6 }}>
              <strong>📌 For Managing Committee:</strong> Do NOT sign the handover acceptance letter until all Critical items are resolved. Use this checklist to track what the developer must provide. Any pending item should be documented in writing before handover.
            </div>

            {/* Progress Bar Card */}
            <div className="checklist-progress-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: progressColor }}>{pct}%</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{done} of {total} points verified</div>
                </div>
                {criticalUnchecked > 0 && (
                  <div style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
                    🚨 {criticalUnchecked} critical point{criticalUnchecked > 1 ? 's' : ''} unchecked
                  </div>
                )}
                {pct === 100 && (
                  <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, fontSize: 13, color: '#16a34a', fontWeight: 700 }}>
                    ✅ All {total} points verified — society is ready for handover!
                  </div>
                )}
                <button onClick={reset} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}>
                  Reset
                </button>
              </div>
              <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: progressColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
              </div>
              {/* Category mini bars */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => {
                  const catItems = CHECKLIST.filter(c => c.cat === cat);
                  const catDone = catItems.filter(c => checked[c.id]).length;
                  const catPct = Math.round((catDone / catItems.length) * 100);
                  return (
                    <div key={cat} style={{ flex: 1, minWidth: 100, textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600 }}>{cat.split(' ')[0]}</div>
                      <div style={{ height: 5, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${catPct}%`, background: 'var(--teal)', borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{catDone}/{catItems.length}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '24px 0 20px' }}>
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 20,
                    border: '1.5px solid',
                    borderColor: activecat === cat ? 'var(--teal)' : 'var(--border)',
                    background: activecat === cat ? 'var(--teal)' : 'var(--white)',
                    color: activecat === cat ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {cat === 'All' ? `All (${total})` : cat}
                </button>
              ))}
            </div>

            {/* Checklist Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visible.map((item) => {
                const isChecked = !!checked[item.id];
                const isExpanded = !!expanded[item.id];
                const risk = RISK_COLORS[item.risk];

                return (
                  <div
                    key={item.id}
                    className="checklist-item"
                    style={{
                      borderColor: isChecked ? '#86efac' : risk.border,
                      background: isChecked ? '#f0fdf4' : risk.bg,
                    }}
                  >
                    <div className="checklist-item-header" onClick={() => toggle(item.id)}>
                      <div className={`checklist-checkbox ${isChecked ? 'checked' : ''}`}>
                        {isChecked && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: isChecked ? '#16a34a' : 'var(--text)', textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.7 : 1 }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: risk.dot, color: '#fff' }}>
                            {risk.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.cat}</div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleExpand(item.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, padding: '0 4px', flexShrink: 0 }}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="checklist-item-detail">
                        <div className="checklist-detail-section">
                          <div className="checklist-detail-label">⚠️ Why it matters</div>
                          <div className="checklist-detail-text">{item.why}</div>
                        </div>
                        <div className="checklist-detail-section">
                          <div className="checklist-detail-label">🔍 How to check / what to demand</div>
                          <div className="checklist-detail-text">{item.how}</div>
                        </div>
                        <button
                          className="btn-primary"
                          onClick={() => toggle(item.id)}
                          style={{ marginTop: 12, padding: '8px 20px', fontSize: 13 }}
                        >
                          {isChecked ? '✗ Mark as not verified' : '✓ Mark as verified'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary CTA */}
            {done > 0 && (
              <div style={{ marginTop: 28, padding: '20px 24px', background: 'var(--teal-light)', border: '1.5px solid var(--teal)', borderRadius: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                  {pct === 100
                    ? `🎉 All ${total} checks complete — society is ready to accept handover!`
                    : `${done}/${total} verified — document all pending items in writing before signing handover.`}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Your progress is saved automatically in your browser. Share this checklist with your managing committee members.
                </div>
              </div>
            )}

            {/* Legal remedies note */}
            <div style={{ marginTop: 20, padding: '16px 18px', background: '#f0f9ff', border: '1.5px solid #93c5fd', borderRadius: 12, fontSize: 13, color: '#1e40af', lineHeight: 1.7 }}>
              <strong>If the developer refuses to hand over documents:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                <li>File a complaint with <strong>MahaRERA</strong> for non-compliance with RERA obligations</li>
                <li>File a complaint with the <strong>District Deputy Registrar (Co-operative Societies)</strong> under MCS Act Section 11</li>
                <li>Send a <strong>legal notice</strong> to the developer via advocate demanding documents within 15 days</li>
                <li>Approach <strong>Consumer Forum</strong> for deficiency of service if the developer is unresponsive</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div style={{ marginTop: 16, padding: '12px 18px', background: '#fffbf0', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              ⚠️ This platform provides general legal information only. It is not a substitute for professional legal advice. For court proceedings or legal disputes with the developer, consult a qualified advocate. Laws and regulations may change.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
