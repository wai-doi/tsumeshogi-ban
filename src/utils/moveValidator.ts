import type { PieceData } from '../types'

export function canMovePiece(
  movingPiece: PieceData,
  row: number,
  col: number,
  currentPieces: PieceData[],
): boolean {
  const existingPiece = findPiece(currentPieces, row, col)
  // 自駒があるため行けない
  if (existingPiece && movingPiece.opposite === existingPiece.opposite)
    return false

  switch (movingPiece.kind) {
    case 'pawn':
      if (movingPiece.promoted) {
        return canMoveGold(movingPiece, row, col)
      } else {
        return canMovePawn(movingPiece, row, col)
      }
    case 'lance':
      if (movingPiece.promoted) {
        return canMoveGold(movingPiece, row, col)
      } else {
        return canMoveLance(movingPiece, row, col, currentPieces)
      }
    case 'knight':
      if (movingPiece.promoted) {
        return canMoveGold(movingPiece, row, col)
      } else {
        return canMoveKnight(movingPiece, row, col)
      }
    case 'silver':
      if (movingPiece.promoted) {
        return canMoveGold(movingPiece, row, col)
      } else {
        return canMoveSilver(movingPiece, row, col)
      }
    case 'gold':
      return canMoveGold(movingPiece, row, col)
    case 'bishop':
      if (movingPiece.promoted) {
        return canMoveHorse(movingPiece, row, col, currentPieces)
      } else {
        return canMoveBishop(movingPiece, row, col, currentPieces)
      }
    case 'rook':
      if (movingPiece.promoted) {
        return canMoveDragon(movingPiece, row, col, currentPieces)
      } else {
        return canMoveRook(movingPiece, row, col, currentPieces)
      }
    case 'king':
      return canMoveKing(movingPiece, row, col)
  }
}

function findPiece(
  currentPieces: PieceData[],
  row: number,
  col: number,
): PieceData | undefined {
  return currentPieces.find((piece) => piece.row === row && piece.col === col)
}

function canMovePawn(
  movingPiece: PieceData,
  row: number,
  col: number,
): boolean {
  const canMoveArea = [[-1, 0]]
  return canMoveNonLinearPiece(movingPiece, col, row, canMoveArea)
}

function canMoveNonLinearPiece(
  movingPiece: PieceData,
  col: number,
  row: number,
  canMoveArea: number[][],
): boolean {
  const direction = movingPiece.opposite ? -1 : 1
  return canMoveArea.some(
    ([r, c]) =>
      movingPiece.row! + direction * r === row &&
      movingPiece.col! + direction * c === col,
  )
}

function canMoveLance(
  movingPiece: PieceData,
  row: number,
  col: number,
  currentPieces: PieceData[],
): boolean {
  // 筋が違うため行けない
  if (movingPiece.col !== col) return false

  const diffRow = row - movingPiece.row!
  const direction = movingPiece.opposite ? 1 : -1

  // 後方なので行けない
  if (diffRow * direction < 0) return false

  for (let i = movingPiece.row! + direction; i !== row; i += direction) {
    const stopperPiece = findPiece(currentPieces, i, movingPiece.col)
    // 障害物の駒があるため行けない
    if (stopperPiece) return false
  }
  return true
}

function canMoveKnight(
  movingPiece: PieceData,
  row: number,
  col: number,
): boolean {
  const canMoveArea = [
    [-2, -1],
    [-2, 1],
  ]
  return canMoveNonLinearPiece(movingPiece, col, row, canMoveArea)
}

function canMoveSilver(
  movingPiece: PieceData,
  row: number,
  col: number,
): boolean {
  const canMoveArea = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]
  return canMoveNonLinearPiece(movingPiece, col, row, canMoveArea)
}

function canMoveGold(
  movingPiece: PieceData,
  row: number,
  col: number,
): boolean {
  const canMoveArea = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, 0],
  ]
  return canMoveNonLinearPiece(movingPiece, col, row, canMoveArea)
}

function canMoveBishop(
  movingPiece: PieceData,
  row: number,
  col: number,
  currentPieces: PieceData[],
): boolean {
  const diffRow = row - movingPiece.row!
  const diffCol = col - movingPiece.col!

  // 斜め移動でないと行けない
  if (Math.abs(diffRow) !== Math.abs(diffCol)) return false

  const stepRow = diffRow > 0 ? 1 : -1
  const stepCol = diffCol > 0 ? 1 : -1

  for (let i = 1; i < Math.abs(diffRow); i++) {
    const stopperPiece = findPiece(
      currentPieces,
      movingPiece.row! + i * stepRow,
      movingPiece.col! + i * stepCol,
    )
    // 障害物の駒があるため行けない
    if (stopperPiece) return false
  }
  return true
}

function canMoveHorse(
  movingPiece: PieceData,
  row: number,
  col: number,
  currentPieces: PieceData[],
): boolean {
  return (
    canMoveBishop(movingPiece, row, col, currentPieces) ||
    canMoveKing(movingPiece, row, col)
  )
}

function canMoveRook(
  movingPiece: PieceData,
  row: number,
  col: number,
  currentPieces: PieceData[],
): boolean {
  const diffRow = row - movingPiece.row!
  const diffCol = col - movingPiece.col!

  if (diffCol === 0) {
    // 縦方向の移動
    const step = diffRow > 0 ? 1 : -1
    for (let i = movingPiece.row! + step; i !== row; i += step) {
      const stopperPiece = findPiece(currentPieces, i, movingPiece.col!)
      // 障害物の駒があるため行けない
      if (stopperPiece) return false
    }
    return true
  } else if (diffRow === 0) {
    // 横方向の移動
    const step = diffCol > 0 ? 1 : -1
    for (let i = movingPiece.col! + step; i !== col; i += step) {
      const stopperPiece = findPiece(currentPieces, movingPiece.row!, i)
      // 障害物の駒があるため行けない
      if (stopperPiece) return false
    }
    return true
  } else {
    return false
  }
}

function canMoveDragon(
  movingPiece: PieceData,
  row: number,
  col: number,
  currentPieces: PieceData[],
): boolean {
  return (
    canMoveRook(movingPiece, row, col, currentPieces) ||
    canMoveKing(movingPiece, row, col)
  )
}

function canMoveKing(
  movingPiece: PieceData,
  row: number,
  col: number,
): boolean {
  const canMoveArea = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]
  return canMoveNonLinearPiece(movingPiece, col, row, canMoveArea)
}
