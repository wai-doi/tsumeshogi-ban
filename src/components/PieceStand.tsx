import { useDroppable } from '@dnd-kit/core'

import type { PieceData } from '../types.ts'

import './PieceStand.css'
import { Piece } from './pieces/Piece.tsx'

export function PieceStand({ pieces }: { pieces: PieceData[] }): JSX.Element {
  const { setNodeRef } = useDroppable({
    id: 'piece-stand',
  })

  return (
    <>
      <div ref={setNodeRef} className="piece-stand">
        {[...pieces].reverse().map((piece, index) => {
          return <Piece key={index} piece={piece} />
        })}
      </div>
    </>
  )
}
