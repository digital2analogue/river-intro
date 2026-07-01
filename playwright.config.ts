import { defineConfig, devices } from '@playwright/test'

// Visual regression tests. Screenshots are compared against committed
// baselines in tests/visual/__screenshots__/ (linux baselines, matching CI).
// Regenerate after intentional visual changes:
//   npm run test:visual:update
export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}-{platform}{ext}',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
      : {}),
    baseURL: 'http://localhost:8087',
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npx http-server . -p 8087 -s',
    url: 'http://localhost:8087',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
