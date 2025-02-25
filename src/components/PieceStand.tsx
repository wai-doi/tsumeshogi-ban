import { useDroppable } from '@dnd-kit/core'

import { PieceData } from './Board.tsx'
import './PieceStand.css'
import Piece from './pieces/Piece.tsx'

export default function PieceStand({ pieces }: { pieces: PieceData[] }) {
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
