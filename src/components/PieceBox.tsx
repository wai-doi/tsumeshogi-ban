import './PieceBox.css'
import { useDroppable } from '@dnd-kit/core'
import { PieceType, PieceKind } from './Board'
import Piece from './pieces/Piece'

export default function PieceBox({ pieces }: { pieces: PieceType[] }) {
  const { setNodeRef } = useDroppable({
    id: 'piece-box',
  })

  function groupedPieces() {
    const groupedPieces: { kind: PieceKind; pieceArray: PieceType[] }[] = []
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
