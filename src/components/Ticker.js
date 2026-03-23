import React from 'react';

const items = [
  '🏛️ Conveyance Deed is your right — builder must hand over land within 3 months of majority flat sales',
  '🚗 Open parking CANNOT be sold — Supreme Court 2010 ruling protects all flat owners',
  '⚖️ File RERA complaint online at maharerait.maharashtra.gov.in — it is FREE',
  '📋 Demand OC before moving in — occupation without OC is builder\'s liability under MOFA 1963',
  '🏢 Every CHS must hold AGM annually — demand your accounts under MCS Act Section 79A',
  '🔧 Builder warranty lasts 5 years for structural defects — enforce it under MahaRERA Act Section 14',
  '🗳️ Society elections must be held every 5 years — file complaint with Co-operative Election Authority',
  '📌 All projects above ₹50 lakh must be registered on MahaRERA — verify at maharera.mahaonline.gov.in',
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
