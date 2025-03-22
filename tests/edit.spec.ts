import { expect, test } from '@playwright/test'

import { dragAndDrop } from './helpers.ts'

test('編集モードで駒箱の駒を駒台に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const stand = page.locator('.piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(stand.locator('#pawn-0')).toBeVisible()
})

test('編集モードで駒箱の駒を盤に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()
})

test('編集モードで駒台の駒を駒箱に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const stand = page.locator('.piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(stand.locator('#pawn-0')).toBeVisible()

  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(stand.locator('#pawn-0')).not.toBeVisible()
  await expect(square.locator('#pawn-0')).toBeVisible()
})

test('編集モードで駒台の駒を盤に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const stand = page.locator('.piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(stand.locator('#pawn-0')).toBeVisible()

  const box = page.locator('.piece-box')
  await dragAndDrop(page, piece, box)

  await expect(stand.locator('#pawn-0')).not.toBeVisible()
  await expect(box.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を駒箱に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()

  const box = page.locator('.piece-box')
  await dragAndDrop(page, piece, box)

  await expect(square.locator('#pawn-0')).not.toBeVisible()
  await expect(box.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を駒台に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()

  const stand = page.locator('.piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(square.locator('#pawn-0')).not.toBeVisible()
  await expect(stand.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を盤の別の位置に動かせること', async ({ page }) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const square_5_5 = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square_5_5)

  await expect(square_5_5.locator('#pawn-0')).toBeVisible()

  const square_3_3 = page.locator('#square-3-3')
  await dragAndDrop(page, piece, square_3_3)

  await expect(square_5_5.locator('#pawn-0')).not.toBeVisible()
  await expect(square_3_3.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を右クリックすると駒の向きと成りが変わること', async ({
  page,
}) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()
  await expect(piece).toHaveAttribute('src', /black_pawn\.png/)

  await piece.click({ button: 'right' })

  await expect(piece).toHaveAttribute('src', /black_prom_pawn\.png/)

  await piece.click({ button: 'right' })

  await expect(piece).toHaveAttribute('src', /white_pawn\.png/)

  await piece.click({ button: 'right' })

  await expect(piece).toHaveAttribute('src', /white_prom_pawn\.png/)

  await piece.click({ button: 'right' })

  await expect(piece).toHaveAttribute('src', /black_pawn\.png/)
})

test('編集モードで盤の駒をダブルクリックすると駒の向きと成りが変わること', async ({
  page,
}) => {
  await page.goto('/')

  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()
  await expect(piece).toHaveAttribute('src', /black_pawn\.png/)

  await piece.dblclick()

  await expect(piece).toHaveAttribute('src', /black_prom_pawn\.png/)

  await piece.dblclick()

  await expect(piece).toHaveAttribute('src', /white_pawn\.png/)

  await piece.dblclick()

  await expect(piece).toHaveAttribute('src', /white_prom_pawn\.png/)

  await piece.dblclick()

  await expect(piece).toHaveAttribute('src', /black_pawn\.png/)
})
