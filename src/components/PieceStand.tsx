import { useDroppable } from '@dnd-kit/core'

import './PieceStand.css'
import { Piece } from './pieces/Piece.tsx'

import type { PieceData } from '../types.ts'

interface PieceStandProps {
  pieces: PieceData[]
  currentMove: number
}

export function PieceStand({
  pieces,
  currentMove,
}: PieceStandProps): JSX.Element {
  const { setNodeRef } = useDroppable({
    id: 'piece-stand',
  })

  return (
    <>
      <div ref={setNodeRef} className="piece-stand">
        {[...pieces].reverse().map((piece, index) => {
          return <Piece key={index} piece={piece} currentMove={currentMove} />
        })}
      </div>
    </>
  )
}
