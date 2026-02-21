import { expect, test } from '@playwright/test'

import { dragAndDrop } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept())

  await page.goto('/')
})

test('編集モードで駒箱の駒を駒台に動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(stand.locator('#pawn-0')).toBeVisible()
})

test('編集モードで駒箱の駒を盤に動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()
})

test('編集モードで駒台の駒を駒箱に動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(stand.locator('#pawn-0')).toBeVisible()

  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(stand.locator('#pawn-0')).not.toBeVisible()
  await expect(square.locator('#pawn-0')).toBeVisible()
})

test('編集モードで駒台の駒を盤に動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(stand.locator('#pawn-0')).toBeVisible()

  const box = page.locator('#piece-box')
  await dragAndDrop(page, piece, box)

  await expect(stand.locator('#pawn-0')).not.toBeVisible()
  await expect(box.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を駒箱に動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()

  const box = page.locator('#piece-box')
  await dragAndDrop(page, piece, box)

  await expect(square.locator('#pawn-0')).not.toBeVisible()
  await expect(box.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を駒台に動かせること', async ({ page }) => {
  const piece = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece, square)

  await expect(square.locator('#pawn-0')).toBeVisible()

  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, piece, stand)

  await expect(square.locator('#pawn-0')).not.toBeVisible()
  await expect(stand.locator('#pawn-0')).toBeVisible()
})

test('編集モードで盤の駒を盤の別の位置に動かせること', async ({ page }) => {
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

test('編集モードでクリアボタンを押すと盤面の駒がすべて駒箱に戻ること', async ({
  page,
}) => {
  const piece1 = page.locator(`#pawn-0`)
  const square_5_5 = page.locator('#square-5-5')
  await dragAndDrop(page, piece1, square_5_5)

  const piece2 = page.locator(`#pawn-1`)
  const square_3_3 = page.locator('#square-3-3')
  await dragAndDrop(page, piece2, square_3_3)

  await expect(square_5_5.locator('#pawn-0')).toBeVisible()
  await expect(square_3_3.locator('#pawn-1')).toBeVisible()

  // クリックが反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('配置をクリア').click()

  await expect(square_5_5.locator('#pawn-0')).not.toBeVisible()
  await expect(square_3_3.locator('#pawn-1')).not.toBeVisible()
  const box = page.locator('#piece-box')
  await expect(box.locator('#pawn-0')).toBeVisible()
  await expect(box.locator('#pawn-1')).toBeVisible()
})

test('編集モードで盤面を編集して解答モードに切り替えると、リロード後に保存された盤面で表示されること', async ({
  page,
}) => {
  const piece1 = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece1, square)

  const piece2 = page.locator(`#pawn-1`)
  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, piece2, stand)

  await expect(square.locator('#pawn-0')).toBeVisible()
  await expect(stand.locator('#pawn-1')).toBeVisible()

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  await page.reload()

  await expect(square.locator('#pawn-0')).toBeVisible()
  await expect(stand.locator('#pawn-1')).toBeVisible()
})

test('編集モードで盤面が保存された状態で、保存の削除をするとリロード後に初期盤面で表示されること', async ({
  page,
}) => {
  const piece1 = page.locator(`#pawn-0`)
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, piece1, square)

  const piece2 = page.locator(`#pawn-1`)
  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, piece2, stand)

  await expect(square.locator('#pawn-0')).toBeVisible()
  await expect(stand.locator('#pawn-1')).toBeVisible()

  // クリックしても反応しない場合があるため待機
  await page.waitForTimeout(100)
  await page.getByText('保存して解答する').click()

  // 解答モードが表示されたことを確認
  await expect(page.getByText('盤面を編集する')).toBeVisible()

  await page.reload()

  await expect(square.locator('#pawn-0')).toBeVisible()
  await expect(stand.locator('#pawn-1')).toBeVisible()

  await page.getByText('保存した配置を消す').click()

  await page.reload()

  await expect(square.locator('#pawn-0')).not.toBeVisible()
  await expect(stand.locator('#pawn-1')).not.toBeVisible()
})

