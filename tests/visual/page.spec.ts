import { test, expect } from '@playwright/test'

test.describe('River Intro Page', () => {
  test('loads and matches snapshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('page-initial.png')
  })

  test('renders without errors', async ({ page }) => {
    await page.goto('/')

    // Check for background image
    const bgGif = await page.locator('img[src*="bg.gif"]')
    // Note: update selector based on actual HTML structure

    // Take screenshot
    await expect(page).toHaveScreenshot('page-content.png')
  })
})
