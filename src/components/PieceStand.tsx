import { useDroppable } from '@dnd-kit/core'
import { styled } from 'styled-components'

import { Piece } from './pieces/Piece.tsx'

import type { PieceData } from '../types.ts'

const PieceStandDiv = styled.div`
  width: 200px;
  height: 200px;
  background-color: rgb(192 129 27);
  border: 5px solid #a26330;
`
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
      <PieceStandDiv ref={setNodeRef} id="piece-stand">
        {[...pieces].reverse().map((piece, index) => {
          return <Piece key={index} piece={piece} currentMove={currentMove} />
        })}
      </PieceStandDiv>
    </>
  )
}
