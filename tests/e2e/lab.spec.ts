import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function completeQuiz(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Break component into pieces' }).click()
  await expect(page.getByRole('heading', { name: 'Motherboard' })).toBeVisible()
  await page.getByRole('button', { name: 'Quiz me' }).first().click()
  await page.getByRole('button', { name: 'Connect and coordinate components' }).click()
  await expect(page.getByText(/^Correct/)).toBeVisible()
  await page.getByRole('button', { name: 'Tutor', exact: true }).click()
  await expect(page.getByRole('complementary', { name: 'AI learning tutor' })).toBeVisible()
}

test('core learning flow is usable', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveTitle(/SMAJ 3D Lab/)
  await expect(page.locator('canvas[data-engine]')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Motherboard' })).toHaveCount(0)
  await expect(page.getByText('Camera stays off until you enable it.')).toBeVisible()
  await completeQuiz(page)
  await expect(page.getByText(/You are exploring/)).toBeVisible()
})

test('learning panels have no serious accessibility violations', async ({ page }) => {
  // Give Axe its own budget after verifying the panels are ready.
  test.setTimeout(90_000)
  await page.goto('./')
  await completeQuiz(page)
  const results = await new AxeBuilder({ page }).exclude('canvas').analyze()
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([])
})

test('responsive layout has no horizontal overflow and fallbacks respond', async ({ page }) => {
  await page.goto('./')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  expect(overflow).toBe(false)
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Home')
  await page.getByRole('button', { name: 'Learning account' }).click()
  await expect(page.getByRole('dialog', { name: 'Learning account' })).toBeVisible()
  await expect(page.getByText(/guest profile/i)).toBeVisible()
})
