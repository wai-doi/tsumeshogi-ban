import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('詰将棋盤')
})
