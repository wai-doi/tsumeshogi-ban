import { useDroppable } from '@dnd-kit/core'

import './PieceBox.css'
import { Piece } from './pieces/Piece.tsx'

import type { PieceData, PieceKind } from '../types.ts'

interface PieceBoxProps {
  pieces: PieceData[]
  currentMove: number
}

export function PieceBox({ pieces, currentMove }: PieceBoxProps): JSX.Element {
  const { setNodeRef } = useDroppable({
    id: 'piece-box',
  })

  function groupedPieces(): {
    kind: PieceKind
    pieceArray: PieceData[]
  }[] {
    const groupedPieces: { kind: PieceKind; pieceArray: PieceData[] }[] = []
    pieces.forEach((piece) => {
      const pieceArray = groupedPieces.find(
        ({ kind }) => kind === piece.kind,
      )?.pieceArray

      if (pieceArray) {
        pieceArray.push(piece)
      } else {
        groupedPieces.push({ kind: piece.kind, pieceArray: [piece] })
      }
    })

    return groupedPieces
  }

  return (
    <div ref={setNodeRef} className="piece-box">
      {groupedPieces().map(({ kind, pieceArray }) => (
        <div key={kind}>
          <div className="piece-group">
            {pieceArray.map((piece) => (
              <div key={piece.id} className="overlay">
                <Piece piece={piece} currentMove={currentMove} />
              </div>
            ))}
          </div>
          <span className="piece-number">✖️{pieceArray.length}</span>
        </div>
      ))}
    </div>
  )
}
