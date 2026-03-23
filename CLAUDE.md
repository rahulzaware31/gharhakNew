# GharHak — Claude Code Instructions

## Project Overview
GharHak is a free public platform for Maharashtra flat owners and housing society members to understand and assert their legal rights. Built with React (CRA), targeting Cloudflare Pages deployment.

## Tech Stack
- React 18 (Create React App)
- Custom CSS (no CSS framework — all variables in src/index.css)
- Anthropic API for AI chat and document generation (browser-direct)
- No backend — fully static

## Key Conventions

### State-Based Routing
We use `navigate(pageName, data)` from AppContext — NOT React Router Links.
- Never add `<Link>` or `useNavigate()` from react-router-dom
- Always use `const { navigate } = useContext(AppContext)`

### CSS Classes
All styles live in `src/index.css`. Add new component styles there.
Never use inline styles for layout — use CSS classes from index.css.
Exception: dynamic colors (e.g. per-issue card color) use inline style with CSS variable.

### Fonts
- English text: default (Bricolage Grotesque via body font-family)
- Marathi text: always add className="mr" to apply Noto Sans Devanagari

### Data
All content (issues, laws, steps, templates) lives in `src/data/issues.js`.
Never hardcode issue content inside components — always import from data/issues.js.

### API Calls
Anthropic API calls use `anthropic-dangerous-direct-browser-access: true` header.
Model: `claude-sonnet-4-20250514`
Max tokens: 1000

## Design System Tokens (from index.css)
```
--teal: #00c896        Primary accent
--teal-dark: #00a87d   Hover
--teal-light: #e6faf5  Light bg
--dark: #0f1923        Dark sections
--text-muted: #6b7a8d  Secondary text
--border: #e2e8f0      Borders
--radius: 16px         Card radius
--shadow: 0 4px 24px rgba(15,25,35,0.08)
```

## Adding Features
1. Add data to `src/data/issues.js` first
2. Add CSS classes to `src/index.css`
3. Create/modify page in `src/pages/`
4. Add navigation in `src/App.js` if new top-level page

## Build & Deploy
```bash
npm install --legacy-peer-deps
npm run build
# Upload build/ folder to Cloudflare Pages
```

## Legal Disclaimer
Always include this disclaimer on any generated legal content:
"This platform provides general legal information only. It is not a substitute for professional legal advice. For court proceedings, consult a qualified advocate."
