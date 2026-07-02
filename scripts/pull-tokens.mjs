/**
 * scripts/pull-tokens.mjs
 *
 * Refreshes ./variables.css from the installed @digital2analogue2/parsimony
 * package (base dark theme). river-intro is a static site with no build step,
 * so tokens are pulled into a committed file by running this script — NOT
 * @import'd at deploy time (@import fails on plain-HTML static deploys).
 *
 * Usage:
 *   npm install          # fetch / update @digital2analogue2/parsimony
 *   npm run pull-tokens  # copy its base CSS into variables.css
 *
 * variables.css is a generated, committed artifact — do not hand-edit it.
 * river-intro's portfolio-context fluid responsive overrides live separately
 * in tokens.overrides.css (hand-authored), linked after variables.css.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const PKG_DIR = path.join(root, 'node_modules', '@digital2analogue2', 'parsimony');
const SRC = path.join(PKG_DIR, 'css', 'variables.css');
const OUT = path.join(root, 'variables.css');

if (!fs.existsSync(SRC)) {
  console.error('\n  ❌ @digital2analogue2/parsimony is not installed. Run: npm install\n');
  process.exit(1);
}

fs.copyFileSync(SRC, OUT);

let version = 'unknown';
try {
  version = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf8')).version;
} catch { /* informational only */ }

console.log(`\n  ✓ variables.css refreshed from @digital2analogue2/parsimony@${version}\n`);
