import { test, expect } from '@playwright/test'

// The page's body background is an animated GIF (bg.gif) — animations:
// 'disabled' doesn't freeze GIFs, so we swap it for the solid background
// color before capturing. Content pixels are still fully compared.
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.addStyleTag({ content: 'body { background-image: none !important; }' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
})

test('intro page matches baseline', async ({ page }) => {
  await expect(page).toHaveScreenshot('intro.png', { fullPage: true })
})

test('main content renders', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.avatar img')).toBeVisible()
  await expect(page.locator('.work li')).toHaveCount(2)
})
