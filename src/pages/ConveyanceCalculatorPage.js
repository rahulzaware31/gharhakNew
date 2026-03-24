<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GharHak — Conveyance Area & FSI Calculator</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap" rel="stylesheet" />
<style>
:root{--teal:#00c896;--teal-dark:#00a87d;--teal-light:#e6faf5;--dark:#0f1923;--dark-2:#1a2636;--text:#1a2636;--muted:#6b7a8d;--bg:#f8fafb;--white:#fff;--border:#e2e8f0;--red:#e74c3c;--orange:#e67e22;--font:'Bricolage Grotesque',sans-serif;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:var(--font);background:var(--bg);color:var(--text);font-size:14px;}
.header{background:var(--dark);padding:16px 24px;}
.logo{font-size:22px;font-weight:800;color:#fff;}.logo span{color:var(--teal);}
.header-sub{font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;}
.hero{background:linear-gradient(135deg,var(--dark),#0d2b1f);padding:40px 24px;text-align:center;}
.hero h1{font-size:clamp(26px,5vw,48px);font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:6px;}
.hero h1 span{color:var(--teal);}
.hero-law{display:inline-flex;align-items:center;gap:8px;background:rgba(0,200,150,0.1);border:1px solid rgba(0,200,150,0.25);color:var(--teal);padding:6px 16px;border-radius:999px;font-size:12px;font-weight:600;margin-bottom:16px;}
.hero-sub{font-size:15px;color:rgba(255,255,255,0.6);max-width:680px;margin:10px auto 0;}
.container{max-width:1140px;margin:0 auto;padding:32px 20px;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
@media(max-width:800px){.grid2{grid-template-columns:1fr;}}
.card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px;margin-bottom:20px;}
.card-title{font-size:16px;font-weight:800;margin-bottom:4px;}
.card-sub{font-size:12px;color:var(--muted);margin-bottom:20px;}
.field{margin-bottom:14px;}
.field label{font-size:12px;font-weight:600;display:block;margin-bottom:5px;}
.field label em{color:var(--muted);font-weight:400;font-style:normal;font-size:11px;margin-left:4px;}
.field input,.field select{width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:9px;font-size:13px;font-family:var(--font);outline:none;transition:all .2s;background:#fff;}
.field input:focus,.field select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(0,200,150,.1);}
.field .hint{font-size:11px;color:var(--muted);margin-top:3px;}
.soc-row{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px;}
.soc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;}
.soc-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
.soc-num{font-size:11px;font-weight:700;color:var(--teal);text-transform:uppercase;letter-spacing:1px;}
.btn-del{width:28px;height:28px;background:#fef2f2;border:1px solid #fca5a5;border-radius:7px;color:var(--red);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.btn-add{width:100%;padding:10px;background:var(--teal-light);color:var(--teal);border:1.5px dashed var(--teal);border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;margin-top:6px;font-family:var(--font);}
.btn-calc{width:100%;padding:15px;background:var(--teal);color:#fff;border:none;border-radius:11px;font-size:16px;font-weight:800;cursor:pointer;margin-top:20px;font-family:var(--font);}
.btn-sec{width:100%;padding:11px;background:transparent;color:var(--muted);border:1.5px solid var(--border);border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;font-family:var(--font);}
.btn-sec2{width:100%;padding:11px;background:transparent;color:var(--teal);border:1.5px solid var(--teal);border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;font-family:var(--font);}
.results{margin-top:28px;display:none;}.results.show{display:block;}
.as-table{width:100%;border-collapse:collapse;font-size:13px;}
.as-table th{background:var(--dark);color:rgba(255,255,255,.85);padding:10px 14px;text-align:left;font-size:11px;}
.as-table th.r{text-align:right;}
.as-table td{padding:9px 14px;border-bottom:1px solid var(--border);vertical-align:top;}
.as-table td.r{text-align:right;font-family:'Courier New',monospace;font-weight:600;}
.as-table td.sub{color:var(--muted);font-size:12px;padding-left:28px;}
.as-table tr.sh td{background:#f1f5f9;font-weight:700;font-size:12px;color:var(--dark);}
.as-table tr.sh td .sn{color:var(--teal);margin-right:8px;font-weight:800;}
.as-table tr.tot td{background:var(--teal-light);font-weight:700;color:#065f46;}
.as-table tr.fr td{background:#fef2f2;color:var(--red);font-weight:700;}
.as-table tr.ok td{background:#f0fdf4;color:#065f46;font-weight:700;}
.as-table .diff{font-size:11px;color:var(--red);}
.as-table .okd{font-size:11px;color:#065f46;}
.r-hero{background:linear-gradient(135deg,var(--dark),var(--dark-2));border-radius:18px;padding:32px;text-align:center;margin-bottom:20px;}
.r-lbl{font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.r-num{font-size:clamp(36px,7vw,64px);font-weight:800;color:var(--teal);line-height:1;}
.r-unit{font-size:14px;color:rgba(255,255,255,.4);margin-top:4px;margin-bottom:20px;}
.r-badges{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.badge{padding:6px 16px;border-radius:999px;font-size:12px;font-weight:700;}
.badge-g{background:rgba(0,200,150,.15);color:var(--teal);border:1px solid rgba(0,200,150,.3);}
.badge-r{background:rgba(231,76,60,.15);color:var(--red);border:1px solid rgba(231,76,60,.3);}
.badge-o{background:rgba(230,126,34,.15);color:var(--orange);border:1px solid rgba(230,126,34,.3);}
.igrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:20px;}
.ibox{padding:14px;border-radius:10px;border:1px solid var(--border);background:var(--white);}
.inum{font-size:20px;font-weight:800;color:var(--teal);}
.ilbl{font-size:11px;color:var(--muted);margin-top:3px;line-height:1.4;}
.alert{padding:14px 18px;border-radius:11px;margin-bottom:14px;font-size:13px;line-height:1.6;}
.alert .at{font-weight:700;margin-bottom:5px;font-size:14px;}
.ar{background:#fef2f2;border:1.5px solid #fca5a5;color:#991b1b;}
.ao{background:#fff7ed;border:1.5px solid #fed7aa;color:#92400e;}
.ag{background:var(--teal-light);border:1.5px solid rgba(0,200,150,.3);color:#065f46;}
.ab{background:#eff6ff;border:1.5px solid #bfdbfe;color:#1e40af;}
.tab-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;}
.tab{padding:8px 16px;border-radius:7px;border:1.5px solid var(--border);background:var(--white);font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;font-family:var(--font);}
.tab.active{background:var(--teal);color:#fff;border-color:var(--teal);}
.tp{display:none;}.tp.active{display:block;}
.mbox{background:var(--dark);border-radius:12px;padding:22px;font-family:'Courier New',monospace;font-size:12px;color:rgba(255,255,255,.75);line-height:1.9;overflow-x:auto;}
.mbox .eq{color:var(--teal);font-weight:700;}
.mbox .val{color:#fff;font-weight:700;}
.mbox .bad{color:#f87171;}
.mbox .good{color:#6ee7b7;}
.mbox .dim{color:rgba(255,255,255,.3);font-size:11px;}
.mbox .rule{border-top:1px solid rgba(255,255,255,.1);margin:8px 0;padding-top:8px;}
.mbox .res{color:var(--teal);font-size:13px;font-weight:800;border-top:2px solid rgba(0,200,150,.3);margin-top:10px;padding-top:10px;}
.dout{background:#f8fafb;border:1px solid var(--border);border-radius:10px;padding:18px;font-size:12px;line-height:1.85;white-space:pre-wrap;max-height:450px;overflow-y:auto;font-family:'Courier New',monospace;}
.bcopy{padding:9px 18px;background:var(--teal);color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;margin-top:10px;font-family:var(--font);}
.bprint{padding:9px 18px;background:var(--white);color:var(--text);border:1px solid var(--border);border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;margin-top:10px;margin-left:8px;font-family:var(--font);}
.sl{display:flex;flex-direction:column;gap:12px;}
.si{display:flex;gap:14px;padding:16px;background:var(--white);border:1px solid var(--border);border-radius:11px;}
.sn2{width:30px;height:30px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;flex-shrink:0;}
.st{font-weight:700;margin-bottom:5px;}
.sd{font-size:12px;color:var(--muted);line-height:1.6;}
.disc{font-size:11px;color:var(--muted);background:#fffbf0;border:1px solid #fde68a;border-radius:9px;padding:12px 16px;margin-top:20px;line-height:1.6;}
.guide-block{padding:10px 12px;background:rgba(255,255,255,.05);border-radius:8px;margin-bottom:8px;}
</style>
</head>
<body>
<div class="header"><div class="logo">Ghar<span>Hak</span></div><div class="header-sub">Maharashtra Housing Rights · FSI & Conveyance Calculator · UDCPR 2020</div></div>
<div class="hero">
  <div class="hero-law">📐 Follows Exact PMRDA Area Statement Row Format · UDCPR 2020</div>
  <h1>Conveyance Area & <span>FSI Calculator</span></h1>
  <p class="hero-sub">Mirrors official PMRDA Area Statement. Calculates Base FSI, Premium FSI (Row 10), TDR (Row 11c), Ancillary (Row 13e = Balance × 0.60) — and detects fraud by comparing builder's figures against correct figures after excluding conveyed society lands.</p>
</div>
<div class="container">
<div class="grid2">
<div>
  <div class="card">
    <div class="card-title">📋 Plot Details — Rows 01–03</div>
    <div class="card-sub">From 7/12 extract, ownership document, sanctioned layout</div>
    <div class="field"><label>Area as per Ownership Document / 7-12 <em>(Row 01a)</em></label><input type="number" id="plotOwn" placeholder="e.g. 97700" step="0.01"/></div>
    <div class="field"><label>Area as per Sanctioned Layout Plan <em>(Row 01b)</em></label><input type="number" id="plotSanc" placeholder="e.g. 97700" step="0.01"/></div>
    <div class="field"><label>Area under 15m+ Road — to surrender <em>(Row 02a)</em></label><input type="number" id="deductRd" value="0" step="0.01"/><div class="hint">Road widening deduction only. Internal roads NOT deducted here.</div></div>
    <div class="field"><label>Planning Authority</label>
      <select id="auth"><option value="pmrda">PMRDA</option><option value="pmc">PMC</option><option value="pcmc">PCMC</option><option value="other">Other</option></select></div>
    <div class="field"><label>Road Width in front of plot <em>(determines Base FSI)</em></label>
      <select id="rdw">
        <option value="9">Up to 9m — Base FSI 1.10</option>
        <option value="12" selected>9–15m (12m) — Base FSI 1.10</option>
        <option value="18">15–24m — Base FSI 1.30</option>
        <option value="24">24–30m — Base FSI 1.50</option>
        <option value="30">30m+ — Base FSI 1.80</option>
      </select><div class="hint">UDCPR 2020 Table 6-A, PMRDA Residential Zone</div></div>
  </div>
  <div class="card">
    <div class="card-title">🌳 Amenity Space — Rows 04–08</div>
    <div class="card-sub">Net Plot Area = Balance Area − Amenity Space</div>
    <div class="field"><label>Amenity Space Proposed <em>(Row 04b)</em></label><input type="number" id="amenity" placeholder="auto: 15% of balance area" step="0.01"/><div class="hint">Leave blank to auto-calculate at 15%</div></div>
    <div class="field"><label>Recreational Open Space <em>(Row 06b — NOT deducted)</em></label><input type="number" id="recSp" value="0" step="0.01"/></div>
    <div class="field"><label>Internal Road Area <em>(Row 07 — NOT deducted)</em></label><input type="number" id="intRd" value="0" step="0.01"/></div>
  </div>
  <div class="card">
    <div class="card-title">🏗️ Builder's Claimed Figures <em style="font-size:12px;font-weight:400;color:var(--muted)">(for fraud detection)</em></div>
    <div class="card-sub">From builder's area statement, sanction letter, commencement certificate</div>
    <div class="field"><label>Builder's Claimed Plot Area <em>(their Row 01c)</em></label><input type="number" id="bPlot" placeholder="e.g. 97700" step="0.01"/></div>
    <div class="field"><label>Builder's Proposed Total BUA <em>(their Row 15e)</em></label><input type="number" id="bBUA" placeholder="e.g. 107564" step="0.01"/></div>
    <div class="field"><label>Existing BUA on Plot <em>(Row 13b)</em></label><input type="number" id="exBUA" value="0" step="0.01"/></div>
    <div class="field"><label>TDR Proposed by Builder <em>(Row 11c proposed)</em></label><input type="number" id="bTDR" value="0" step="0.01"/></div>
    <div class="field"><label>Premium FSI Proposed by Builder <em>(Row 10b)</em></label><input type="number" id="bPrem" value="0" step="0.01"/></div>
  </div>
</div>
<div>
  <div class="card">
    <div class="card-title">🏘️ Societies / Associations — Conveyed Land</div>
    <div class="card-sub">Enter each society and area conveyed / to be conveyed to them</div>
    <div id="socList"></div>
    <button class="btn-add" onclick="addSoc()">+ Add Society / Association</button>
  </div>
  <div class="card" style="background:var(--dark);border-color:var(--dark-2);">
    <div class="card-title" style="color:#fff;font-size:14px;">📖 UDCPR 2020 FSI Formula (PMRDA)</div>
    <div style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.8;margin-top:8px;">
      <div class="guide-block" style="border-left:3px solid var(--teal)"><strong style="color:#fff">Row 09 — Base FSI BUA</strong><br/>Net Plot Area × Base FSI Rate<br/>(1.10 for &lt;15m | 1.30 for 15–24m | 1.50 for 24–30m | 1.80 for 30m+)</div>
      <div class="guide-block" style="border-left:3px solid var(--orange)"><strong style="color:#fff">Row 10 — Premium FSI</strong><br/>Max = Net Plot Area × <strong style="color:var(--orange)">0.30</strong><br/>Pay premium to PMRDA to unlock</div>
      <div class="guide-block" style="border-left:3px solid #2980b9"><strong style="color:#fff">Row 11c — TDR</strong><br/>Max = Net Plot Area × <strong style="color:#7fc8f8">0.70</strong><br/>↳ Slum TDR = NPA × 0.21<br/>↳ Reservation TDR = NPA × 0.49</div>
      <div class="guide-block" style="border-left:3px solid #a855f7"><strong style="color:#fff">Row 13e — Ancillary Area</strong><br/>= Balance BUA × <strong style="color:#d8b4fe">0.60</strong><br/>(Staircase, lift, lobby — not counted in FSI)<br/><em style="color:rgba(255,255,255,.3);">Balance BUA = Total FSI (Row 13a) − Existing BUA (Row 13b)</em></div>
      <div class="guide-block" style="background:rgba(0,200,150,.08);border:1px solid rgba(0,200,150,.2);"><strong style="color:var(--teal)">Max Total = NPA × (1.10 + 0.30 + 0.70) = NPA × 2.10</strong><br/><span style="color:rgba(255,255,255,.4);font-size:11px;">Plus Ancillary (60% of Balance BUA) on top · Open Space = 10% of Balance Area Row 03, NOT of NPA · No Row 13c deduction</span></div>
    </div>
  </div>
</div>
</div>
<button class="btn-calc" onclick="calc()">⚡ Generate Area Statement & Detect FSI Fraud</button>
<button class="btn-sec" onclick="reset()">↺ Reset All</button>
<button class="btn-sec2" onclick="loadEx()">📋 Load Example: Gat 1185A Wagholi</button>

<div class="results" id="results">
  <div class="r-hero"><div class="r-lbl">Total Land to be Conveyed to All Societies</div><div class="r-num" id="rConv">—</div><div class="r-unit">sq.m.</div><div class="r-badges" id="rBadges"></div></div>
  <div class="card">
    <div class="tab-row">
      <button class="tab active" onclick="sw('as',this)">📊 Area Statement</button>
      <button class="tab" onclick="sw('fraud',this)">🔍 FSI Fraud Check</button>
      <button class="tab" onclick="sw('math',this)">🧮 Workings</button>
      <button class="tab" onclick="sw('doc',this)">📄 Legal Statement</button>
      <button class="tab" onclick="sw('steps',this)">🗺️ Next Steps</button>
    </div>
    <div class="tp active" id="tab-as"><div class="igrid" id="rGrid"></div><p style="font-size:11px;color:var(--muted);margin-bottom:10px">📌 <strong style="color:var(--red)">Red = Builder's figures</strong> (including society land) vs <strong style="color:#065f46">Green = Correct figures</strong> (after excluding conveyed lands)</p><table class="as-table"><thead><tr><th style="width:30px">#</th><th>Description</th><th class="r" style="color:#f87171">Builder's<br>Figures (sq.m.)</th><th class="r" style="color:#6ee7b7">Correct<br>Figures (sq.m.)</th></tr></thead><tbody id="rAST"></tbody></table><div id="rAlerts" style="margin-top:16px"></div></div>
    <div class="tp" id="tab-fraud"><div id="rFraud"></div></div>
    <div class="tp" id="tab-math"><div class="mbox" id="rMath"></div></div>
    <div class="tp" id="tab-doc"><p style="font-size:13px;color:var(--muted);margin-bottom:14px">Ready for DDR, RERA complaint, court affidavit, PMRDA objection.</p><pre class="dout" id="rDoc"></pre><button class="bcopy" onclick="cpDoc()">📋 Copy</button><button class="bprint" onclick="window.print()">🖨️ Print</button></div>
    <div class="tp" id="tab-steps"><div id="rSteps"></div></div>
  </div>
  <div class="disc">⚠️ This calculator is based on UDCPR 2020 and actual PMRDA area statement formats. Figures are indicative. Verify with certified 7/12 extracts, approved layout plans, and conveyance deeds. Not legal advice — consult a qualified town planner and advocate for filings.</div>
</div>
</div>
<script>
const BASE={pmrda:{9:1.10,12:1.10,18:1.30,24:1.50,30:1.80},pmc:{9:1.10,12:1.50,18:2.00,24:2.50,30:3.00},pcmc:{9:1.10,12:1.50,18:2.00,24:2.50,30:3.00},other:{9:1.00,12:1.00,18:1.20,24:1.50,30:1.80}};
const PREM=0.30,TDR=0.70,SLUM=0.30,RES=0.70,ANCIL=0.60,AMEN=0.15;
let socs=[];
const f=(n,d=2)=>n==null||isNaN(n)?'—':Number(n).toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});
const f0=n=>f(n,0);
const g=id=>parseFloat(document.getElementById(id).value)||0;
const gs=id=>document.getElementById(id).value;

function addSoc(p={}){const id=Date.now()+Math.random();socs.push({id,name:p.name||'',type:p.type||'chs',flats:p.flats||'',area:p.area||'',status:p.status||'done'});rSocs();}
function delSoc(id){socs=socs.filter(s=>s.id!==id);rSocs();}
function upSoc(id,f,v){const s=socs.find(s=>s.id===id);if(s)s[f]=v;}
function rSocs(){
  const el=document.getElementById('socList');
  if(!socs.length){el.innerHTML='<div style="text-align:center;padding:16px;color:var(--muted);font-size:12px">No societies added. Click + below.</div>';return;}
  el.innerHTML=socs.map((s,i)=>`<div class="soc-row"><div class="soc-header"><span class="soc-num">Society ${i+1}</span><button class="btn-del" onclick="delSoc(${s.id})">×</button></div><div class="field" style="margin-bottom:8px"><input type="text" placeholder="Society name" value="${s.name}" oninput="upSoc(${s.id},'name',this.value)"/></div><div class="soc-grid"><div class="field" style="margin-bottom:0"><label>Type</label><select onchange="upSoc(${s.id},'type',this.value)"><option value="chs" ${s.type==='chs'?'selected':''}>CHS</option><option value="aoa" ${s.type==='aoa'?'selected':''}>AOA</option><option value="condo" ${s.type==='condo'?'selected':''}>Condo</option></select></div><div class="field" style="margin-bottom:0"><label>Flats</label><input type="number" placeholder="120" value="${s.flats}" oninput="upSoc(${s.id},'flats',this.value)"/></div><div class="field" style="margin-bottom:0"><label>Conveyed Area (sq.m.)</label><input type="number" placeholder="4600" step="0.01" value="${s.area}" oninput="upSoc(${s.id},'area',this.value)"/></div><div class="field" style="margin-bottom:0"><label>Status</label><select onchange="upSoc(${s.id},'status',this.value)"><option value="done" ${s.status==='done'?'selected':''}>✅ Conveyed</option><option value="pending" ${s.status==='pending'?'selected':''}>❌ Pending</option><option value="partial" ${s.status==='partial'?'selected':''}>⚠️ Partial</option></select></div></div></div>`).join('');
}
function sw(n,btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+n).classList.add('active');
  if(btn)btn.classList.add('active');
}
function row(num,desc,bv,cv,cls='',sub=false){
  const diff=bv!=null&&cv!=null&&!isNaN(bv)&&!isNaN(cv)?bv-cv:null;
  const ds=diff!==null&&Math.abs(diff)>0.5?`<br/><span class="${diff>0?'diff':'okd'}">${diff>0?'▲+'+f0(Math.abs(diff)):'▼'+f0(Math.abs(diff))}</span>`:'';
  return `<tr class="${cls}"><td style="color:var(--muted);font-size:11px">${num||''}</td><td class="${sub?'sub':''}">${desc}</td><td class="r" style="color:#e74c3c">${bv!=null&&!isNaN(bv)?f(bv)+ds:'-'}</td><td class="r" style="color:#065f46">${cv!=null&&!isNaN(cv)?f(cv):'-'}</td></tr>`;
}
function secH(num,title){return `<tr class="sh"><td colspan="4"><span class="sn">${num}</span>${title}</td></tr>`;}
function totR(desc,bv,cv){return `<tr class="tot"><td></td><td><strong>${desc}</strong></td><td class="r"><strong>${bv!=null&&!isNaN(bv)?f(bv):'-'}</strong></td><td class="r"><strong>${cv!=null&&!isNaN(cv)?f(cv):'-'}</strong></td></tr>`;}

function calc(){
  const plotOwn=g('plotOwn'),plotSanc=g('plotSanc')||plotOwn,deductRd=g('deductRd');
  const auth=gs('auth'),rdw=parseInt(gs('rdw'));
  const amenInp=document.getElementById('amenity').value?parseFloat(document.getElementById('amenity').value):null;
  const recSp=g('recSp'),intRd=g('intRd');
  const bPlot=g('bPlot')||plotOwn,bBUA=g('bBUA'),exBUA=g('exBUA'),bTDR=g('bTDR'),bPrem=g('bPrem');
  if(!plotOwn||!socs.length){alert('Please enter Plot Area and at least one society.');return;}
  const baseFSI=BASE[auth]?.[rdw]||1.10;
  const totalConv=socs.reduce((s,x)=>s+(parseFloat(x.area)||0),0);
  const pend=socs.filter(s=>s.status!=='done');
  const instrL={chs:'Conveyance Deed',aoa:'Deed of Declaration (DOD)',condo:'DOD / MAOA 1970'};
  const typeL={chs:'CHS',aoa:'AOA',condo:'Condo'};

  // BUILDER'S (fraudulent) numbers
  const b_bal=bPlot-deductRd;                          // Row 03: Balance Area
  const b_recSp=recSp||b_bal*0.10;                     // Row 06: Open Space = 10% of Row 03 (Balance Area)
  const b_amen=amenInp!==null?amenInp:b_bal*AMEN;      // Row 04: Amenity = 15% of Balance Area
  const b_npa=b_bal-b_amen;                             // Row 05: NPA = Row 03 - Row 04
  const b_base=b_npa*baseFSI;                           // Row 09: Base BUA = NPA × baseFSI
  const b_maxP=b_npa*PREM;                              // Row 10a: Max Premium = NPA × 0.30
  const b_maxT=b_npa*TDR;                               // Row 11c: Max TDR = NPA × 0.70
  const b_slum=b_maxT*SLUM,b_res=b_maxT*RES;
  const b_totalFSI=b_base+bPrem+bTDR;                  // Row 13a: Total FSI = Base + Premium + TDR
  const b_balBUA=Math.max(0,b_totalFSI-exBUA);         // Row 13d: Balance = 13a - 13b (no Row 13c)
  const b_ancil=b_balBUA*ANCIL;                         // Row 13e: Ancillary = Balance × 0.60
  const b_totEnt=b_balBUA+b_ancil;                      // Row 13f: Total = 13d + 13e
  const b_maxAll=b_npa*(baseFSI+PREM+TDR);
  const b_ancMax=Math.max(0,b_maxAll-exBUA)*ANCIL;
  const b_totMax=b_maxAll+b_ancMax;

  // CORRECT numbers (after deducting conveyed society land)
  const c_plot=Math.max(0,plotOwn-totalConv);           // Correct plot = total - conveyed
  const c_bal=c_plot-deductRd;                          // Row 03: Correct Balance Area
  const c_recSp=c_bal*0.10;                             // Row 06: Open Space = 10% of correct Row 03
  const c_amen=c_bal*AMEN;                              // Row 04: Amenity = 15% of correct Balance
  const c_npa=Math.max(0,c_bal-c_amen);                 // Row 05: Correct NPA
  const c_base=c_npa*baseFSI;                           // Row 09: Correct Base BUA
  const c_maxP=c_npa*PREM;                              // Row 10a: Correct Max Premium
  const c_maxT=c_npa*TDR;                               // Row 11c: Correct Max TDR
  const c_slum=c_maxT*SLUM,c_res=c_maxT*RES;
  const c_totalFSI=c_base+Math.min(bPrem,c_maxP)+Math.min(bTDR,c_maxT); // Row 13a
  const c_balBUA=Math.max(0,c_totalFSI-exBUA);          // Row 13d: no Row 13c
  const c_ancil=c_balBUA*ANCIL;                          // Row 13e: Ancillary = Balance × 0.60
  const c_totEnt=c_balBUA+c_ancil;                       // Row 13f
  const c_maxAll=c_npa*(baseFSI+PREM+TDR);
  const c_ancMax=Math.max(0,c_maxAll-exBUA)*ANCIL;
  const c_totMax=c_maxAll+c_ancMax;

  const landFraud=Math.max(0,bPlot-c_plot-totalConv)||Math.max(0,b_npa-c_npa);
  const buaFraud=bBUA>0?Math.max(0,bBUA-c_totMax):0;

  // Hero
  document.getElementById('rConv').textContent=f(totalConv);
  const badges=[];
  if(pend.length>0)badges.push(`<span class="badge badge-r">⚠️ ${pend.length} Conveyance Pending</span>`);
  if(socs.filter(s=>s.status==='done').length>0)badges.push(`<span class="badge badge-g">✅ ${socs.filter(s=>s.status==='done').length} Conveyed</span>`);
  if(landFraud>100)badges.push(`<span class="badge badge-r">🚨 ${f0(landFraud)} sq.m. Society Land Misused</span>`);
  if(buaFraud>100)badges.push(`<span class="badge badge-r">🚨 BUA Overloading</span>`);
  document.getElementById('rBadges').innerHTML=badges.join('');

  // Info grid
  document.getElementById('rGrid').innerHTML=[
    {n:f(totalConv),l:'Total Conveyed (sq.m.)'},{n:f(c_plot),l:"Builder's Legit Land (sq.m.)"},{n:f(c_npa),l:'Correct NPA (sq.m.)'},
    {n:f(c_base),l:'Correct Base BUA'},{n:f(c_maxP),l:'Max Premium FSI'},{n:f(c_maxT),l:'Max TDR'},
    {n:f(c_ancil),l:'Ancillary (Bal×0.60)'},{n:f(c_totMax),l:'Max Total BUA (all FSI)'},
  ].map(x=>`<div class="ibox"><div class="inum">${x.n}</div><div class="ilbl">${x.l}</div></div>`).join('');

  // Area Statement Table
  let ast='';
  ast+=secH('01','AREA OF PLOT');
  ast+=row('a','As per Ownership Document',bPlot,plotOwn,'',true);
  ast+=row('','Less: Land Conveyed to Societies','—',totalConv,'',true);
  ast+=row('c','Minimum Consider Plot Area (correct)',bPlot,c_plot,'',true);
  ast+=secH('02','DEDUCTIONS FOR');
  ast+=row('a','Area under 15m+ Wide Road (surrender)',deductRd||0,deductRd||0,'',true);
  ast+=secH('03','BALANCE AREA OF PLOT (01 – 02a)');
  ast+=totR('Balance Area',b_bal,c_bal);
  ast+=secH('04','AMENITY SPACE @ 15% (Group Housing)');
  ast+=row('a','Required @ 15%',b_bal*AMEN,c_bal*AMEN,'',true);
  ast+=row('b','Proposed',b_amen,c_amen,'',true);
  ast+=secH('05','NET PLOT AREA — NPA (03 – 04b)');
  ast+=totR('Net Plot Area (NPA)',b_npa,c_npa);
  ast+=secH('06','RECREATIONAL OPEN SPACE — Row 06 (= 10% of Balance Area Row 03 — NOT deducted from NPA)');
  ast+=row('a','Required 10% of Balance Area Row 03',b_bal*0.10,c_bal*0.10,'',true);
  ast+=row('b','Proposed',b_recSp,c_recSp,'',true);
  ast+=secH('07','INTERNAL ROAD AREA (for reference — NOT deducted)');
  ast+=row('','Internal Road Area',intRd||0,intRd||0,'',true);
  ast+=secH('09','FSI PERMISSIBLE — BASE BUA (Row 09)');
  ast+=row('','Base FSI Rate',baseFSI+'x',baseFSI+'x','',true);
  ast+=row('','Base BUA (NPA × '+baseFSI+')',b_base,c_base,'',true);
  ast+=secH('10','PREMIUM FSI ON PAYMENT — Row 10 (Purchasable)');
  ast+=row('a','Max Permissible Premium FSI (NPA × 0.30)',b_maxP,c_maxP,'',true);
  ast+=row('b','Proposed Premium FSI by Builder',bPrem||0,Math.min(bPrem,c_maxP)||0,'',true);
  ast+=secH('11','IN-SITU FSI / TDR LOADING — Row 11c');
  ast+=row('c','TDR Permissible (NPA × 0.70)',b_maxT,c_maxT,'',true);
  ast+=row('','  ↳ Slum TDR (NPA × 0.70 × 0.30 = NPA × 0.21)',b_slum,c_slum,'',true);
  ast+=row('','  ↳ Reservation TDR (NPA × 0.70 × 0.70 = NPA × 0.49)',b_res,c_res,'',true);
  ast+=row('d','TDR Proposed by Builder',bTDR||0,Math.min(bTDR,c_maxT)||0,'',true);
  ast+=secH('13','TOTAL ENTITLEMENT OF FSI — Row 13');
  ast+=row('a','Total FSI [09 + 10(b) + 11(d)]',b_totalFSI,c_totalFSI,'',true);
  ast+=row('b','Less: Existing Built-Up Area (Row 13b)',exBUA||0,exBUA||0,'',true);
  ast+=row('d','Balance Built-Up Area (13a − 13b)',b_balBUA,c_balBUA,'',true);
  ast+=row('e','Ancillary Area (Balance × 0.60)',b_ancil,c_ancil,'',true);
  ast+=row('f','TOTAL (13d + 13e)',b_totEnt,c_totEnt,'',true);
  ast+=secH('14','MAXIMUM PERMISSIBLE F.S.I. (if all Base + Premium + TDR + Ancillary used)');
  ast+=totR('Max Total BUA (incl. Ancillary)',b_totMax,c_totMax);
  if(bBUA>0){
    const isFr=bBUA>c_totMax+50;
    ast+=secH('15','BUILDER\'S PROPOSED BUA vs CORRECT MAXIMUM');
    ast+=`<tr class="${isFr?'fr':'ok'}"><td></td><td><strong>Builder's Proposed BUA ${isFr?'🚨 EXCEEDS CORRECT MAXIMUM':''}</strong></td><td class="r"><strong>${f(bBUA)}</strong></td><td class="r"><strong>${isFr?'Max: '+f(c_totMax):'✅ Within limit'}</strong></td></tr>`;
  }
  document.getElementById('rAST').innerHTML=ast;

  // Alerts
  let al='';
  if(b_npa-c_npa>50){
    al+=`<div class="alert ar"><div class="at">🚨 Net Plot Area Inflated by ${f0(b_npa-c_npa)} sq.m. of Society Land</div>
    Builder's NPA: <strong>${f(b_npa)} sq.m.</strong> | Correct NPA: <strong>${f(c_npa)} sq.m.</strong><br/>
    This inflates every downstream figure: Base BUA, Premium cap, TDR cap, and Ancillary — all calculated as multiples of NPA.
    <br/><strong>UDCPR 2020 Reg. 2.2.3:</strong> FSI must be computed only on land owned by and in possession of the applicant.</div>`;
  }
  if(bBUA>0&&bBUA>c_totMax+50){
    al+=`<div class="alert ar"><div class="at">🚨 Proposed BUA ${f(bBUA)} sq.m. Exceeds Correct Maximum of ${f(c_totMax)} sq.m.</div>
    Excess: <strong>${f0(bBUA-c_totMax)} sq.m.</strong> — achievable only by including society land in FSI base.</div>`;
  }
  if(pend.length>0){
    al+=`<div class="alert ao"><div class="at">⚠️ Conveyance Pending for ${pend.length} Society</div>
    ${pend.map(s=>`• <strong>${s.name||'[Unnamed]'}</strong>: ${s.area||'?'} sq.m. — file Deemed Conveyance with DDR`).join('<br/>')}</div>`;
  }
  if(!al){al=`<div class="alert ag"><div class="at">✅ Calculations Complete</div>Enter builder's claimed BUA in inputs above to enable automatic fraud detection.</div>`;}
  document.getElementById('rAlerts').innerHTML=al;

  // Fraud tab
  document.getElementById('rFraud').innerHTML=`
  <div class="alert ab" style="margin-bottom:16px"><div class="at">ℹ️ How Ancillary Area Works (Row 13e)</div>
  Ancillary Area = <strong>Balance BUA × 0.60</strong> (NOT a separate FSI rate applied to NPA).<br/>
  Balance BUA = Total FSI entitlement (Row 13a) − Existing BUA (Row 13b)<br/>
  When builder inflates NPA by including society land, the Balance BUA inflates, and Ancillary inflates too — a cascading fraud effect.</div>
  <table class="as-table">
    <thead><tr><th>FSI Component</th><th class="r" style="color:#f87171">Builder (${f0(bPlot)} sq.m.)</th><th class="r" style="color:#6ee7b7">Correct (${f0(c_plot)} sq.m.)</th><th class="r">Excess</th></tr></thead>
    <tbody>
    ${[
      ['Net Plot Area (NPA)',b_npa,c_npa],
      ['Base FSI BUA (×'+baseFSI+')',b_base,c_base],
      ['Max Premium FSI (×0.30)',b_maxP,c_maxP],
      ['Max TDR (×0.70)',b_maxT,c_maxT],
      ['Max Total FSI BUA (×'+(baseFSI+PREM+TDR).toFixed(2)+')',b_maxAll,c_maxAll],
      ['Less: Existing BUA (Row 13b)',exBUA,exBUA],
      ['Balance BUA (Row 13d)',b_balBUA,c_balBUA],
      ['Ancillary Area — Row 13e (Balance×0.60)',b_ancil,c_ancil],
      ['TOTAL MAX PERMISSIBLE (13d+13e)',b_totMax,c_totMax],
    ].map(([l,bv,cv])=>{
      const ex=bv-cv;
      return `<tr ${Math.abs(ex)>0.5?'style="background:#fef2f2"':''}><td>${l}</td><td class="r" style="color:var(--red)">${f(bv)}</td><td class="r" style="color:#065f46">${f(cv)}</td><td class="r" style="${ex>0.5?'color:var(--red);font-weight:700':''}">${Math.abs(ex)>0.5?(ex>0?'+':'')+f0(ex):'—'}</td></tr>`;
    }).join('')}
    ${bBUA>0?`<tr class="${bBUA>c_totMax+50?'fr':'ok'}"><td><strong>Builder's ACTUAL Proposed BUA</strong></td><td class="r"><strong>${f(bBUA)}</strong></td><td class="r"><strong>${f(c_totMax)}</strong></td><td class="r"><strong>${bBUA>c_totMax+50?'🚨 +'+f0(bBUA-c_totMax):'✅ OK'}</strong></td></tr>`:''}
    </tbody>
  </table>
  ${bBUA>0&&bBUA>c_totMax+50?`<div class="alert ar" style="margin-top:14px"><div class="at">🚨 Mathematical Conclusion</div>
  On legitimate land of <strong>${f(c_plot)} sq.m.</strong>, max BUA (base + full premium + full TDR + full ancillary) = <strong>${f(c_totMax)} sq.m.</strong><br/>
  Builder proposes <strong>${f(bBUA)} sq.m.</strong> — excess of <strong>${f0(bBUA-c_totMax)} sq.m.</strong><br/>
  This is achievable ONLY by loading FSI on the <strong>${f0(totalConv)} sq.m.</strong> of society land included in the area statement.<br/>
  <strong>Cite:</strong> UDCPR 2020 Reg. 2.2.3, MRTP Act S.45/51</div>`:''}`;

  // Workings
  document.getElementById('rMath').innerHTML=`<div>
<span class="eq dim">═══ BUILDER'S CALCULATION (Including Society Land — ALLEGED) ═══</span>
<span class="eq">01.</span> Plot claimed                              = <span class="bad">${f(bPlot)}</span>
<span class="eq">03.</span> Balance (01 - Road deduct ${f(deductRd)})           = <span class="bad">${f(b_bal)}</span>
<span class="eq">04.</span> Amenity 15%                                = ${f(b_amen)}
<span class="eq">05.</span> Net Plot Area (NPA)                        = <span class="bad">${f(b_npa)}</span>
<span class="eq">06.</span> Rec. Open Space (10% of Row 03 bal)     = ${f(b_bal*0.10)} <span class="dim">(NOT deducted from NPA)</span>
<span class="eq">09.</span> Base BUA (${f(b_npa)} × ${baseFSI})                  = <span class="bad">${f(b_base)}</span>
<span class="eq">10a.</span> Max Premium (NPA × 0.30)                  = <span class="bad">${f(b_maxP)}</span>
<span class="eq">11c.</span> Max TDR (NPA × 0.70)                      = <span class="bad">${f(b_maxT)}</span>
<span class="dim">      Slum TDR (×0.21): ${f(b_slum)}  |  Res TDR (×0.49): ${f(b_res)}</span>
<span class="eq">13a.</span> Total FSI (Base+Prem+TDR)                 = <span class="bad">${f(b_totalFSI)}</span>
<span class="eq">13b.</span> Less Existing BUA                          = ${f(exBUA)}
<span class="eq">13d.</span> Balance BUA (13a − 13b)                   = <span class="bad">${f(b_balBUA)}</span>
<span class="eq">13e.</span> Ancillary (${f(b_balBUA)} × 0.60)               = <span class="bad">${f(b_ancil)}</span>
<span class="eq">13f.</span> Total Entitlement (13d+13e)                = <span class="bad">${f(b_totEnt)}</span>
      Max possible (all FSI+ancil)               = <span class="bad">${f(b_totMax)}</span>

<div class="rule"></div>
<span class="eq dim">═══ CORRECT CALCULATION (Excluding ${f(totalConv)} sq.m. Conveyed) ═══</span>
<span class="eq">01.</span> Plot (${f(plotOwn)} - conveyed ${f(totalConv)})      = <span class="good">${f(c_plot)}</span>
<span class="eq">03.</span> Balance (01 - Road deduct)                  = <span class="good">${f(c_bal)}</span>
<span class="eq">04.</span> Amenity 15%                                = ${f(c_amen)}
<span class="eq">05.</span> Net Plot Area (NPA)                        = <span class="good">${f(c_npa)}</span>
<span class="eq">06.</span> Rec. Open Space (10% of Row 03 bal)     = ${f(c_bal*0.10)} <span class="dim">(NOT deducted from NPA)</span>
<span class="eq">09.</span> Base BUA (${f(c_npa)} × ${baseFSI})                  = <span class="good">${f(c_base)}</span>
<span class="eq">10a.</span> Max Premium (NPA × 0.30)                  = <span class="good">${f(c_maxP)}</span>
<span class="eq">11c.</span> Max TDR (NPA × 0.70)                      = <span class="good">${f(c_maxT)}</span>
<span class="dim">      Slum TDR (×0.21): ${f(c_slum)}  |  Res TDR (×0.49): ${f(c_res)}</span>
<span class="eq">13a.</span> Total FSI (Base+Prem+TDR)                 = <span class="good">${f(c_totalFSI)}</span>
<span class="eq">13b.</span> Less Existing BUA                          = ${f(exBUA)}
<span class="eq">13d.</span> Balance BUA (13a − 13b)                   = <span class="good">${f(c_balBUA)}</span>
<span class="eq">13e.</span> Ancillary (${f(c_balBUA)} × 0.60)               = <span class="good">${f(c_ancil)}</span>
<span class="eq">13f.</span> Total Entitlement (13d+13e)                = <span class="good">${f(c_totEnt)}</span>
      Max possible (all FSI+ancil)               = <span class="good">${f(c_totMax)}</span>

<div class="rule res">LAND FRAUDULENTLY INCLUDED:  ${f0(totalConv-(plotOwn-bPlot)>0?bPlot-c_plot:b_npa-c_npa)} sq.m. of society land
EXCESS BUA VIA FRAUD:        ${bBUA>0?f0(bBUA-c_totMax)+' sq.m.':'(enter builder BUA to calculate)'}
CORRECT MAX PERMISSIBLE BUA: ${f(c_totMax)} sq.m.</div></div>`;

  // Legal doc
  const today=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  document.getElementById('rDoc').textContent=`AREA STATEMENT — CONVEYED LAND & FSI ENTITLEMENT
Based on UDCPR 2020 | PMRDA Area Statement Format
Date: ${today}

A. LAND CONVEYED TO SOCIETIES
${socs.map((s,i)=>`  ${i+1}. ${s.name||'[Name]'} (${typeL[s.type]||s.type})
     Area: ${parseFloat(s.area)||0} sq.m. | Flats: ${s.flats||'—'} | ${instrL[s.type]||'—'} | ${s.status==='done'?'CONVEYED':s.status==='partial'?'PARTIAL':'PENDING'}`).join('\n')}
  ─────────────────────────────
  TOTAL CONVEYED: ${f(totalConv)} sq.m.

B. AREA STATEMENT (UDCPR Format — Correct Figures)
  Row 01a  Plot (Ownership Doc)          : ${f(plotOwn)} sq.m.
           Less: Conveyed to Societies   : ${f(totalConv)} sq.m.
           Correct Plot Area             : ${f(c_plot)} sq.m.
  Row 02a  Less: Road Deduction          : ${f(deductRd)} sq.m.
  Row 03   Balance Area                  : ${f(c_bal)} sq.m.
  Row 04b  Amenity Space (15%)           : ${f(c_amen)} sq.m.
  Row 05   NET PLOT AREA (NPA)           : ${f(c_npa)} sq.m.
  Row 06a  Rec. Open Space (10% of Row 03)  : ${f(c_bal*0.10)} sq.m. (NOT deducted from NPA)
  Row 07   Internal Road Area               : ${f(intRd)} sq.m. (NOT deducted)
  Row 09   Base FSI BUA (×${baseFSI})         : ${f(c_base)} sq.m.
  Row 10a  Max Premium FSI (NPA×0.30)    : ${f(c_maxP)} sq.m.
  Row 11c  Max TDR (NPA×0.70)            : ${f(c_maxT)} sq.m.
             Slum TDR (NPA×0.21)         : ${f(c_slum)} sq.m.
             Res. TDR (NPA×0.49)         : ${f(c_res)} sq.m.
  Row 13a  Total FSI Entitlement         : ${f(c_totalFSI)} sq.m.
  Row 13b  Less Existing BUA             : ${f(exBUA)} sq.m.
  Row 13d  Balance BUA                   : ${f(c_balBUA)} sq.m.
  Row 13e  Ancillary (Balance × 0.60)    : ${f(c_ancil)} sq.m.
  Row 13f  Total Entitlement (13d+13e)   : ${f(c_totEnt)} sq.m.
  Row 14   MAX PERMISSIBLE BUA           : ${f(c_totMax)} sq.m.
           (Base + Full Premium + Full TDR + Ancillary)
${bBUA>0?`
C. BUILDER'S PROPOSED vs CORRECT
  Builder's Claimed Plot Area     : ${f(bPlot)} sq.m.
  Correct Plot Area               : ${f(c_plot)} sq.m.
  Society Land Fraudulently Used  : ${f0(bPlot-c_plot)} sq.m.
  Builder's Proposed Total BUA    : ${f(bBUA)} sq.m.
  Correct Maximum Permissible BUA : ${f(c_totMax)} sq.m.
  EXCESS (via society land fraud) : ${f0(Math.max(0,bBUA-c_totMax))} sq.m.
`:''}
D. LEGAL BASIS
  1. UDCPR 2020 Reg. 2.2.3 — FSI only on owned/possessed land
  2. UDCPR 2020 Reg. 1.4(v),(vi) — FSI base must exclude conveyed land
  3. MOFA 1963 S.11 — Builder must convey land to society
  4. MCS Act 1960 S.11(3) — Deemed Conveyance right of society
  5. MRTP Act 1966 S.45/51 — Illegal development = revocation
  6. Row 13e: Ancillary = Balance BUA × 0.60 (not a separate FSI rate)
  7. Row 10a: Premium FSI = NPA × 0.30 (purchasable on payment)
  8. Row 11c: TDR = NPA × 0.70 (Slum 0.21 + Reservation 0.49)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prepared by: [Society Secretary]  Date: ${today}
[Signature]              [Society Stamp]`;

  // Steps
  document.getElementById('rSteps').innerHTML=`<div class="sl">${[
    {n:'1',c:'#0369a1',t:'File RTI for Builder\'s Area Statement',d:'Apply to PMRDA/PMC under RTI Act 2005 for certified copy of the area statement, FSI calculation sheet, and ownership documents submitted by the builder. Compare their Row 01c (plot area) with your correct figure — this is the smoking gun.'},
    {n:'2',c:'#065f46',t:'Use This Statement as Exhibit',d:'Attach this area statement to your complaint to PMRDA, DDR, RERA, or court. It mirrors the official PMRDA format row-by-row and shows exactly how much FSI is over-claimed at each step — Base BUA, Premium, TDR, and Ancillary.'},
    ...(pend.length>0?[{n:'3',c:'#92400e',t:'File Deemed Conveyance for Pending Societies',d:pend.map(s=>s.name||'[Society]').join(', ')+' — file under Section 11 MCS Act with DDR. Once registered, 7/12 mutation updates and builder loses legal claim on that land area.'}]:[]),
    {n:'4',c:'#e74c3c',t:'File PMRDA Objection Under MRTP Act Section 51',d:`State that the building permission is based on inflated plot area of ${f0(bPlot)} sq.m. instead of legitimate ${f0(c_plot)} sq.m. Attach this area statement. Demand revocation under MRTP Act Section 51.`},
    {n:'5',c:'#7c3aed',t:'Pass MC Resolution Protecting FSI Rights',d:`Pass resolution: "This society does not consent to pooling of FSI from our ${f(totalConv)} sq.m. conveyed land with any other plot or developer." File with PMRDA, Sub-Registrar, and society records.`},
  ].map(s=>`<div class="si" style="border-left:4px solid ${s.c}"><div class="sn2" style="background:${s.c}">${s.n}</div><div><div class="st">${s.t}</div><div class="sd">${s.d}</div></div></div>`).join('')}</div>`;

  document.getElementById('results').classList.add('show');
  document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'});
}

function cpDoc(){navigator.clipboard.writeText(document.getElementById('rDoc').textContent).then(()=>alert('Copied!'));}
function reset(){socs=[];rSocs();['plotOwn','plotSanc','amenity','bPlot','bBUA'].forEach(id=>document.getElementById(id).value='');['deductRd','recSp','intRd','exBUA','bTDR','bPrem'].forEach(id=>document.getElementById(id).value='0');document.getElementById('results').classList.remove('show');}
function loadEx(){
  document.getElementById('plotOwn').value='97700';document.getElementById('plotSanc').value='97700';document.getElementById('deductRd').value='0';
  document.getElementById('auth').value='pmrda';document.getElementById('rdw').value='12';
  document.getElementById('amenity').value='14655';document.getElementById('recSp').value='9900';document.getElementById('intRd').value='5812';
  document.getElementById('bPlot').value='97700';document.getElementById('bBUA').value='107564';
  document.getElementById('exBUA').value='51435';document.getElementById('bTDR').value='0';document.getElementById('bPrem').value='0';
  socs=[];
  [{name:'Solacia Phase I Apartment Association',type:'aoa',flats:320,area:21900,status:'done'},{name:'Solacia Phase II Apartment Association',type:'aoa',flats:280,area:14000,status:'done'},{name:'RMC Garden Phase III Condominium',type:'condo',flats:80,area:4151,status:'done'},{name:'RMC Garden Phase I CHS Ltd.',type:'chs',flats:110,area:10392,status:'done'},{name:'Supreme Angan CHS Ltd.',type:'chs',flats:150,area:12000,status:'done'},{name:'Ganga Alfa CHS Ltd.',type:'chs',flats:90,area:5131,status:'done'},{name:'Solacia E1 & E2 CHS Ltd.',type:'chs',flats:120,area:4600,status:'done'}]
  .forEach(s=>addSoc(s));
}
rSocs();
</script>
</body>
</html>
