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
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
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

describe('と金の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'pawn-1',
      kind: 'pawn',
      place: 'board',
      row: 4,
      col: 4,
      promoted: true,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方3マスと横2マスと後方1マスにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })
})

describe('香車の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'lance-1',
      kind: 'lance',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方へのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })

  test('前方の一列すべてのマスに移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 4, [])).toBe(true)
  })

  test('前方一列のどこかに自駒がある場合は駒の前までのマスに移動できること', () => {
    const currentPieces: PieceData[] = [
      {
        id: 'pawn-1',
        kind: 'pawn',
        place: 'board',
        row: 1,
        col: 4,
        promoted: false,
        opposite: false,
        promotable: true,
      },
    ]

    expect(canMovePiece(movingPiece, 3, 4, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 2, 4, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 1, 4, currentPieces)).toBe(false)
    expect(canMovePiece(movingPiece, 0, 4, currentPieces)).toBe(false)
  })
})

describe('成香の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'lance-1',
      kind: 'lance',
      place: 'board',
      row: 4,
      col: 4,
      promoted: true,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方3マスと横2マスと後方1マスにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })
})

describe('桂馬の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'knight-1',
      kind: 'knight',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスに移動できないこと', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })

  test('2マス前方の左右のマスに移動できること', () => {
    expect(canMovePiece(movingPiece, 2, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 5, [])).toBe(true)

    expect(canMovePiece(movingPiece, 2, 4, [])).toBe(false)
  })
})

describe('成桂の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'knight-1',
      kind: 'knight',
      place: 'board',
      row: 4,
      col: 4,
      promoted: true,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方3マスと横2マスと後方1マスにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })
})

describe('銀の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'silver-1',
      kind: 'silver',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方3マスと斜め後ろ2マスにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
  })
})

describe('成銀の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'silver-1',
      kind: 'silver',
      place: 'board',
      row: 4,
      col: 4,
      promoted: true,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方3マスと横2マスと後方1マスにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })
})

describe('金の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'gold-1',
      kind: 'gold',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち前方3マスと横2マスと後方1マスにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })
})

describe('角の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'bishop-1',
      kind: 'bishop',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち斜めにのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
  })

  test('斜めの全てのマスに移動できること', () => {
    // 左上方向
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 2, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 1, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 0, [])).toBe(true)

    // 右上方向
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 6, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 7, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 8, [])).toBe(true)

    // 左下方向
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 6, 2, [])).toBe(true)
    expect(canMovePiece(movingPiece, 7, 1, [])).toBe(true)
    expect(canMovePiece(movingPiece, 8, 0, [])).toBe(true)

    // 右下方向
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 6, 6, [])).toBe(true)
    expect(canMovePiece(movingPiece, 7, 7, [])).toBe(true)
    expect(canMovePiece(movingPiece, 8, 8, [])).toBe(true)
  })

  test('斜めの途中に自駒がある場合は駒の手間まで移動できること', () => {
    const currentPieces: PieceData[] = [
      {
        id: 'pawn-1',
        kind: 'pawn',
        place: 'board',
        row: 1,
        col: 1,
        promoted: false,
        opposite: false,
        promotable: true,
      },
    ]

    expect(canMovePiece(movingPiece, 3, 3, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 2, 2, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 1, 1, currentPieces)).toBe(false)
    expect(canMovePiece(movingPiece, 0, 0, currentPieces)).toBe(false)
  })
})

describe('馬の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'bishop-1',
      kind: 'bishop',
      place: 'board',
      row: 4,
      col: 4,
      promoted: true,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスすべてに移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
  })

  test('斜めの全てのマスに移動できること', () => {
    // 左上方向
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 2, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 1, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 0, [])).toBe(true)

    // 右上方向
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 6, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 7, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 8, [])).toBe(true)

    // 左下方向
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 6, 2, [])).toBe(true)
    expect(canMovePiece(movingPiece, 7, 1, [])).toBe(true)
    expect(canMovePiece(movingPiece, 8, 0, [])).toBe(true)

    // 右下方向
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 6, 6, [])).toBe(true)
    expect(canMovePiece(movingPiece, 7, 7, [])).toBe(true)
    expect(canMovePiece(movingPiece, 8, 8, [])).toBe(true)
  })

  test('斜めの途中に自駒がある場合は駒の手間まで移動できること', () => {
    const currentPieces: PieceData[] = [
      {
        id: 'pawn-1',
        kind: 'pawn',
        place: 'board',
        row: 1,
        col: 1,
        promoted: false,
        opposite: false,
        promotable: true,
      },
    ]

    expect(canMovePiece(movingPiece, 3, 3, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 2, 2, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 1, 1, currentPieces)).toBe(false)
    expect(canMovePiece(movingPiece, 0, 0, currentPieces)).toBe(false)
  })
})

describe('飛車の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'rook-1',
      kind: 'rook',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスのうち上下左右にのみ移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(false)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(false)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(false)
  })

  test('上下左右のマスすべてに移動できること', () => {
    // 上方向
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 4, [])).toBe(true)

    // 下方向
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 6, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 7, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 8, 4, [])).toBe(true)

    // 左方向
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 2, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 1, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 0, [])).toBe(true)

    // 右方向
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 6, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 7, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 8, [])).toBe(true)
  })

  test('上下左右の途中に自駒がある場合は駒の手間まで移動できること', () => {
    const currentPieces: PieceData[] = [
      {
        id: 'pawn-1',
        kind: 'pawn',
        place: 'board',
        row: 1,
        col: 4,
        promoted: false,
        opposite: false,
        promotable: true,
      },
    ]

    expect(canMovePiece(movingPiece, 3, 4, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 2, 4, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 1, 4, currentPieces)).toBe(false)
    expect(canMovePiece(movingPiece, 0, 4, currentPieces)).toBe(false)
  })
})

describe('龍の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'rook-1',
      kind: 'rook',
      place: 'board',
      row: 4,
      col: 4,
      promoted: true,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスすべてに移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
  })

  test('上下左右のマスすべてに移動できること', () => {
    // 上方向
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 2, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 1, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 0, 4, [])).toBe(true)

    // 下方向
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 6, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 7, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 8, 4, [])).toBe(true)

    // 左方向
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 2, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 1, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 0, [])).toBe(true)

    // 右方向
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 6, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 7, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 8, [])).toBe(true)
  })

  test('上下左右の途中に自駒がある場合は駒の手間まで移動できること', () => {
    const currentPieces: PieceData[] = [
      {
        id: 'pawn-1',
        kind: 'pawn',
        place: 'board',
        row: 1,
        col: 4,
        promoted: false,
        opposite: false,
        promotable: true,
      },
    ]

    expect(canMovePiece(movingPiece, 3, 4, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 2, 4, currentPieces)).toBe(true)
    expect(canMovePiece(movingPiece, 1, 4, currentPieces)).toBe(false)
    expect(canMovePiece(movingPiece, 0, 4, currentPieces)).toBe(false)
  })
})

describe('玉の移動', () => {
  let movingPiece: PieceData

  beforeEach(() => {
    movingPiece = {
      id: 'king-1',
      kind: 'king',
      place: 'board',
      row: 4,
      col: 4,
      promoted: false,
      opposite: false,
      promotable: true,
    }
  })

  test('周囲8マスすべてに移動できること', () => {
    expect(canMovePiece(movingPiece, 3, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 3, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 4, 5, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 3, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 4, [])).toBe(true)
    expect(canMovePiece(movingPiece, 5, 5, [])).toBe(true)
  })
})
