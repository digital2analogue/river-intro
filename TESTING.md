# Testing Guide — river-intro

This guide explains how to run unit and visual regression tests for the River intro page.

## Quick Start

```bash
# Install dependencies
npm install

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:ui

# Run visual regression tests (requires local server on http://localhost:8000)
npm run test:visual

# Run visual regression tests in headed mode
npx playwright test --headed
```

## Unit Testing (Vitest)

Unit tests validate utility functions and business logic for the intro page.

**Framework:** Vitest (modern, fast, ESM-first)  
**Test files:** `tests/unit/**/*.spec.ts`  
**Environment:** Node.js

### Example unit test

```typescript
// tests/unit/utils.spec.ts
import { describe, it, expect } from 'vitest'

describe('Utility Functions', () => {
  it('calculates animation timing', () => {
    const duration = 1000
    const delay = 100
    const total = duration + delay
    expect(total).toBe(1100)
  })
})
```

### Run unit tests

```bash
# Run all unit tests
npm run test

# Run in watch mode (re-runs on file changes)
npm run test:ui

# Run a specific test file
npm run test tests/unit/example.spec.ts

# Run tests matching a pattern
npm run test -- --grep "animation"
```

## Visual Regression Testing (Playwright)

Visual regression tests compare screenshots of the intro page against baselines to catch unintended visual changes.

**Framework:** Playwright (open-source, powerful)  
**Test files:** `tests/visual/**/*.spec.ts`

### How it works

1. **First run** — Playwright captures screenshots and saves them as baselines
2. **Subsequent runs** — New screenshots are compared against baselines
3. **Review changes** — If changes are intentional, update baselines with `--update-snapshots`

### Run visual tests

```bash
# Run all visual regression tests (local server required)
npm run test:visual

# Start local server (in one terminal)
npx http-server . -p 8000

# Run tests in another terminal
npm run test:visual

# Run in headed mode (see browser)
npx playwright test --headed

# Update baselines after intentional visual changes
npm run test:visual -- --update-snapshots

# Run a specific test
npx playwright test page.spec.ts

# Debug with step-by-step execution
npx playwright test --debug
```

## Testing the Intro Page

The River intro page with animated backgrounds and dithered images is perfect for visual regression testing:

```typescript
// tests/visual/page.spec.ts
import { test, expect } from '@playwright/test'

test('page renders with animations', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Capture full page including background animations
  await expect(page).toHaveScreenshot('page-full.png')
})

test('background image loads', async ({ page }) => {
  await page.goto('/')
  
  // Verify the background GIF loads
  const bgImage = await page.locator('img[src*="bg.gif"]')
  // Update selector based on actual HTML structure
  
  await expect(bgImage).toBeVisible()
})
```

## CI/CD Integration

Both test suites run in CI environments:
- Single worker for visual test consistency
- 2 retries for flaky network conditions
- HTML reports in `test-results/`

## Best Practices

- **Snapshot the full page** — Captures overall layout and animations
- **Test responsive breakpoints** — Add tests for mobile/tablet sizes
- **Update baselines carefully** — Review diffs before approving
- **Run locally before pushing** — Catch flaky tests early

## Troubleshooting

**"Server not responding"** — Start the local server:
```bash
npx http-server . -p 8000
```

**Visual test fails with flake** — Images loading may be inconsistent. Add explicit waits:
```typescript
await page.waitForLoadState('networkidle')
await page.locator('img').first().waitFor()
```

**Snapshot mismatch after CSS changes** — Review the diff in the HTML report, then update:
```bash
npm run test:visual -- --update-snapshots
```

## Local Development

Start a local server for development:

```bash
npm run dev
# Opens http://localhost:8000 in your browser
```

Then run tests against it:

```bash
npm run test:visual
```
