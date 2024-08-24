import './PieceBox.css'
import {useDroppable} from '@dnd-kit/core';
import {PieceType} from './Board'
import Piece from './pieces/Piece'

export default function PieceBox({pieces}: {pieces: PieceType[]}) {
  const {setNodeRef} = useDroppable({
    id: 'piece-box',
  });

  return(
    <div ref={setNodeRef} className='piece-box'>
      {pieces.map((piece) => {
        return <Piece piece={piece}/>
      })}
    </div>
  )
}
