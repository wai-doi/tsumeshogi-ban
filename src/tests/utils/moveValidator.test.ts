import { canMovePiece } from '../../utils/moveValidator.ts'

import type { PieceData } from '../../types.ts'

describe('歩の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'pawn-1',
      kind: 'pawn',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方へのみ移動できること', () => {
    // 前方
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)

    // 前方以外
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })

  test('2マス前方へは移動できないこと', () => {
    expect(canMovePiece(movingPiece, 2, 4, [])).toBe(false)
  })
})
