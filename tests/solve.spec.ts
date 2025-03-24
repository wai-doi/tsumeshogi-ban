import { expect, test } from '@playwright/test'

import { dragAndDrop } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept())

  await page.goto('/')
})

test('解答モードで駒の動かせる範囲のみ駒を動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const square_5_5 = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square_5_5)

  await expect(square_5_5.locator('#pawn-0')).toBeVisible()

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  const square_5_6 = page.locator('#square-5-6')
  await dragAndDrop(page, piece, square_5_6)

  await expect(square_5_6.locator('#pawn-0')).not.toBeVisible()

  const square_5_4 = page.locator('#square-5-4')
  await dragAndDrop(page, piece, square_5_4)

  await expect(square_5_4.locator('#pawn-0')).toBeVisible()
})

test('解答モードで駒の動かせる範囲に自駒がある場合はそこに動かせないこと', async ({
  page,
}) => {
  const piece1 = page.locator(`#pawn-0`)
  const square_5_5 = page.locator('#square-5-5')
  await dragAndDrop(page, piece1, square_5_5)

  const piece2 = page.locator(`#gold-0`)
  const square_5_4 = page.locator('#square-5-4')
  await dragAndDrop(page, piece2, square_5_4)

  await expect(square_5_5.locator('#pawn-0')).toBeVisible()
  await expect(square_5_4.locator('#gold-0')).toBeVisible()

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  await dragAndDrop(page, piece1, square_5_4)

  await expect(square_5_5.locator('#pawn-0')).toBeVisible()
  await expect(square_5_4.locator('#gold-0')).toBeVisible()
})

test('解答モードで駒の動かせる範囲に敵駒がある場合はその駒を取れること', async ({
  page,
}) => {
  const piece1 = page.locator(`#pawn-0`)
  const square_5_5 = page.locator('#square-5-5')
  await dragAndDrop(page, piece1, square_5_5)

  const piece2 = page.locator(`#gold-0`)
  const square_5_4 = page.locator('#square-5-4')
  await dragAndDrop(page, piece2, square_5_4)

  await expect(square_5_5.locator('#pawn-0')).toBeVisible()
  await expect(square_5_4.locator('#gold-0')).toBeVisible()

  // 敵駒にする
  await piece2.click({ button: 'right' })

  await expect(piece2).toHaveAttribute('src', /white_gold\.png/)

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  await dragAndDrop(page, piece1, square_5_4)

  await expect(square_5_4.locator('#pawn-0')).toBeVisible()
  const stand = page.locator('.piece-stand')
  await expect(stand.locator('#gold-0')).toBeVisible()
})

test('解答モードで駒が敵陣入ったとき成ることができること', async ({ page }) => {
  const myPawn = page.locator(`#pawn-0`)
  const square_5_4 = page.locator('#square-5-4')
  await dragAndDrop(page, myPawn, square_5_4)

  const enemyPawn = page.locator(`#pawn-1`)
  const square_5_6 = page.locator('#square-5-6')
  await dragAndDrop(page, enemyPawn, square_5_6)

  // 右クリックで敵駒にする
  await enemyPawn.click({ button: 'right' })
  await enemyPawn.click({ button: 'right' })

  await expect(enemyPawn).toHaveAttribute('src', /white_pawn\.png/)

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  const square_5_3 = page.locator('#square-5-3')
  await dragAndDrop(page, myPawn, square_5_3)

  // 自駒が成る
  await page.waitForTimeout(100)
  await page.locator('.promote').click()

  await expect(square_5_3.locator('#pawn-0')).toBeVisible()
  await expect(myPawn).toHaveAttribute('src', /black_prom_pawn\.png/)

  const square_5_7 = page.locator('#square-5-7')
  await dragAndDrop(page, enemyPawn, square_5_7)

  // 敵駒が成る
  await page.waitForTimeout(100)
  await page.locator('.promote').click()

  await expect(square_5_7.locator('#pawn-1')).toBeVisible()
  await expect(enemyPawn).toHaveAttribute('src', /white_prom_pawn\.png/)
})

test('解答モードで駒が敵陣から出たとき成ることができること', async ({
  page,
}) => {
  const mySilver = page.locator(`#silver-0`)
  const square_5_4 = page.locator('#square-5-4')
  await dragAndDrop(page, mySilver, square_5_4)

  const enemySilver = page.locator(`#silver-1`)
  const square_5_6 = page.locator('#square-5-6')
  await dragAndDrop(page, enemySilver, square_5_6)

  // 右クリックで敵駒にする
  await enemySilver.click({ button: 'right' })
  await enemySilver.click({ button: 'right' })

  await expect(enemySilver).toHaveAttribute('src', /white_silver\.png/)

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  const square_4_3 = page.locator('#square-4-3')
  await dragAndDrop(page, mySilver, square_4_3)

  // 自駒が敵陣に入っても成らない
  await page.waitForTimeout(100)
  await page.locator('.normal').click()

  await expect(square_4_3.locator('#silver-0')).toBeVisible()
  await expect(mySilver).toHaveAttribute('src', /black_silver\.png/)

  const square_6_7 = page.locator('#square-6-7')
  await dragAndDrop(page, enemySilver, square_6_7)

  // 敵駒が自陣に入っても成らない
  await page.waitForTimeout(100)
  await page.locator('.normal').click()

  await expect(square_6_7.locator('#silver-1')).toBeVisible()
  await expect(enemySilver).toHaveAttribute('src', /white_silver\.png/)

  // 自駒が敵陣から出て成る
  await dragAndDrop(page, mySilver, square_5_4)
  await page.waitForTimeout(100)
  await page.locator('.promote').click()

  await expect(square_5_4.locator('#silver-0')).toBeVisible()
  await expect(mySilver).toHaveAttribute('src', /black_prom_silver\.png/)

  //敵駒が自陣から出て成る
  await dragAndDrop(page, enemySilver, square_5_6)
  await page.waitForTimeout(100)
  await page.locator('.promote').click()

  await expect(square_5_6.locator('#silver-1')).toBeVisible()
  await expect(enemySilver).toHaveAttribute('src', /white_prom_silver\.png/)
})
