import type { DragEndEvent } from '@dnd-kit/core'
import { isEqual } from 'lodash'
import { useContext } from 'react'

import { ModeContext } from '../components/Board.tsx'
import type { PieceData } from '../types.ts'

export function useMovePiece(
  currentPieces: PieceData[],
  setCurrentPieces: React.Dispatch<React.SetStateAction<PieceData[]>>,
  currentMove: number,
  savePiecesHistory: (nextPieces: PieceData[]) => void,
) {
  const mode = useContext(ModeContext)
  const isEditing = mode === 'edit'
  const isSolving = mode === 'solve'

  function flipPiece(event: React.MouseEvent, pieceId: string) {
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

    if (isSolving) savePiecesHistory(nextPieces)
  }

  function dropPiece(event: DragEndEvent) {
    if (!event.over) return

    const nextPieces = structuredClone(currentPieces)

    const movingPiece = nextPieces.find(
      (piece) =>
        piece.id ===
        (event.active.data.current && event.active.data.current.piece.id),
    )!

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

        const capturedPiece = nextPieces.find(
          (piece) =>
            piece.row === event.over!.data.current!.row &&
            piece.col === event.over!.data.current!.col,
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
        movingPiece.row = event.over.data.current.row
        movingPiece.col = event.over.data.current.col
      }
    }

    if (isEqual(currentPieces, nextPieces)) return

    setCurrentPieces(nextPieces)

    if (isSolving) savePiecesHistory(nextPieces)
  }

  return { flipPiece, dropPiece }
}
