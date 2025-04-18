import { styled } from 'styled-components'

import { Square } from './Square.tsx'
import { Piece } from './pieces/Piece.tsx'

import type {
  NotPromoteHandler,
  PieceData,
  PieceFlipHandler,
  PromoteHandler,
  PromotePiece,
} from '../types.ts'

const RowDiv = styled.div`
  display: flex;
  justify-content: center;
`

const BoardDiv = styled.div`
  border: 5px solid #d38457;
`

interface BoardProps {
  currentPieces: PieceData[]
  onPieceFlip: PieceFlipHandler
  promotePiece: PromotePiece | null
  onPromote: PromoteHandler
  onNotPromote: NotPromoteHandler
  currentMove: number
  isDroppableSquare: (row: number, col: number) => boolean
}

export function Board({
  currentPieces,
  onPieceFlip,
  promotePiece,
  onPromote,
  onNotPromote,
  currentMove,
  isDroppableSquare,
}: BoardProps): JSX.Element {
  const piecesOnBoard = currentPieces.filter((piece) => piece.place === 'board')
  const positionMap = new Map<string, PieceData>(
    piecesOnBoard.map((piece) => [`${piece.row}-${piece.col}`, piece]),
  )

  function renderRow(row: number): JSX.Element {
    return (
      <RowDiv key={row}>
        {[...Array(9)].map((_, col) => {
          const isPromotePiece =
            promotePiece && row === promotePiece.row && col === promotePiece.col
          const piece = positionMap.get(`${row}-${col}`)
          return (
            <Square
              key={col}
              row={row}
              col={col}
              promotePiece={isPromotePiece ? promotePiece : null}
              onPromote={onPromote}
              onNotPromote={onNotPromote}
              isDroppableSquare={isDroppableSquare}
            >
              {piece && (
                <Piece
                  piece={piece}
                  currentMove={currentMove}
                  onRightOrDoubleClick={(e) => onPieceFlip(e, piece.id)}
                />
              )}
            </Square>
          )
        })}
      </RowDiv>
    )
  }

  return <BoardDiv>{[...Array(9)].map((_, row) => renderRow(row))}</BoardDiv>
}
