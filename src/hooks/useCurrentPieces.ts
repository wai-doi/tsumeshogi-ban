import { useState } from 'react'
import { PieceData, PieceKind } from '../components/Board'

export function useCurrentPieces(savedPieces: PieceData[] | null) {
  const [currentPieces, setCurrentPieces] = useState<PieceData[]>(
    savedPieces || generatePieces(),
  )

  function generatePieces(): PieceData[] {
    const pieceNumber: { kind: PieceKind; number: number }[] = [
      { kind: 'pawn', number: 18 },
      { kind: 'lance', number: 4 },
      { kind: 'knight', number: 4 },
      { kind: 'silver', number: 4 },
      { kind: 'gold', number: 4 },
      { kind: 'bishop', number: 2 },
      { kind: 'rook', number: 2 },
      { kind: 'king', number: 2 },
    ]

    function initialPiece(kind: PieceKind, id: number): PieceData {
      const promotable = !(kind === 'gold' || kind === 'king')

      return {
        id: `${kind}-${id}`,
        kind: kind,
        place: 'box',
        row: null,
        col: null,
        promoted: false,
        opposite: false,
        promotable: promotable,
      }
    }

    return pieceNumber
      .map(({ kind, number }) => {
        return [...Array(number)].map((_, i) => initialPiece(kind, i))
      })
      .flat()
  }

  function clearCurrentPieces() {
    setCurrentPieces(generatePieces())
  }

  return { currentPieces, setCurrentPieces, clearCurrentPieces }
}
