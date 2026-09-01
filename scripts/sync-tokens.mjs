/**
 * scripts/sync-tokens.mjs
 *
 * Freshness check for the token pipeline. Because river-intro *inlines* its
 * tokens into a committed variables.css (see pull-tokens.mjs), staleness can
 * happen in two independent places, and this checks both:
 *
 *   1. INSTALLED vs PUBLISHED — is the dependency behind the latest published
 *      @digital2analogue2/parsimony?
 *   2. COMMITTED vs INSTALLED — does variables.css still match the installed
 *      package? This axis does not exist for consumers that `@import` the
 *      package directly; here it is a real gap, because bumping the dependency
 *      without re-running `pull-tokens` leaves the site shipping the old values
 *      while package.json claims the new ones.
 *
 * Usage:
 *   npm run sync-tokens
 *
 * Exits 1 if either axis is stale, 0 if both are current. A network failure on
 * axis 1 is not a failure — it degrades to checking axis 2 only, so the check
 * never goes red merely because npm was unreachable.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const PKG = '@digital2analogue2/parsimony';
const PKG_DIR = path.join(root, 'node_modules', '@digital2analogue2', 'parsimony');
const SRC = path.join(PKG_DIR, 'css', 'variables.css');
const OUT = path.join(root, 'variables.css');

if (!fs.existsSync(SRC)) {
  console.error(`\n  ❌ ${PKG} is not installed. Run: npm install\n`);
  process.exit(1);
}

const installed = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf8')).version;

let stale = false;

// ── 1. installed vs published ──────────────────────────────────────────────
let latest = null;
try {
  latest = execSync(`npm view ${PKG} version`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  // Unreachable registry is not staleness — say so and fall through to axis 2.
}

console.log(`\n  ${PKG}`);
console.log(`    installed: ${installed}`);
if (latest === null) {
  console.log(`    published: (could not reach npm — skipping this axis)`);
} else {
  console.log(`    published: ${latest}`);
  if (installed !== latest) {
    stale = true;
    console.error(`\n  ❌ Behind the published tokens.`);
    console.error(`     Run: npm install ${PKG}@${latest} && npm run pull-tokens`);
  }
}

// ── 2. committed variables.css vs installed package ────────────────────────
const committed = fs.readFileSync(OUT, 'utf8');
const packaged = fs.readFileSync(SRC, 'utf8');

if (committed === packaged) {
  console.log(`\n  ✓ variables.css matches the installed package.`);
} else {
  stale = true;
  console.error(`\n  ❌ variables.css does NOT match the installed ${PKG}@${installed}.`);
  console.error(`     The committed tokens and the dependency have diverged —`);
  console.error(`     someone bumped the package without re-running the refresh.`);
  console.error(`     Run: npm run pull-tokens`);
}

if (stale) {
  console.error('');
  process.exit(1);
}

console.log(`\n  ✓ Tokens are current on both axes.\n`);
