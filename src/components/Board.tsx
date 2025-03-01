import { FlipPieceType, PieceData } from '../types.ts'

import './Board.css'
import { Square } from './Square.tsx'
import { Piece } from './pieces/Piece.tsx'

interface BoardProps {
  currentPieces: PieceData[]
  flipPiece: FlipPieceType
}

export function Board({ currentPieces, flipPiece }: BoardProps): JSX.Element {
  const piecesOnBoard = currentPieces.filter((piece) => piece.place === 'board')
  const positionMap = new Map<string, PieceData>(
    piecesOnBoard.map((piece) => [`${piece.row}-${piece.col}`, piece]),
  )

  function renderRow(row: number): JSX.Element {
    return (
      <div key={row} className="row">
        {[...Array(9)].map((_, col) => {
          const piece = positionMap.get(`${row}-${col}`)
          return (
            <Square key={col} row={row} col={col}>
              {piece && (
                <Piece
                  piece={piece}
                  onRightOrDoubleClick={(e) => flipPiece(e, piece.id)}
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
