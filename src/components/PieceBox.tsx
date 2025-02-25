import { useDroppable } from '@dnd-kit/core'

import { PieceData, PieceKind } from './Board.tsx'
import './PieceBox.css'
import Piece from './pieces/Piece.tsx'

export default function PieceBox({ pieces }: { pieces: PieceData[] }) {
  const { setNodeRef } = useDroppable({
    id: 'piece-box',
  })

  function groupedPieces() {
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
                <Piece piece={piece} />
              </div>
            ))}
          </div>
          <span className="piece-number">✖️{pieceArray.length}</span>
        </div>
      ))}
    </div>
  )
}
