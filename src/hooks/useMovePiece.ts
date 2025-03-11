import { isEqual } from 'lodash'

import type {
  Mode,
  PieceData,
  PieceFlipHandler,
  PromotePiece,
} from '../types.ts'
import type { DragEndEvent } from '@dnd-kit/core'

interface UseMovePieceReturn {
  flipPiece: PieceFlipHandler
  dragPieceStart: () => void
  dropPiece: (event: DragEndEvent) => void
}

export function useMovePiece(
  mode: Mode,
  currentPieces: PieceData[],
  setCurrentPieces: React.Dispatch<React.SetStateAction<PieceData[]>>,
  currentMove: number,
  savePiecesHistory: (nextPieces: PieceData[]) => void,
  updateLastPieceHistory: (nextPieces: PieceData[]) => void,
  setPromotePiece: React.Dispatch<React.SetStateAction<PromotePiece | null>>,
): UseMovePieceReturn {
  const isEditing = mode === 'edit'
  const isSolving = mode === 'solve'

  function flipPiece(event: React.MouseEvent, pieceId: string): void {
    event.preventDefault()
    const nextPieces = structuredClone(currentPieces)
    const piece = nextPieces.find((p) => p.id === pieceId)
    if (!piece) return

    if (piece.place !== 'board') return

    if (piece.promotable && !piece.promoted && !piece.opposite) {
      // 自分の駒が成る
      piece.promoted = true
      piece.opposite = false
    } else if (
      (isEditing && piece.promoted && !piece.opposite) ||
      (isEditing && !piece.promotable && !piece.promoted && !piece.opposite) ||
      (isSolving && piece.promoted && piece.opposite) ||
      (isSolving && !piece.promotable && !piece.promoted && piece.opposite)
    ) {
      // 相手の駒にする
      piece.promoted = false
      piece.opposite = true
    } else if (piece.promotable && !piece.promoted && piece.opposite) {
      // 相手の駒が成る
      piece.promoted = true
      piece.opposite = true
    } else if (
      (isEditing && piece.promoted && piece.opposite) ||
      (isEditing && !piece.promotable && !piece.promoted && piece.opposite) ||
      (isSolving && piece.promoted && !piece.opposite) ||
      (isSolving && !piece.promotable && !piece.promoted && !piece.opposite)
    ) {
      // 自分の駒にする
      piece.promoted = false
      piece.opposite = false
    }

    setCurrentPieces(nextPieces)

    if (isSolving) updateLastPieceHistory(nextPieces)
  }

  function dragPieceStart(): void {
    setPromotePiece(null)
  }

  function dropPiece(event: DragEndEvent): void {
    if (!event.over) return

    const nextPieces = structuredClone(currentPieces)

    const movingPiece = nextPieces.find(
      (piece) =>
        piece.id ===
        (event.active.data.current && event.active.data.current.piece.id),
    )!

    if (isNotMoved(movingPiece, event)) return

    // 解答モードのとき駒箱からは出せるのは相手番のみ
    if (isSolving && movingPiece.place === 'box' && currentMove % 2 === 0)
      return

    switch (event.over.id) {
      case 'piece-box':
        // 駒箱に駒を移動させるとき
        movingPiece.place = 'box'
        movingPiece.row = null
        movingPiece.col = null
        movingPiece.promoted = false
        movingPiece.opposite = false
        break
      case 'piece-stand':
        // 駒台に駒を移動させるとき
        movingPiece.place = 'stand'
        movingPiece.row = null
        movingPiece.col = null
        movingPiece.promoted = false
        movingPiece.opposite = false
        break
      default: {
        // 盤に駒を移動させるとき
        if (!event.over.data.current) return

        const newRow = event.over.data.current.row
        const newCol = event.over.data.current.col

        // 駒が成る
        if (isSolving && isPromotable(movingPiece, newRow)) {
          setPromotePiece({ piece: movingPiece, row: newRow, col: newCol })
        }

        const capturedPiece = nextPieces.find(
          (piece) => piece.row === newRow && piece.col === newCol,
        )

        if (capturedPiece) {
          if (!movingPiece.opposite && capturedPiece.opposite) {
            // 相手の駒の上には持ち駒は打てない
            if (isSolving && movingPiece.place === 'stand') return
            // 自分の駒が相手の駒を取るとき
            capturedPiece.place = 'stand'
            capturedPiece.row = null
            capturedPiece.col = null
            capturedPiece.promoted = false
            capturedPiece.opposite = false
          } else if (movingPiece.opposite && !capturedPiece.opposite) {
            // 相手の駒が自分の駒を取るとき
            capturedPiece.place = 'box'
            capturedPiece.row = null
            capturedPiece.col = null
            capturedPiece.promoted = false
            capturedPiece.opposite = false
          } else {
            break
          }
        }

        if (isSolving && movingPiece.place === 'box') {
          // 解答モードでは駒箱の駒を置いたら相手の駒になる
          movingPiece.opposite = true
        }
        movingPiece.place = 'board'
        movingPiece.row = newRow
        movingPiece.col = newCol
      }
    }

    if (isEqual(currentPieces, nextPieces)) return

    setCurrentPieces(nextPieces)

    if (isSolving) savePiecesHistory(nextPieces)
  }

  function isNotMoved(movingPiece: PieceData, event: DragEndEvent): boolean {
    const place = movingPiece.place
    const eventId = event.over!.id

    if (place === 'box' && eventId === 'piece-box') return true
    if (place === 'stand' && eventId === 'piece-stand') return true
    if (place === 'board' && (eventId as string).startsWith('square')) {
      return (
        movingPiece.row === event.over!.data.current!.row &&
        movingPiece.col === event.over!.data.current!.col
      )
    } else {
      return false
    }
  }

  // 移動した駒が成ることができるか
  function isPromotable(movingPiece: PieceData, newRow: number): boolean {
    if (movingPiece.place !== 'board') return false
    if (!movingPiece.promotable) return false
    if (movingPiece.promoted) return false

    if (!movingPiece.opposite) {
      // 自分の駒の場合
      // 敵陣に入るまたは、敵陣から出る
      return newRow <= 2 || (movingPiece.row! <= 2 && newRow >= 3)
    } else {
      // 相手の駒の場合
      // 自陣に入るまたは、自陣から出る
      return newRow >= 6 || (movingPiece.row! >= 6 && newRow <= 5)
    }
  }

  return { flipPiece, dragPieceStart, dropPiece }
}
