import { useState } from 'react';
import './Board.css'
import PieceStand from './PieceStand.tsx'
import PieceBox from './PieceBox.tsx'
import Square from './Square.tsx'
import Piece from './pieces/Piece.tsx'
import { DndContext, DragEndEvent } from '@dnd-kit/core';

type PieceKind =
  | 'pawn'
  | 'lance'
  | 'knight'
  | 'silver'
  | 'gold'
  | 'bishop'
  | 'rook'
  | 'king'

type Place =
  | 'board'
  | 'stand'
  | 'box'

export type PieceType = {
  id: string,
  kind: PieceKind,
  place: Place,
  row: number | null,
  col: number | null,
  promoted: boolean,
  opposite: boolean,
  promotable: boolean
}

export type handleRightClickType = (event: React.MouseEvent, pieceID: string) => void

export default function Board() {
  function generatePieces(): PieceType[] {
    const pieceNumber: {kind: PieceKind, number: number}[] = [
      {kind: 'pawn', number: 10},
      {kind: 'lance', number: 4},
      {kind: 'knight', number: 4},
      {kind: 'silver', number: 4},
      {kind: 'gold', number: 4},
      {kind: 'bishop', number: 2},
      {kind: 'rook', number: 2},
      {kind: 'king', number: 2}
    ]

    function initialPiece(kind: PieceKind, id: number): PieceType {
      const promotable = !(kind === 'gold' || kind === 'king')

      return({
        id: `${kind}-${id}`,
        kind: kind,
        place: 'box',
        row: null,
        col: null,
        promoted: false,
        opposite: false,
        promotable: promotable
      })
    }

    return(pieceNumber.map(({kind, number}) => {
      return([...Array(number)].map((_, i) => initialPiece(kind, i)))
    }).flat()
  )}

  const [pieces, setPieces] = useState<PieceType[]>(generatePieces());

  const handleRightClick: handleRightClickType = function (event, pieceId) {
    event.preventDefault()
    const nextPieces = pieces.slice();
    const piece = nextPieces.find(p => p.id === pieceId);
    if (!piece) return

    if (piece.place !== 'board') return;

    if (piece.promotable && !piece.promoted && !piece.opposite) {
      // 自分の駒が成る
      piece.promoted = true;
      piece.opposite = false;
    } else if (piece.promoted && !piece.opposite || !piece.promotable && !piece.promoted && !piece.opposite) {
      // 相手の駒にする
      piece.promoted = false;
      piece.opposite = true;
    } else if (piece.promotable && !piece.promoted && piece.opposite) {
      // 相手の駒が成る
      piece.promoted = true;
      piece.opposite = true;
    } else if (piece.promoted && piece.opposite || !piece.promotable && !piece.promoted && piece.opposite) {
      // 自分の駒にする
      piece.promoted = false;
      piece.opposite = false;
    }

    setPieces(nextPieces);
  }

  const piecesOnBoard = pieces.filter((piece) => piece.place === 'board')
  const piecesInStand = pieces.filter((piece) => piece.place === 'stand')
  const piecesInBox = pieces.filter((piece) => piece.place === 'box')

  function renderBoard() {
    return(
      <>
        {[...Array(9)].map((_, row) => renderRow(row))}
      </>
    )
  }

  function renderRow(row: number) {
    return(
      <div className='row'>
        {[...Array(9)].map((_, col) => {
          const piece = piecesOnBoard.find((piece) => piece.row === row && piece.col === col)
          return(
            <Square row={row} col={col}>
              {piece ? <Piece piece={piece} onRightClick={(e: React.MouseEvent) => handleRightClick(e, piece.id)}/> : null}
            </Square>
          )
        })}
      </div>
    )
  }

  return(
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className='board-and-stand'>
          <div className='board'>
            {renderBoard()}
          </div>
          <PieceStand pieces={piecesInStand}/>
        </div>
        <PieceBox pieces={piecesInBox}/>
      </DndContext>
    </>
  )

  function handleDragEnd(event: DragEndEvent) {
    if(!event.over) return

    const nextPieces = pieces.slice();

    const movingPiece = nextPieces.find((piece) => piece.id === (event.active.data.current && event.active.data.current.piece.id))!

    switch(event.over.id) {
      case 'piece-box':
        // 駒箱に駒を移動させるとき
        movingPiece.place = 'box'
        movingPiece.row = null
        movingPiece.col = null
        movingPiece.promoted = false
        movingPiece.opposite = false
        break
      case 'piece-stand':
        // 駒台に駒を移動させるとき
        movingPiece.place = 'stand'
        movingPiece.row = null
        movingPiece.col = null
        movingPiece.promoted = false
        movingPiece.opposite = false
        break
      default: {
        // 盤に駒を移動させるとき
        if(!(event.over.data.current)) return

        const capturedPiece = nextPieces.find((piece) => piece.row === event.over!.data.current!.row && piece.col === event.over!.data.current!.col)

        if (capturedPiece) {
          if (!movingPiece.opposite && capturedPiece.opposite) {
            // 自分の駒が相手の駒を取るとき
            capturedPiece.place = 'stand'
            capturedPiece.row = null
            capturedPiece.col = null
            capturedPiece.promoted = false
            capturedPiece.opposite = false
          } else if (movingPiece.opposite && !capturedPiece.opposite) {
            // 相手の駒が自分の駒を取るとき
            capturedPiece.place = 'box'
            capturedPiece.row = null
            capturedPiece.col = null
            capturedPiece.promoted = false
            capturedPiece.opposite = false
          } else {
            break
          }
        }

        movingPiece.place = 'board'
        movingPiece.row = event.over.data.current.row
        movingPiece.col = event.over.data.current.col
      }
    }

    setPieces(nextPieces)
  }
}
