import './PieceStand.css'
import { useDroppable } from '@dnd-kit/core'
import { PieceType } from './Board'
import Piece from './pieces/Piece'

export default function PieceStand({ pieces }: { pieces: PieceType[] }) {
  const { setNodeRef } = useDroppable({
    id: 'piece-stand',
  })

  return (
    <>
      <div ref={setNodeRef} className="piece-stand">
        {pieces.map((piece) => {
          return <Piece piece={piece} />
        })}
      </div>
    </>
  )
}
