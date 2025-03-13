import './Board.css'
import { Square } from './Square.tsx'
import { Piece } from './pieces/Piece.tsx'

import type {
  NotPromoteHandler,
  PieceData,
  PieceFlipHandler,
  PromoteHandler,
  PromotePiece,
} from '../types.ts'
interface BoardProps {
  currentPieces: PieceData[]
  onPieceFlip: PieceFlipHandler
  promotePiece: PromotePiece | null
  onPromote: PromoteHandler
  onNotPromote: NotPromoteHandler
  currentMove: number
}

export function Board({
  currentPieces,
  onPieceFlip,
  promotePiece,
  onPromote,
  onNotPromote,
  currentMove,
}: BoardProps): JSX.Element {
  const piecesOnBoard = currentPieces.filter((piece) => piece.place === 'board')
  const positionMap = new Map<string, PieceData>(
    piecesOnBoard.map((piece) => [`${piece.row}-${piece.col}`, piece]),
  )

  function renderRow(row: number): JSX.Element {
    return (
      <div key={row} className="row">
        {[...Array(9)].map((_, col) => {
          const isPromotePiece =
            promotePiece && row === promotePiece.row && col === promotePiece.col
          const piece = positionMap.get(`${row}-${col}`)
          return (
            <Square
              key={col}
              row={row}
              col={col}
              promotePiece={isPromotePiece ? promotePiece : null}
              onPromote={onPromote}
              onNotPromote={onNotPromote}
            >
              {piece && (
                <Piece
                  piece={piece}
                  currentMove={currentMove}
                  onRightOrDoubleClick={(e) => onPieceFlip(e, piece.id)}
                />
              )}
            </Square>
          )
        })}
      </div>
    )
  }

  return (
    <div className="board">{[...Array(9)].map((_, row) => renderRow(row))}</div>
  )
}
