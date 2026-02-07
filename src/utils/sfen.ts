import type { PieceData, PieceKind } from '../types.ts'

interface SfenBoardPiece {
  kind: PieceKind
  row: number
  col: number
  opposite: boolean
  promoted: boolean
}

interface SfenHandPiece {
  kind: PieceKind
  opposite: boolean
}

export type SfenLoadResult =
  | { ok: true; pieces: PieceData[] }
  | { ok: false; error: string }

interface ParsedSfenResult {
  ok: true
  boardPieces: SfenBoardPiece[]
  handPieces: SfenHandPiece[]
}

interface ParseErrorResult {
  ok: false
  error: string
}

interface ParseBoardSuccessResult {
  ok: true
  pieces: SfenBoardPiece[]
}

interface ParseHandsSuccessResult {
  ok: true
  pieces: SfenHandPiece[]
}

const kindOrder: PieceKind[] = [
  'pawn',
  'lance',
  'knight',
  'silver',
  'gold',
  'bishop',
  'rook',
  'king',
]

const sfenPieceMap: Record<string, PieceKind> = {
  P: 'pawn',
  L: 'lance',
  N: 'knight',
  S: 'silver',
  G: 'gold',
  B: 'bishop',
  R: 'rook',
  K: 'king',
}

const kindLabel: Record<PieceKind, string> = {
  pawn: '歩',
  lance: '香車',
  knight: '桂馬',
  silver: '銀',
  gold: '金',
  bishop: '角',
  rook: '飛車',
  king: '玉',
}

function parsePieceKind(char: string): PieceKind | null {
  return sfenPieceMap[char.toUpperCase()] || null
}

function resetPiece(piece: PieceData): void {
  piece.place = 'box'
  piece.row = null
  piece.col = null
  piece.promoted = false
  piece.opposite = false
}

function pieceIdIndex(id: string): number {
  const index = Number(id.split('-')[1])
  return Number.isNaN(index) ? Number.MAX_SAFE_INTEGER : index
}

function parseBoard(
  boardToken: string,
): ParseBoardSuccessResult | ParseErrorResult {
  const rows = boardToken.split('/')
  if (rows.length !== 9) {
    return { ok: false, error: '盤面は9段で指定してください' }
  }

  const boardPieces: SfenBoardPiece[] = []

  for (let row = 0; row < rows.length; row += 1) {
    const rowText = rows[row]
    let col = 0

    for (let i = 0; i < rowText.length; i += 1) {
      const char = rowText[i]

      if (/^[1-9]$/.test(char)) {
        col += Number(char)
        continue
      }

      let promoted = false
      let pieceChar = char

      if (char === '+') {
        promoted = true
        i += 1

        if (i >= rowText.length) {
          return {
            ok: false,
            error: `${row + 1}段目で+の後に駒記号がありません`,
          }
        }

        pieceChar = rowText[i]
      }

      const kind = parsePieceKind(pieceChar)
      if (!kind) {
        return {
          ok: false,
          error: `${row + 1}段目に無効な駒記号「${pieceChar}」があります`,
        }
      }

      if (promoted && (kind === 'gold' || kind === 'king')) {
        return {
          ok: false,
          error: `${row + 1}段目で${kindLabel[kind]}に成りは指定できません`,
        }
      }

      boardPieces.push({
        kind,
        row,
        col,
        opposite: pieceChar === pieceChar.toLowerCase(),
        promoted,
      })
      col += 1
    }

    if (col !== 9) {
      return {
        ok: false,
        error: `${row + 1}段目のマス数が9になっていません`,
      }
    }
  }

  return { ok: true, pieces: boardPieces }
}

function parseHands(
  handsToken: string,
): ParseHandsSuccessResult | ParseErrorResult {
  if (handsToken === '-') {
    return { ok: true, pieces: [] }
  }

  const handPieces: SfenHandPiece[] = []
  let index = 0

  while (index < handsToken.length) {
    let countText = ''
    while (index < handsToken.length && /^\d$/.test(handsToken[index])) {
      countText += handsToken[index]
      index += 1
    }

    if (index >= handsToken.length) {
      return { ok: false, error: '持ち駒の枚数指定の後に駒記号が必要です' }
    }

    const count = countText === '' ? 1 : Number(countText)
    if (count <= 0) {
      return { ok: false, error: '持ち駒の枚数は1以上で指定してください' }
    }

    const pieceChar = handsToken[index]
    const kind = parsePieceKind(pieceChar)

    if (!kind) {
      return {
        ok: false,
        error: `持ち駒に無効な駒記号「${pieceChar}」があります`,
      }
    }

    for (let i = 0; i < count; i += 1) {
      handPieces.push({
        kind,
        opposite: pieceChar === pieceChar.toLowerCase(),
      })
    }

    index += 1
  }

  return { ok: true, pieces: handPieces }
}

