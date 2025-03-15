import { useDraggable } from '@dnd-kit/core'
import { useContext } from 'react'

import { ModeContext } from '../Game.tsx'

import { BishopImage } from './BishopImage.tsx'
import { GoldImage } from './GoldImage.tsx'
import { KingImage } from './KingImage.tsx'
import { KnightImage } from './KnightImage.tsx'
import { LanceImage } from './LanceImage.tsx'
import { PawnImage } from './PawnImage.tsx'
import './Piece.css'
import { RookImage } from './RookImage.tsx'
import { SilverImage } from './SilverImage.tsx'

import type { PieceData, PieceFlipHandler, PieceImage } from '../../types.ts'

interface PieceProps {
  piece: PieceData
  currentMove: number
  onRightOrDoubleClick?: PieceFlipHandler
}

export function Piece({
  piece,
  currentMove,
  onRightOrDoubleClick,
}: PieceProps): JSX.Element {
  const mode = useContext(ModeContext)

  const isDraggable = (): boolean => {
    if (mode === 'edit') return true

    const isMyTurn = currentMove % 2 === 0

    switch (piece.place) {
      case 'board':
        return (isMyTurn && !piece.opposite) || (!isMyTurn && piece.opposite)
      case 'stand':
        return isMyTurn
      case 'box':
        return !isMyTurn
    }
  }

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: piece.id,
      data: { piece: piece },
      disabled: !isDraggable(),
    })

  const cursor = (): React.CSSProperties['cursor'] => {
    if (isDragging) {
      return 'grabbing'
    } else if (isDraggable()) {
      return 'grab'
    } else {
      return 'default'
    }
  }

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: cursor(),
    zIndex: isDragging ? 10 : 1,
  }

  const getImageSet = (): PieceImage => {
    switch (piece.kind) {
      case 'pawn':
        return PawnImage
        break
      case 'lance':
        return LanceImage
        break
      case 'knight':
        return KnightImage
        break
      case 'silver':
        return SilverImage
        break
      case 'gold':
        return GoldImage
        break
      case 'bishop':
        return BishopImage
        break
      case 'rook':
        return RookImage
        break
      case 'king':
        return KingImage
        break
    }
  }

  const imagePath = (): string | undefined => {
    const imageSet = getImageSet()!

    // 解答モードで駒箱からドラッグするとき相手の駒にする
    if (mode === 'solve' && piece.place === 'box' && isDragging)
      return imageSet.opposite

    if (!piece.promoted && !piece.opposite) {
      return imageSet.normal
    } else if (piece.promoted && !piece.opposite) {
      return imageSet.promoted
    } else if (!piece.promoted && piece.opposite) {
      return imageSet.opposite
    } else if (piece.promoted && piece.opposite) {
      return imageSet.oppositePromoted
    }
  }

  return (
    <>
      <span>
        <img
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          src={imagePath()}
          className="piece"
          onContextMenu={(e) =>
            onRightOrDoubleClick && onRightOrDoubleClick(e, piece.id)
          }
          onDoubleClick={(e) =>
            onRightOrDoubleClick && onRightOrDoubleClick(e, piece.id)
          }
        />
      </span>
    </>
  )
}
