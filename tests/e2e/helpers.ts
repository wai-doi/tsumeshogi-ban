import type { Locator, Page } from '@playwright/test'

// dragToが期待通り動作しなかったため、低レベルなマウス操作で代替
export async function dragAndDrop(
  page: Page,
  dragSource: Locator,
  dropTarget: Locator,
): Promise<void> {
  const pieceId = await dragSource.getAttribute('id')

  if (!pieceId) {
    throw new Error('dragAndDrop: dragSource id not found')
  }

  // 確実に駒が移動するよう最大2回試行
  for (let attempt = 0; attempt < 2; attempt += 1) {
    // ドラッグ対象にマウスを合わせる
    await dragSource.hover()

    // マウスボタン押下でドラッグ開始
    await page.mouse.down()

    // dragoverイベントが確実に発火するように、drop先に2回hoverする
    await dropTarget.hover()
    await dropTarget.hover()

    // マウスボタンを離してドロップ完了
    await page.mouse.up()

    // 駒が移動したか確認
    const moved = await isPieceInDropTarget(dropTarget, pieceId)
    if (moved) return
  }
}

async function isPieceInDropTarget(
  dropTarget: Locator,
  pieceId: string,
): Promise<boolean> {
  const piece = dropTarget.locator(`#${pieceId}`)

  try {
    await piece.waitFor({ state: 'visible', timeout: 200 })
    return true
  } catch {
    return false
  }
}