function parseSfen(input: string): ParsedSfenResult | ParseErrorResult {
  const trimmedInput = input.trim()
  if (!trimmedInput) {
    return { ok: false, error: 'SFENを入力してください' }
  }

  const tokens = trimmedInput.split(/\s+/)
  if (tokens.length < 3 || tokens.length > 4) {
    return {
      ok: false,
      error: 'SFENは「盤面 手番 持ち駒 [手数]」形式で入力してください',
    }
  }

  const [boardToken, sideToken, handsToken, moveToken] = tokens

  if (sideToken !== 'b' && sideToken !== 'w') {
    return { ok: false, error: '手番はbまたはwで指定してください' }
  }

  if (moveToken && !/^[1-9]\d*$/.test(moveToken)) {
    return { ok: false, error: '手数は1以上の整数で指定してください' }
  }

  const boardPieces = parseBoard(boardToken)
  if ('error' in boardPieces) return boardPieces

  const handPieces = parseHands(handsToken)
  if ('error' in handPieces) return handPieces

  return {
    ok: true,
    boardPieces: boardPieces.pieces,
    handPieces: handPieces.pieces,
  }
}

function makePiecesByKind(pieces: PieceData[]): Record<PieceKind, PieceData[]> {
  const piecesByKind: Record<PieceKind, PieceData[]> = {
    pawn: [],
    lance: [],
    knight: [],
    silver: [],
    gold: [],
    bishop: [],
    rook: [],
    king: [],
  }

  pieces.forEach((piece) => {
    piecesByKind[piece.kind].push(piece)
  })

  kindOrder.forEach((kind) => {
    piecesByKind[kind].sort((a, b) => pieceIdIndex(a.id) - pieceIdIndex(b.id))
  })

  return piecesByKind
}

export function loadPiecesFromSfen(
  input: string,
  currentPieces: PieceData[],
): SfenLoadResult {
  const parsed = parseSfen(input)
  if ('error' in parsed) return parsed

  const nextPieces = structuredClone(currentPieces)
  nextPieces.forEach(resetPiece)

  const piecesByKind = makePiecesByKind(nextPieces)
  const usedCount: Record<PieceKind, number> = {
    pawn: 0,
    lance: 0,
    knight: 0,
    silver: 0,
    gold: 0,
    bishop: 0,
    rook: 0,
    king: 0,
  }

  const requiredCount: Record<PieceKind, number> = {
    pawn: 0,
    lance: 0,
    knight: 0,
    silver: 0,
    gold: 0,
    bishop: 0,
    rook: 0,
    king: 0,
  }

  parsed.boardPieces.forEach(({ kind }) => {
    requiredCount[kind] += 1
  })
  parsed.handPieces.forEach(({ kind }) => {
    requiredCount[kind] += 1
  })

  for (const kind of kindOrder) {
    if (requiredCount[kind] > piecesByKind[kind].length) {
      return {
        ok: false,
        error: `${kindLabel[kind]}の枚数が利用可能な上限を超えています`,
      }
    }
  }

  parsed.boardPieces.forEach((boardPiece) => {
    const piece = piecesByKind[boardPiece.kind][usedCount[boardPiece.kind]]
    usedCount[boardPiece.kind] += 1

    piece.place = 'board'
    piece.row = boardPiece.row
    piece.col = boardPiece.col
    piece.promoted = boardPiece.promoted
    piece.opposite = boardPiece.opposite
  })

  parsed.handPieces.forEach((handPiece) => {
    const piece = piecesByKind[handPiece.kind][usedCount[handPiece.kind]]
    usedCount[handPiece.kind] += 1

    piece.place = handPiece.opposite ? 'box' : 'stand'
    piece.row = null
    piece.col = null
    piece.promoted = false
    piece.opposite = false
  })

  return { ok: true, pieces: nextPieces }
}
