# User Guide: Working With This Codex Project

This document explains how to work with this repository in a way that matches the runtime and agent rules currently configured for this project.

## 1) What this project contains

This repository is a React web app with pages and shared components under `src/`, plus a Cloudflare worker under `worker/`.

- Front-end entry points: `src/index.js`, `src/App.js`
- Pages: `src/pages/*`
- Shared components: `src/components/*`
- Worker: `worker/api-proxy.js`, `worker/wrangler.toml`

## 2) Ground rules for agent-assisted changes

When asking the agent to make edits, these conventions apply:

1. **Follow AGENTS instructions by scope**
   - If one or more `AGENTS.md` files exist, the instructions apply to files in their directory tree.
   - More deeply nested `AGENTS.md` instructions override broader ones.

2. **Use skills when requested or clearly applicable**
   - Skills are defined by `SKILL.md` files and should be loaded only as needed.
   - Only the minimal relevant skill(s) should be used.

3. **Command-line expectations**
   - Prefer `rg` over recursive `ls -R` or `grep -R`.
   - Run commands non-interactively.

4. **Git workflow requirements**
   - If files were changed, commit those changes.
   - After committing, create a PR message via the configured `make_pr` tool.
   - Never finish in an in-between state (changed+committed but no PR message, or PR message without commit).

5. **Final response format expectations**
   - Include a concise summary of edits.
   - Include checks/tests run, each prefixed with:
     - `✅` pass
     - `⚠️` warning (environment limitation)
     - `❌` fail (agent error)
   - Include file+line citations in the required format.

## 3) How to request work effectively

Use specific requests so the agent can execute in one pass:

- Good: “Add a FAQ section to `HomePage` and update navbar links. Run build and commit.”
- Better: “Update copy, keep styles unchanged, and include screenshot if visual changes occur.”

Helpful details to include:

- Exact file(s) to target (if known)
- Desired behavior and constraints
- Whether to prioritize speed or completeness
- Whether you want tests/build run before commit

## 4) Typical workflow

1. Define task and acceptance criteria.
2. Agent inspects repo and relevant instructions.
3. Agent edits files.
4. Agent runs checks (build/tests/lint as appropriate).
5. Agent commits with clear message.
6. Agent drafts PR title/body with a short implementation summary.
7. Agent returns final report with citations.

## 5) Recommended checks by change type

- **UI/text changes only**: run front-end build at minimum.
- **Logic changes**: run build and targeted tests (if present).
- **Worker changes**: validate worker config/script and run any worker checks available.

## 6) Screenshot guidance

If a user-facing visual component changed (style/layout/new button/page), include a screenshot using the available browser tooling.

If screenshot tooling is unavailable, explicitly note that limitation in the final report.

## 7) Commit and PR writing tips

### Commit message

Use imperative, scoped messages:

- `docs: add user guide for codex workflow`
- `feat(checklist): add ownership transfer reminders`
- `fix(worker): handle empty auth header`

### PR title/body

- Title should be short and outcome-focused.
- Body should include:
  - What changed
  - Why
  - Any testing/checks run
  - Risks or follow-ups

## 8) Troubleshooting

- If instructions conflict, apply precedence:
  1) system/developer/user prompt
  2) nearest-scope `AGENTS.md`
  3) broader-scope `AGENTS.md`
- If a skill is missing or unreadable, proceed with best-effort fallback and state it clearly.

## 9) Quick request templates

- “Please update `src/pages/HomePage.js` hero copy to X, run build, commit, and prepare PR text.”
- “Create a new page based on `ChecklistPage`, wire route in `App.js`, and include screenshot.”
- “Refactor `api-proxy.js` for readability without behavior changes; run checks and commit.”

## 10) WizardPage data expectations (current)

For `src/pages/WizardPage.js`, current expectations are:

- Issue categories are grouped under six buckets (`society`, `builder`, `rera`, `pmc`, `ownership`, `infra`).
- Keep legacy issues available while adding granular issue types.
- Every issue object should include complete legal guidance fields:
  - `id`, `group`, `icon`, `color`, `title`, `titleMr`, `desc`
  - `subIssues`, `laws`, `authorities`, `docs`, `timeline`, `steps`, `draftLetter`
- Step 1 should support grouped rendering and search-based filtering without changing Steps 2–5 behavior.

---

If you want, I can also generate a shorter **one-page cheat sheet** version of this guide for non-technical stakeholders.
