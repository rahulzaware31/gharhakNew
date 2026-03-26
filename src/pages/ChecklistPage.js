import React, { useState } from 'react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const FLAT_CHECKLIST = [
  {
    section: 'Legal Documents',
    icon: '📜',
    color: '#e74c3c',
    items: [
      { id: 'f1',  critical: true,  label: 'Occupancy Certificate (OC) / Completion Certificate obtained from PMC/PMRDA', detail: 'Most critical document. Without OC, occupation is illegal. Builder must obtain OC before giving possession. Check OC number, date, and which floors/wings it covers.', law: 'MOFA 1963 § 3 + RERA 2016 § 11(4)(b)' },
      { id: 'f2',  critical: true,  label: 'Registered Agreement for Sale matches flat actually given', detail: 'Compare flat number, floor, wing, carpet area, parking slot number in agreement vs actual flat. Any deviation is actionable under RERA Section 14.', law: 'RERA 2016 § 14' },
      { id: 'f3',  critical: true,  label: 'Possession letter issued by builder with date', detail: 'Official possession letter is required for home loan disbursement, insurance, and legal possession. Insist on registered post or physically signed letter.', law: 'RERA 2016' },
      { id: 'f4',  critical: false, label: 'Index II from Sub-Registrar showing your name as owner', detail: 'Check that Agreement for Sale is registered and Index II reflects your name. Available from igr.maharashtra.gov.in.', law: 'Registration Act 1908' },
      { id: 'f5',  critical: false, label: 'No Dues / No Objection Certificate from builder', detail: 'Confirms builder has no outstanding dues against the flat. Required for society transfer and resale.', law: 'MCS Act' },
      { id: 'f6',  critical: false, label: 'RERA registration of project is valid and current', detail: 'Check maharera.mahaonline.gov.in — project should show as active/completed, not lapsed. Print this page.', law: 'RERA 2016 § 3' },
      { id: 'f7',  critical: false, label: 'Allotment letter for parking slot (covered/stilt)', detail: 'Separate allotment letter specifying parking slot number. Open parking cannot be allotted/sold per SC 2010 judgment.', law: 'SC Nahalchand 2010 + MOFA § 7A' },
    ],
  },
  {
    section: 'Physical Inspection — Structure',
    icon: '🏗️',
    color: '#e67e22',
    items: [
      { id: 'f8',  critical: true,  label: 'No visible cracks in walls, ceiling, columns, or beams', detail: 'Hairline cracks may be normal settlement. Structural cracks (>1mm wide, running through plaster into structure) are defects. Photograph and document all cracks before taking possession.', law: 'RERA 2016 § 14(3) — 5-year warranty' },
      { id: 'f9',  critical: true,  label: 'No water seepage or dampness in walls, ceiling, bathroom', detail: 'Check especially: bathroom/toilet ceiling, external walls, corners. Press palm against suspected areas. Seepage causes structural damage and mold. Report before possession.', law: 'RERA 2016 § 14(3)' },
      { id: 'f10', critical: false, label: 'Floors are level — no undulation or hollow tiles', detail: 'Walk across each room. Tap floor tiles — hollow sound means poor adhesion. Check for lippage (height difference between adjacent tiles). All defects within 5-year warranty.', law: 'RERA 2016 § 14(3)' },
      { id: 'f11', critical: false, label: 'Window and door frames are plumb (vertical) and square', detail: 'Check that frames are not twisted or warped. Open and close all windows and doors — should operate smoothly without binding. Check locks and handles.', law: 'RERA 2016 § 14' },
      { id: 'f12', critical: false, label: 'Flat area matches agreement carpet area (±2% tolerance)', detail: 'Measure each room and calculate total carpet area (excluding walls). Under RERA, builder must refund proportionate amount if area is less than agreed.', law: 'RERA 2016 § 14' },
    ],
  },
  {
    section: 'Physical Inspection — Finishing',
    icon: '🎨',
    color: '#f39c12',
    items: [
      { id: 'f13', critical: false, label: 'Flooring material matches agreement specifications (grade, brand)', detail: 'Agreement should specify brand, grade, size of tiles/marble/wooden flooring. Compare actual vs promised. Grade difference is a specification change under RERA Section 14.', law: 'RERA 2016 § 14' },
      { id: 'f14', critical: false, label: 'Wall painting — even coat, no patchy areas, correct colour', detail: 'Check for brush marks, uneven coat, different shades. Check all four walls of every room in natural light.', law: 'RERA 2016 § 14' },
      { id: 'f15', critical: false, label: 'Kitchen platform height, material, and finish as per agreement', detail: 'Check granite/marble slab thickness, polish quality, drain position, cabinet material and hinges.', law: 'RERA 2016 § 14' },
      { id: 'f16', critical: false, label: 'All bathroom fittings — brand, model as per agreement', detail: 'Check brand of sanitary ware (WC, wash basin), CP fittings (taps, shower), geyser point. Record any substitution.', law: 'RERA 2016 § 14' },
      { id: 'f17', critical: false, label: 'Windows and doors — material, type, size as per agreement', detail: 'Check UPVC/aluminium/wooden as agreed. Check number of shutters, glass thickness, hardware brand.', law: 'RERA 2016 § 14' },
    ],
  },
  {
    section: 'Electrical & Plumbing',
    icon: '⚡',
    color: '#27ae60',
    items: [
      { id: 'f18', critical: true,  label: 'All electrical points working — test with a plug/tester', detail: 'Use a socket tester (available for Rs. 100) to test every outlet. Check: all switches, fan regulators, AC points, geyser point. Test earth leakage circuit breaker (ELCB).', law: 'Building Bye-Laws' },
      { id: 'f19', critical: true,  label: 'Water supply — adequate pressure in all taps and showers', detail: 'Open all taps simultaneously. Check pressure in bathroom, kitchen, balcony. Check hot water from geyser point. Check overhead tank / direct supply arrangement.', law: 'Building Bye-Laws' },
      { id: 'f20', critical: true,  label: 'Drainage — all drains flow freely, no backflow', detail: 'Pour water in all floor traps. Check kitchen drain, bathroom drain, balcony drain. Flush toilets 2-3 times. No gurgling or backflow.', law: 'Building Bye-Laws' },
      { id: 'f21', critical: false, label: 'Electricity meter installed and initial reading noted', detail: 'Note meter number and initial reading in writing. Photograph the meter. Get builder to sign on initial reading record.', law: 'Electricity Act' },
      { id: 'f22', critical: false, label: 'Number of electrical points matches agreement', detail: 'Count: power points, light points, fan points, AC points, TV/phone points. Any shortfall is a deficiency under RERA.', law: 'RERA 2016 § 14' },
    ],
  },
  {
    section: 'Common Areas & Amenities',
    icon: '🏊',
    color: '#2980b9',
    items: [
      { id: 'f23', critical: true,  label: 'All promised amenities are constructed and operational', detail: 'Compare agreement/brochure list vs actual: gym, swimming pool, clubhouse, children\'s play area, garden, security cabin. Partially constructed amenities are a RERA violation.', law: 'RERA 2016 § 14, 18' },
      { id: 'f24', critical: true,  label: 'Lift installed, tested, and licensed by Lift Inspector', detail: 'Lift should have a valid license from the Lift Inspector (Maharashtra Lift Act). Ask for the license copy. Test lift operation on all floors.', law: 'Maharashtra Lift Act' },
      { id: 'f25', critical: false, label: 'Fire safety systems installed — extinguishers, hose reels, alarms', detail: 'Check fire extinguishers in corridors, fire hose reel cabinets, smoke detectors, fire alarm panel. Mandatory for buildings above 15m height.', law: 'Maharashtra Fire Prevention Act' },
      { id: 'f26', critical: false, label: 'Generator / DG backup for lifts and common areas', detail: 'Test DG backup — switch off mains, DG should start within 30 seconds for lifts and common lighting.', law: 'Building Bye-Laws' },
      { id: 'f27', critical: false, label: 'Parking area matches agreement — your slot is accessible', detail: 'Physically check your parking slot. Can you park comfortably? Is the slot accessible without moving other cars? Check if stilt parking is being used as storage by builder.', law: 'SC Nahalchand 2010' },
      { id: 'f28', critical: false, label: 'Compound wall, gate, security cabin complete', detail: 'Check perimeter security. Main gate should have working intercom to flat.', law: 'Building Bye-Laws' },
    ],
  },
  {
    section: 'Financial Checks',
    icon: '💰',
    color: '#8e44ad',
    items: [
      { id: 'f29', critical: true,  label: 'Final statement of account from builder — all amounts tallied', detail: 'Get itemised statement: basic price, GST, stamp duty, registration, maintenance deposit, legal charges, club membership. Verify against all your payment receipts. No undisclosed charges.', law: 'Consumer Protection Act 2019' },
      { id: 'f30', critical: true,  label: 'GST receipt for all GST paid to builder', detail: 'Builder must provide GST invoice. You need this for income tax records and if you sell the flat. Check GST number of builder on gst.gov.in.', law: 'GST Act' },
      { id: 'f31', critical: false, label: 'Maintenance deposit / corpus fund receipt received', detail: 'Note the amount paid as maintenance deposit/corpus. This amount belongs to the society — not the builder. Demand receipt and acknowledgment.', law: 'MCS Model Bye-Laws' },
      { id: 'f32', critical: false, label: 'Home loan disbursement is correct — check with bank', detail: 'Verify bank has disbursed the correct amount to builder. Get a loan statement. Check no amount is outstanding.', law: 'Banking Regulation' },
      { id: 'f33', critical: false, label: 'No undisclosed charges demanded at possession', detail: 'Builders sometimes demand surprise charges at possession (pipe charges, meter charges, legal fees). Check if these are in the agreement. Refuse and document if not agreed.', law: 'RERA 2016 § 13' },
    ],
  },
];

