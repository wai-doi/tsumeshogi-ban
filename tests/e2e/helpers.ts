import type { Locator, Page } from '@playwright/test'

// dragToが期待通り動作しなかったため、低レベルなマウス操作で代替
export async function dragAndDrop(
  page: Page,
  dragSource: Locator,
  dropTarget: Locator,
): Promise<void> {
  // ドラッグ対象にマウスを合わせる
  await dragSource.hover()

  // マウスボタン押下でドラッグ開始
  await page.mouse.down()

  // dragoverイベントが確実に発火するように、drop先に2回hoverする
  await dropTarget.hover()
  await dropTarget.hover()

  // マウスボタンを離してドロップ完了
  await page.mouse.up()
}
