# GharHak — Maharashtra Housing Rights Platform
## Claude Code Development Guide

---

## Project Structure

```
gharhak/
├── public/
│   └── index.html              # HTML shell with Google Fonts
├── src/
│   ├── index.js                # React entry point
│   ├── index.css               # Global design system (CSS variables, all components)
│   ├── App.js                  # Root app, routing, AppContext
│   ├── data/
│   │   └── issues.js           # All issue categories, laws, complaint steps, doc templates
│   ├── components/
│   │   ├── Navbar.js           # Top navigation
│   │   ├── Ticker.js           # Scrolling rights ticker
│   │   └── Footer.js           # Footer with disclaimer
│   └── pages/
│       ├── HomePage.js         # Landing page, hero, issue grid, features
│       ├── IssuePage.js        # Detailed view for each issue category
│       ├── ChatPage.js         # AI advisor chat (Anthropic API)
│       ├── WizardPage.js       # 4-step complaint wizard
│       └── DocGeneratorPage.js # Document generator with AI drafting
└── package.json
```

---

## Design System (src/index.css)

### Brand Colors
```css
--teal: #00c896          /* Primary accent */
--teal-dark: #00a87d     /* Hover state */
--teal-light: #e6faf5    /* Light backgrounds */
--dark: #0f1923          /* Dark sections, footer */
--dark-2: #1a2636        /* Secondary dark */
```

### Fonts
- **Bricolage Grotesque** — headings, UI (English)
- **Noto Sans Devanagari** — Marathi text (add `.mr` class)

---

## AI Integration (Anthropic API)

### Chat Page (ChatPage.js)
- Uses `claude-sonnet-4-20250514` with Maharashtra housing law system prompt
- Requires API key via `anthropic-dangerous-direct-browser-access: true` header
- Quick question buttons for common issues
- Bilingual: English + Marathi responses

### Document Generator (DocGeneratorPage.js)
- AI generates full legal document text on demand
- Falls back to template-based generation if API unavailable

### ⚠️ API Key Setup
The app uses browser-direct API calls. For production deployment:
1. **Cloudflare Pages** — add a Cloudflare Worker as proxy (recommended)
2. **Never hardcode API key in source** — use environment variable via proxy
3. For local testing only: you can temporarily add key to the fetch headers

---

## Routing (App.js)

Uses custom React state-based routing (no React Router dependency in runtime):

```js
navigate('home')     // Home page
navigate('chat')     // AI Chat
navigate('wizard')   // Complaint Wizard
navigate('docs')     // Document Generator
navigate('issue')    // Issue detail (requires selectedIssue in context)
```

---

## Adding New Issue Categories (src/data/issues.js)

Add to `ISSUE_CATEGORIES` array:
```js
{
  id: "your_id",
  icon: "🏷️",
  title: "English Title",
  titleMr: "मराठी शीर्षक",
  description: "Short description",
  color: "#hexcolor",
  laws: ["Act Name Section X", ...],
  authorities: ["Authority 1", "Authority 2"],
  commonIssues: ["Issue 1", "Issue 2", "Issue 3", "Issue 4"],
}
```

Add complaint steps in `COMPLAINT_STEPS`:
```js
your_id: [
  { step: 1, action: "Action Name", detail: "Detailed instructions..." },
  ...
]
```

---

## Adding New Document Templates

Add to `DOCUMENT_TEMPLATES` in issues.js:
```js
{
  id: "template_id",
  title: "English Title",
  titleMr: "मराठी शीर्षक",
  category: "issue_category_id",
  fields: ["societyName", "builderName", "issueDescription", ...],
}
```

Add icon in `DocGeneratorPage.js`:
```js
const DOC_ICONS = {
  template_id: '📄',
  ...
}
```

Available field names: `societyName`, `builderName`, `address`, `issueDescription`, `demand`, `complainantName`, `projectName`, `reraRegNo`, `reliefSought`, `applicantName`, `informationSought`, `authority`, `regNo`, `resolutionSubject`, `resolutionText`, `plotDetails`, `dateOfPossession`, `accusedName`, `incidentDescription`, `witnesses`

---

## Deployment to Cloudflare Pages

### Option A — Direct Build Upload
1. Run `npm run build` locally
2. Upload the `build/` folder (as zip) to Cloudflare Pages dashboard
3. Set Build command: `npm run build`, Output directory: `build`

### Option B — GitHub + Cloudflare Pages (Recommended)
1. Push source to GitHub repo
2. Connect repo in Cloudflare Pages
3. Build command: `npm run build`
4. Build output directory: `build`
5. Add environment variables for API proxy

### API Proxy (Cloudflare Worker)
Create a Worker to proxy Anthropic API calls:
```js
// worker.js
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    const body = await request.json();
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    return new Response(await resp.text(), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://gharhak.pages.dev',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

---

## Planned Features (Next Phases)

### Phase 2
- [ ] Marathi full UI translation toggle
- [ ] Authority contact directory (PMRDA, DDR offices, Consumer Forum)
- [ ] Case timeline tracker (per society)
- [ ] WhatsApp share of action plan

### Phase 3
- [ ] RTI portal links with pre-filled forms
- [ ] MahaRERA project verification lookup
- [ ] Map of Pune/Maharashtra planning authorities
- [ ] Community forum for society members

### Phase 4
- [ ] Society registration (for updates, federation)
- [ ] Document storage (encrypted, per society)
- [ ] Advocate directory (Maharashtra housing law specialists)
- [ ] Success stories / case outcomes

---

## Key Legal References Built In

| Law | Coverage |
|-----|----------|
| MCS Act 1960 | Society governance, elections, maintenance, conveyance |
| MOFA 1963 | Builder obligations, OC, flat allotment |
| MahaRERA 2016 | Project registration, delays, complaints |
| UDCPR 2020 | FSI rules, Regulation 2.2.3, 1.4 |
| MRTP Act 1966 | Section 51, illegal construction, layout |
| Consumer Protection 2019 | Deficiency of service |
| Maharashtra Apartment Ownership Act 1970 | Condominium rights |
| SC Parking Judgment 2010 | Open parking cannot be sold |

