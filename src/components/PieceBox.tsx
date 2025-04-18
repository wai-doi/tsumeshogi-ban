import { useDroppable } from '@dnd-kit/core'
import { styled } from 'styled-components'

import { Piece } from './pieces/Piece.tsx'

import type { PieceData, PieceKind } from '../types.ts'

const PieceBoxDiv = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 5px 0;
  background-color: bisque;
  border-radius: 10px;
`

const PieceGroupDiv = styled.div`
  display: grid;
`

const Overlay = styled.div`
  grid-area: 1 / 1;
`

const PieceNumber = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: black;
`

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
        // 重ねたとき id の番号が小さい駒が前面になるように並べるため unshift にしている
        pieceArray.unshift(piece)
      } else {
        groupedPieces.push({ kind: piece.kind, pieceArray: [piece] })
      }
    })

    return groupedPieces
  }

  return (
    <PieceBoxDiv ref={setNodeRef} id="piece-box">
      {groupedPieces().map(({ kind, pieceArray }) => (
        <div key={kind}>
          <PieceGroupDiv>
            {pieceArray.map((piece) => (
              <Overlay key={piece.id}>
                <Piece piece={piece} currentMove={currentMove} />
              </Overlay>
            ))}
          </PieceGroupDiv>
          <PieceNumber>✖️{pieceArray.length}</PieceNumber>
        </div>
      ))}
    </PieceBoxDiv>
  )
}
