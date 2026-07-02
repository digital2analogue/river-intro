# river-intro

River Romney's intro/link page — a single static HTML page (no framework, no build step). Four deployed files: `index.html`, `style.css`, `bg.gif`, `dithered.jpg`.

## Hosting

Deployed on **Vercel** (project `river-intro`, Git-linked): every merge to `main` auto-deploys to **www.riverromney.com** (`riverromney.com` redirects 308 to www). DNS is at Porkbun (apex A + www CNAME → Vercel; MX/TXT are email — never touch). Migrated from Netlify 2026-07 (issue #14); the old `master` branch is deleted — `main` is the only branch.

`.vercelignore` keeps the deployment to the four site files; `vercel.json` enables clean URLs. Tokens come from brand-tokens via `npm run pull-tokens` (inlined into the CSS, not a runtime dependency).

## Commands

```bash
npm run dev            # http-server on :8000
npm run pull-tokens    # Refresh inlined design tokens from @digital2analogue2/parsimony
npm run test           # Vitest unit tests (HTML structure, rel=noopener, referenced assets exist)
npm run test:visual    # Playwright visual regression (animated bg.gif is neutralized during capture)
```

## Testing & Automation

CI (`.github/workflows/ci.yml`) runs unit tests (`checks`) and visual regression (`visual`) — both blocking, required by branch protection on `main`.

**Visual baselines are generated ON the CI runner, never locally** — after an intentional visual change, run the "Update visual baselines" workflow from the Actions tab. Dependabot files weekly grouped bumps; the `dependabot-automerge` workflow merges them once CI passes (major npm bumps stay manual).
