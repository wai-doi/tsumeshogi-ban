import { loadPiecesFromSfen } from '../../utils/sfen.ts'

import type { PieceData, PieceKind } from '../../types.ts'

function generatePieces(): PieceData[] {
  const pieceNumber: { kind: PieceKind; number: number }[] = [
    { kind: 'pawn', number: 18 },
    { kind: 'lance', number: 4 },
    { kind: 'knight', number: 4 },
    { kind: 'silver', number: 4 },
    { kind: 'gold', number: 4 },
    { kind: 'bishop', number: 2 },
    { kind: 'rook', number: 2 },
    { kind: 'king', number: 2 },
  ]

  function initialPiece(kind: PieceKind, id: number): PieceData {
    return {
      id: `${kind}-${id}`,
      kind,
      place: 'box',
      row: null,
      col: null,
      promoted: false,
      opposite: false,
      promotable: !(kind === 'gold' || kind === 'king'),
    }
  }

  return pieceNumber
    .map(({ kind, number }) => {
      return [...Array(number)].map((_, i) => initialPiece(kind, i))
    })
    .flat()
}

test('盤面の駒配置と成り・向きが正しく反映されること', () => {
  const sfen = '7ks/5+P3/9/9/9/9/9/9/9 b -'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: true,
    }),
  )
  if (!('pieces' in result)) throw new Error(result.error)

  const pieces = result.pieces
  const boardPieces = pieces.filter((piece) => piece.place === 'board')

  expect(boardPieces).toHaveLength(3)

  const whiteKing = boardPieces.find(
    (piece) => piece.kind === 'king' && piece.row === 0 && piece.col === 7,
  )
  expect(whiteKing).toMatchObject({ opposite: true, promoted: false })

  const whiteSilver = boardPieces.find(
    (piece) => piece.kind === 'silver' && piece.row === 0 && piece.col === 8,
  )
  expect(whiteSilver).toMatchObject({ opposite: true, promoted: false })

  const promotedPawn = boardPieces.find(
    (piece) => piece.kind === 'pawn' && piece.row === 1 && piece.col === 5,
  )
  expect(promotedPawn).toMatchObject({ opposite: false, promoted: true })
})

test('持ち駒が先手は駒台、後手は駒箱に反映されること', () => {
  const sfen = '9/9/9/9/9/9/9/9/9 b 2GS2p'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: true,
    }),
  )
  if (!('pieces' in result)) throw new Error(result.error)

  const pieces = result.pieces

  const standGold = pieces.filter(
    (piece) => piece.place === 'stand' && piece.kind === 'gold',
  )
  expect(standGold).toHaveLength(2)
  expect(standGold.every((piece) => !piece.opposite && !piece.promoted)).toBe(
    true,
  )

  const standSilver = pieces.filter(
    (piece) => piece.place === 'stand' && piece.kind === 'silver',
  )
  expect(standSilver).toHaveLength(1)

  const boxWhitePawn = pieces.filter(
    (piece) => piece.place === 'box' && piece.kind === 'pawn' && piece.opposite,
  )
  expect(boxWhitePawn).toHaveLength(2)
  expect(boxWhitePawn.every((piece) => !piece.promoted)).toBe(true)
})

test('4項目SFENを受理して盤面反映できること', () => {
  const sfen = '9/9/9/9/9/9/9/9/9 w - 23'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: true,
    }),
  )
})

test('盤面段数が不正なSFENはエラーになること', () => {
  const sfen = '9/9/9/9/9/9/9/9 b -'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: false,
    }),
  )
  if (!('error' in result)) throw new Error('expected error')

  expect(result.error).toContain('9段')
})

test('段内のマス数が9でないSFENはエラーになること', () => {
  const sfen = '8/9/9/9/9/9/9/9/9 b -'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: false,
    }),
  )
  if (!('error' in result)) throw new Error('expected error')

  expect(result.error).toContain('マス数が9')
})

test('無効な駒記号を含むSFENはエラーになること', () => {
  const sfen = '9/9/9/9/9/9/9/9/8Z b -'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: false,
    }),
  )
  if (!('error' in result)) throw new Error('expected error')

  expect(result.error).toContain('無効な駒記号')
})

test('+の使い方が不正なSFENはエラーになること', () => {
  const sfen = '9/9/9/9/9/9/9/9/8+ b -'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: false,
    }),
  )
  if (!('error' in result)) throw new Error('expected error')

  expect(result.error).toContain('+の後')
})

test('利用可能枚数を超える駒を指定したSFENはエラーになること', () => {
  const sfen = 'PPPPPPPPP/PPPPPPPPP/9/9/9/9/9/9/9 b P'
  const result = loadPiecesFromSfen(sfen, generatePieces())

  expect(result).toEqual(
    expect.objectContaining({
      ok: false,
    }),
  )
  if (!('error' in result)) throw new Error('expected error')

  expect(result.error).toContain('上限を超えています')
})
