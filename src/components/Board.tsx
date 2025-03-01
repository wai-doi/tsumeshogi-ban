import { FlipPieceType, PieceData } from '../types.ts'

import './Board.css'
import { Square } from './Square.tsx'
import { Piece } from './pieces/Piece.tsx'

export function Board({
  currentPieces,
  flipPiece,
}: {
  currentPieces: PieceData[]
  flipPiece: FlipPieceType
}): JSX.Element {
  const piecesOnBoard = currentPieces.filter((piece) => piece.place === 'board')

  function renderRow(row: number): JSX.Element {
    return (
      <div key={row} className="row">
        {[...Array(9)].map((_, col) => {
          const piece = piecesOnBoard.find(
            (piece) => piece.row === row && piece.col === col,
          )
          return (
            <Square key={col} row={row} col={col}>
              {piece ? (
                <Piece
                  piece={piece}
                  onRightOrDoubleClick={(e) => flipPiece(e, piece.id)}
                />
              ) : null}
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