test('編集モードでSFENを読込すると盤上に駒が配置されること', async ({
  page,
}) => {
  await page.locator('#sfen-input').fill('7ks/5+P3/9/9/9/9/9/9/9 b -')
  await page.locator('#load-sfen-button').click()

  const whiteKing = page.locator('#square-2-1 [id^="king-"]').first()
  const whiteSilver = page.locator('#square-1-1 [id^="silver-"]').first()
  const promotedPawn = page.locator('#square-4-2 [id^="pawn-"]').first()

  await expect(whiteKing).toBeVisible()
  await expect(whiteKing).toHaveAttribute('src', /white_king2\.png/)
  await expect(whiteSilver).toBeVisible()
  await expect(whiteSilver).toHaveAttribute('src', /white_silver\.png/)
  await expect(promotedPawn).toBeVisible()
  await expect(promotedPawn).toHaveAttribute('src', /black_prom_pawn\.png/)
})

test('編集モードでSFENを読込するとURLクエリにsfenが反映されること', async ({
  page,
}) => {
  const sfen = '7ks/5+P3/9/9/9/9/9/9/9 b -'

  await page.locator('#sfen-input').fill(sfen)
  await page.locator('#load-sfen-button').click()

  await expect(async () => {
    const sfenInQuery = await page.evaluate(() => {
      return new URL(window.location.href).searchParams.get('sfen')
    })

    expect(sfenInQuery).toBe(sfen)
  }).toPass()
})

test('sfenクエリ付きアクセスでSFEN入力欄と盤面へ反映されること', async ({
  page,
}) => {
  const sfen = '7ks/5+P3/9/9/9/9/9/9/9 b -'
  await page.goto(`/?sfen=${encodeURIComponent(sfen)}`)

  await expect(page.locator('#sfen-input')).toHaveValue(sfen)

  const whiteKing = page.locator('#square-2-1 [id^="king-"]').first()
  const whiteSilver = page.locator('#square-1-1 [id^="silver-"]').first()
  const promotedPawn = page.locator('#square-4-2 [id^="pawn-"]').first()

  await expect(whiteKing).toBeVisible()
  await expect(whiteSilver).toBeVisible()
  await expect(promotedPawn).toBeVisible()
})

test('編集モードでSFENの先手持ち駒が駒台に配置されること', async ({ page }) => {
  await page.locator('#sfen-input').fill('9/9/9/9/9/9/9/9/9 b GS')
  await page.locator('#load-sfen-button').click()

  const stand = page.locator('#piece-stand')
  await expect(stand.locator('[id^="gold-"]')).toHaveCount(1)
  await expect(stand.locator('[id^="silver-"]')).toHaveCount(1)
})

test('編集モードで並べた盤面からSFENを取得して入力欄に表示できること', async ({
  page,
}) => {
  const pawn = page.locator('#pawn-0')
  const square = page.locator('#square-5-5')
  await dragAndDrop(page, pawn, square)

  const gold = page.locator('#gold-0')
  const stand = page.locator('#piece-stand')
  await dragAndDrop(page, gold, stand)

  // DnD直後はクリックが効かない場合があるため待機
  await page.waitForTimeout(100)
  await page.locator('#generate-sfen-button').click()
  await expect(page.locator('#sfen-input')).toHaveValue(
    '9/9/9/9/4P4/9/9/9/9 b G',
  )
})

test('編集モードで不正なSFENを読込するとエラー表示され盤面が変わらないこと', async ({
  page,
}) => {
  await page.locator('#sfen-input').fill('9/9/9/9/4P4/9/9/9/9 b -')
  await page.locator('#load-sfen-button').click()

  const square = page.locator('#square-5-5')
  await expect(square.locator('[id^="pawn-"]')).toHaveCount(1)

  await page.locator('#sfen-input').fill('9/9/9/9/4P4/9/9/9 b -')
  await page.locator('#load-sfen-button').click()

  await expect(page.locator('#sfen-error')).toBeVisible()
  await expect(square.locator('[id^="pawn-"]')).toHaveCount(1)
})