const SOCIETY_CHECKLIST = [
  {
    section: 'Legal Handover Documents',
    icon: '📜',
    color: '#e74c3c',
    items: [
      { id: 's1',  critical: true,  label: 'Conveyance Deed / Deemed Conveyance registered in society\'s name', detail: 'Most important. Land must be transferred to society. Check registered conveyance deed at Sub-Registrar. Without this, builder retains land ownership and can create third-party rights. File Deemed Conveyance if not done.', law: 'MOFA 1963 § 11 + MCS Act § 11(3)' },
      { id: 's2',  critical: true,  label: 'Occupancy Certificate (OC) for entire project — all wings/phases', detail: 'Full OC for all wings must be handed over. Partial OC means residents of some wings are illegally occupying. Builder cannot hand over society until full OC is obtained.', law: 'MOFA 1963 § 3 + RERA 2016 § 11(4)(b)' },
      { id: 's3',  critical: true,  label: 'Building Completion Certificate / Commencement Certificate copies', detail: 'All building plan sanctions, IOD (Intimation of Disapproval), CC (Commencement Certificate), and BCC (Building Completion Certificate) from PMC/PMRDA must be handed over.', law: 'MRTP Act 1966' },
      { id: 's4',  critical: true,  label: 'Society Registration Certificate from DDR', detail: 'Confirm society is registered under MCS Act 1960. Registration number and date must be on all society documents. If not registered, apply to DDR immediately.', law: 'MCS Act 1960' },
      { id: 's5',  critical: true,  label: '7/12 extract / Property Card showing society as owner', detail: 'After conveyance, the 7/12 extract (village land) or Property Card (urban land) should show the society name. Check at taluka office or mahabhumi.gov.in. Mutation must be done after conveyance.', law: 'Maharashtra Land Records Act' },
      { id: 's6',  critical: false, label: 'Share certificates issued to all members', detail: 'Every flat owner must receive a share certificate from the society. Builder/developer must hand over blank certificates if not yet issued. MCS Act requires certificates within 6 months of registration.', law: 'MCS Act 1960 § 70' },
      { id: 's7',  critical: false, label: 'Index II copies for all flats in the project', detail: 'Society should have copies of Index II (Sub-Registrar record) for all flats. This shows who the registered owner of each flat is.', law: 'Registration Act 1908' },
      { id: 's8',  critical: false, label: 'Approved building plans (sanctioned layout plan) received', detail: 'Full set of sanctioned building plans from PMC/PMRDA must be with the society. Essential for future reference — any illegal construction by builder or residents can be identified against these plans.', law: 'MRTP Act 1966' },
    ],
  },
  {
    section: 'Financial Handover',
    icon: '💰',
    color: '#e67e22',
    items: [
      { id: 's9',  critical: true,  label: 'Maintenance deposit / corpus fund handed over to society', detail: 'All maintenance deposits collected from flat owners must be transferred to the society bank account. Get a statement showing each flat owner\'s contribution and total corpus. Builder cannot retain this amount.', law: 'MCS Model Bye-Laws' },
      { id: 's10', critical: true,  label: 'Society bank account opened — only society signatories authorised', detail: 'Society must have its own bank account with MC members as signatories. Builder must not have access. Remove any builder-associated signatories immediately.', law: 'MCS Act 1960' },
      { id: 's11', critical: true,  label: 'Statement of all amounts collected from flat owners with receipts', detail: 'Builder must provide complete accounts: amounts collected from each flat owner (maintenance advance, corpus, legal charges), amounts spent on common areas, balance handed over to society.', law: 'MCS Act § 79A' },
      { id: 's12', critical: false, label: 'Property tax assessment — society name registered with PMC/PMRDA', detail: 'Property tax should be assessed in society name after conveyance. Check with local municipal body. Builder may have outstanding property tax dues — do not accept handover until cleared.', law: 'Municipal Corporation Act' },
      { id: 's13', critical: false, label: 'Water and drainage connection charges paid — NOC from authority', detail: 'Builder must show proof of payment of water connection charges, drainage connection charges, and any development charges. Get NOC from water/drainage authority.', law: 'Municipal Corporation Act' },
      { id: 's14', critical: false, label: 'Electricity meter connections — all meters in owners\' names', detail: 'Individual flat meters should be in flat owners\' names. Common area DG/meter should be in society name. Builder should not have any meters in his name after handover.', law: 'Electricity Act' },
    ],
  },
  {
    section: 'Infrastructure & Warranties',
    icon: '🏗️',
    color: '#27ae60',
    items: [
      { id: 's15', critical: true,  label: 'Structural audit report from registered structural engineer', detail: 'Get an independent structural audit before accepting handover. The report identifies existing defects. Builder is liable to rectify all structural defects for 5 years from possession. Document everything before handover.', law: 'RERA 2016 § 14(3)' },
      { id: 's16', critical: true,  label: 'Lift — valid license, AMC from manufacturer, handover of keys and manuals', detail: 'Lift must have valid license from Lift Inspector. Annual Maintenance Contract (AMC) from manufacturer (Otis/Kone/Schindler) must be active. Society takes over AMC on handover.', law: 'Maharashtra Lift Act' },
      { id: 's17', critical: true,  label: 'DG Set — capacity adequate, service records, AMC, fuel stock', detail: 'Check DG capacity (kVA) is as per agreement. Get full service history. AMC from service provider. Hand over keys, manuals, spare parts. Fuel stock at handover.', law: 'Building Bye-Laws' },
      { id: 's18', critical: false, label: 'Water pump, tank, and plumbing — tested, capacity verified', detail: 'Test water pumps, check sump and overhead tank capacity. Verify fire fighting water reserve is maintained. Get maintenance manual and service records.', law: 'Building Bye-Laws' },
      { id: 's19', critical: false, label: 'CCTV system — operational cameras, DVR, access handed over', detail: 'All CCTV cameras operational. DVR/NVR with minimum 30-day recording capacity. Access credentials handed to MC. Check camera coverage of all entry/exit points.', law: 'Building Bye-Laws' },
      { id: 's20', critical: false, label: 'Fire fighting system — tested, extinguishers full, hose reels operational', detail: 'Full test of fire alarm system, sprinklers (if any), fire hydrant system, hose reels. All extinguishers should be full and within service date. Get fire NOC copy.', law: 'Maharashtra Fire Prevention Act' },
      { id: 's21', critical: false, label: 'Common area electrical — working, wiring certified, ELCB fitted', detail: 'Test all common area lights, staircase lighting, lobby lighting. Electrical wiring should have certification. Earth leakage circuit breakers must be fitted.', law: 'Building Bye-Laws' },
      { id: 's22', critical: false, label: 'Terrace waterproofing — inspected, no leakage', detail: 'Walk entire terrace. Check waterproofing quality. Test in rain or pour water to check drainage. Terrace leakage is the most common defect — document before handover.', law: 'RERA 2016 § 14(3)' },
    ],
  },
  {
    section: 'Common Areas — Physical',
    icon: '🏊',
    color: '#2980b9',
    items: [
      { id: 's23', critical: true,  label: 'All promised amenities complete and operational', detail: 'Physically verify every amenity listed in the agreement/brochure: gym equipment installed and working, swimming pool filled and filtered, clubhouse furnished, children\'s play area complete, garden landscaped. Incomplete amenities = RERA violation.', law: 'RERA 2016 § 14, 18' },
      { id: 's24', critical: true,  label: 'Parking area — all slots as per plan, stilt not encroached', detail: 'Verify total parking slots match sanctioned plan. Stilt parking must not be used as storage/shop by builder. Open parking areas are common areas — cannot be sold or reserved.', law: 'SC Nahalchand 2010 + UDCPR 2020' },
      { id: 's25', critical: false, label: 'Garden / landscape — complete, irrigation system working', detail: 'Society takes maintenance responsibility from handover. Check condition of garden, plants, irrigation system, outdoor lighting, pathways.', law: 'Building Bye-Laws' },
      { id: 's26', critical: false, label: 'Compound wall, gate, and security infrastructure complete', detail: 'Perimeter wall complete with no gaps. Main gate with intercom/video phone to each flat. Security cabin with electricity and water. Boom barrier if promised.', law: 'Building Bye-Laws' },
      { id: 's27', critical: false, label: 'Sewage treatment plant (STP) operational — mandatory for large projects', detail: 'Projects above certain size must have STP. Verify it is installed, commissioned, and functioning. Operating manual and service contact must be handed over.', law: 'Environment Protection Act' },
      { id: 's28', critical: false, label: 'Solar panels / rainwater harvesting — if promised, operational', detail: 'Check if solar panels are connected and generating power for common areas. Rainwater harvesting pit and pipeline should be functional.', law: 'Building Bye-Laws' },
    ],
  },
  {
    section: 'Society Governance Setup',
    icon: '🏛️',
    color: '#8e44ad',
    items: [
      { id: 's29', critical: true,  label: 'First Managing Committee elected by members', detail: 'A properly elected MC (not builder-nominated) must be in place before handover. MC must be elected as per MCS Election Rules 2014. Builder cannot control MC post-handover.', law: 'MCS Act § 73CB + MCS Election Rules 2014' },
      { id: 's30', critical: true,  label: 'Model Bye-Laws adopted by society', detail: 'Society must adopt MCS Model Bye-Laws 2014 (or amended version) at its first AGM. Copy must be with the society and with DDR. Bye-laws govern all society functioning.', law: 'MCS Act 1960' },
      { id: 's31', critical: true,  label: 'Society records from builder — register of members, flat details', detail: 'Builder must hand over: complete register of all flat owners, their flat numbers, areas, parking slots, contact details, payment history. This becomes the society\'s primary record.', law: 'MCS Act 1960' },
      { id: 's32', critical: false, label: 'List of all pending defects — signed by builder and MC', detail: 'Prepare a detailed list of all defects observed during inspection. Get builder to sign acknowledging these defects. This protects society when builder later claims defects arose after handover.', law: 'RERA 2016 § 14(3)' },
      { id: 's33', critical: false, label: 'Builder\'s undertaking for pending work with timeline', detail: 'Any incomplete work at time of handover must be documented with builder\'s written undertaking and specific completion timeline. RERA can enforce this undertaking if builder delays.', law: 'RERA 2016 § 14' },
      { id: 's34', critical: false, label: 'Insurance for building structure arranged', detail: 'Society should arrange building insurance (structure) from Day 1. Builder may have had insurance — check if it transfers to society or new policy is needed.', law: 'MCS Model Bye-Laws' },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function CheckItem({ item, checked, onToggle }) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      style={{
        display: 'flex', gap: 14, padding: '14px 16px',
        background: checked ? '#f0fdf4' : 'var(--white)',
        border: `1px solid ${checked ? '#bbf7d0' : 'var(--border)'}`,
        borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
        marginBottom: 10,
      }}>
      {/* Checkbox */}
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
        border: `2px solid ${checked ? '#22c55e' : item.critical ? '#e74c3c' : 'var(--border)'}`,
        background: checked ? '#22c55e' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>✓</span>}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          {item.critical && !checked && (
            <span style={{
              padding: '2px 8px', background: '#fef2f2', color: '#e74c3c',
              borderRadius: 999, fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>CRITICAL</span>
          )}
          <span style={{
            fontSize: 14, fontWeight: checked ? 400 : 600,
            color: checked ? '#16a34a' : 'var(--dark)',
            textDecoration: checked ? 'line-through' : 'none',
            lineHeight: 1.4,
          }}>{item.label}</span>
        </div>
        {!checked && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 6 }}>
            {item.detail}
          </div>
        )}
        <div style={{ display: 'inline-block', padding: '2px 8px',
          background: 'var(--dark)', color: 'var(--teal)',
          borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
          {item.law}
        </div>
      </div>
    </div>
  );
}

function Section({ section, checked, onToggle }) {
  const total    = section.items.length;
  const done     = section.items.filter(i => checked[i.id]).length;
  const critical = section.items.filter(i => i.critical && !checked[i.id]).length;
  const pct      = Math.round((done / total) * 100);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px', background: 'var(--dark)', borderRadius: '12px 12px 0 0',
      }}>
        <span style={{ fontSize: 22 }}>{section.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{section.section}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            {done}/{total} done
            {critical > 0 && <span style={{ color: '#fca5a5', marginLeft: 8 }}>· {critical} critical pending</span>}
          </div>
        </div>
        {/* Progress */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: section.color }}>{pct}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--border)', borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: section.color,
          transition: 'width 0.4s ease', borderRadius: '0 0 4px 4px',
        }} />
      </div>

      {/* Items */}
      <div style={{ padding: '16px 0 0' }}>
        {section.items.map(item => (
          <CheckItem key={item.id} item={item}
            checked={!!checked[item.id]}
            onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ChecklistPage() {
  const [activeList, setActiveList] = useState('flat'); // 'flat' | 'society'
  const [checked, setChecked]       = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const LIST = activeList === 'flat' ? FLAT_CHECKLIST : SOCIETY_CHECKLIST;

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const allItems = LIST.flatMap(s => s.items);
  const totalItems    = allItems.length;
  const doneItems     = allItems.filter(i => checked[i.id]).length;
  const criticalPending = allItems.filter(i => i.critical && !checked[i.id]).length;
  const overallPct    = Math.round((doneItems / totalItems) * 100);

  const statusColor = criticalPending > 0 ? '#e74c3c'
    : overallPct === 100 ? '#22c55e'
    : overallPct >= 60   ? '#f39c12'
    : 'var(--text-muted)';

  const statusLabel = criticalPending > 0
    ? `⚠️ ${criticalPending} critical items pending — do NOT take possession yet`
    : overallPct === 100 ? '✅ All checks complete — safe to proceed'
    : overallPct >= 60   ? '🔶 In progress — complete remaining items'
    : '📋 Checklist started';

  const resetChecked = () => {
    setChecked({});
    setShowSummary(false);
  };

  const pendingItems = allItems.filter(i => !checked[i.id]);
  const criticalLeft = pendingItems.filter(i => i.critical);

  const copyReport = () => {
    const lines = [
      activeList === 'flat'
        ? 'FLAT POSSESSION CHECKLIST REPORT — GharHak'
        : 'SOCIETY HANDOVER CHECKLIST REPORT — GharHak',
      `Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`,
      `Overall: ${doneItems}/${totalItems} completed (${overallPct}%)`,
      `Critical pending: ${criticalPending}`,
      '',
      '✅ COMPLETED:',
      ...allItems.filter(i => checked[i.id]).map(i => `  ✓ ${i.label}`),
      '',
      '❌ PENDING:',
      ...pendingItems.map(i => `  ${i.critical ? '[CRITICAL] ' : ''}✗ ${i.label}`),
    ];
    navigator.clipboard.writeText(lines.join('\n'))
      .then(() => alert('Report copied to clipboard!'));
  };

  return (
    <div className="section">
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
            Protect Yourself Before You Sign
          </div>
          <h1 className="section-title">
            Possession & Handover <span>Checklists</span>
          </h1>
          <p className="section-sub" style={{ maxWidth: 580, margin: '0 auto' }}>
            Maharashtra-specific checklists based on MOFA 1963, RERA 2016, and MCS Act.
            Tick each item as you verify it — get a shareable report at the end.
          </p>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', background: 'var(--white)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 6, gap: 6, maxWidth: 700, margin: '0 auto 32px' }}>
          {[
            { id: 'flat',    icon: '🏠', title: 'Flat Possession Checklist',    sub: `${FLAT_CHECKLIST.flatMap(s=>s.items).length} items · Before accepting your flat` },
            { id: 'society', icon: '🏘️', title: 'Society Handover Checklist',   sub: `${SOCIETY_CHECKLIST.flatMap(s=>s.items).length} items · Before MC accepts from builder` },
          ].map(t => (
            <button key={t.id} onClick={() => { setActiveList(t.id); resetChecked(); }}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'center',
                transition: 'all 0.2s',
                background: activeList === t.id ? 'var(--teal)' : 'transparent',
                color: activeList === t.id ? '#fff' : 'var(--text-muted)',
              }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Progress hero */}
          <div style={{
            background: 'var(--dark)', borderRadius: 18, padding: '24px 28px',
            marginBottom: 28, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            {/* Big number */}
            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: statusColor, lineHeight: 1 }}>
                {overallPct}%
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>complete</div>
            </div>

            {/* Progress bar + status */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{
                  height: '100%', width: `${overallPct}%`, borderRadius: 99,
                  background: statusColor, transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: statusColor }}>
                {statusLabel}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                {doneItems} of {totalItems} items verified
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={copyReport}
                style={{ padding: '9px 18px', background: 'var(--teal)', color: '#fff',
                  border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font)' }}>
                📋 Copy Report
              </button>
              <button onClick={() => window.print()}
                style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9, fontSize: 12,
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                🖨️ Print
              </button>
              <button onClick={resetChecked}
                style={{ padding: '9px 18px', background: 'transparent', color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Critical warning banner */}
          {criticalLeft.length > 0 && doneItems > 0 && (
            <div style={{
              background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12,
              padding: '14px 18px', marginBottom: 24,
            }}>
              <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 6, fontSize: 14 }}>
                🚨 {criticalLeft.length} Critical Items Still Pending — Do NOT take possession yet
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {criticalLeft.map(i => (
                  <div key={i.id} style={{ fontSize: 13, color: '#991b1b' }}>
                    • {i.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intro banner for each list type */}
          {doneItems === 0 && (
            <div style={{
              background: 'var(--teal-light)', border: '1.5px solid rgba(0,200,150,0.25)',
              borderRadius: 12, padding: '16px 20px', marginBottom: 24, fontSize: 13, lineHeight: 1.7,
            }}>
              {activeList === 'flat' ? (
                <>
                  <strong>🏠 Before taking flat possession:</strong> Tick each item only after you have physically verified it.
                  Items marked <strong style={{ color: '#e74c3c' }}>CRITICAL</strong> must not be skipped — they protect your legal rights.
                  If builder refuses to resolve critical items, <strong>do not sign possession letter</strong> and file RERA complaint immediately.
                </>
              ) : (
                <>
                  <strong>🏘️ Before accepting society handover from builder:</strong> Managing Committee must verify all items.
                  Critical items must be resolved before handover. Get all documents in writing.
                  A signed handover report protects the MC from future liability.
                </>
              )}
            </div>
          )}

          {/* All sections */}
          {LIST.map((section, i) => (
            <Section key={i} section={section} checked={checked} onToggle={toggle} />
          ))}

          {/* Completion message */}
          {overallPct === 100 && (
            <div style={{
              background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: 16,
              padding: '24px 28px', textAlign: 'center', marginTop: 8,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#166534', marginBottom: 8 }}>
                All {totalItems} items verified!
              </div>
              <div style={{ fontSize: 14, color: '#16a34a', marginBottom: 20 }}>
                {activeList === 'flat'
                  ? 'You can safely proceed with flat possession. Keep this report for your records.'
                  : 'Society handover is complete. Keep all documents safely. Conduct first AGM within 3 months.'}
              </div>
              <button onClick={copyReport}
                style={{ padding: '12px 28px', background: '#22c55e', color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', fontFamily: 'var(--font)' }}>
                📋 Copy Completion Report
              </button>
            </div>
          )}

          {/* What to do if builder refuses */}
          <div style={{
            marginTop: 32, background: 'var(--dark)', borderRadius: 16,
            padding: '24px 28px',
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 16 }}>
              ⚠️ What to do if builder refuses to resolve issues
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { n: '1', color: '#e74c3c', text: 'Document everything in writing — send email/registered letter listing all defects/missing items. Keep copies.' },
                { n: '2', color: '#e67e22', text: 'Do NOT sign possession letter until critical items are resolved. Signing shifts liability to you.' },
                { n: '3', color: '#f39c12', text: 'File MahaRERA complaint at maharerait.maharashtra.gov.in — for OC, defects, incomplete amenities, specification mismatch.' },
                { n: '4', color: '#27ae60', text: 'File Consumer Forum complaint for deficiency of service and compensation for delay and expenses.' },
                { n: '5', color: '#2980b9', text: 'File Deemed Conveyance application with DDR if conveyance deed is not executed by builder.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 999, background: s.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 12, flexShrink: 0,
                  }}>{s.n}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, paddingTop: 3 }}>
                    {s.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: 20, padding: '12px 16px', background: '#fffbf0',
            border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
            ⚠️ This checklist is for general guidance based on Maharashtra law. Specific requirements may vary
            by project, location, and type of building. For complex disputes, consult a qualified advocate
            experienced in Maharashtra housing law. GharHak does not provide legal advice.
          </div>

        </div>
      </div>
    </div>
  );
}
