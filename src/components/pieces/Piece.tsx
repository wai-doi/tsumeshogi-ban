import { useDraggable } from '@dnd-kit/core'
import { useContext } from 'react'

import type { FlipPieceType, PieceData } from '../../types.ts'
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

type getImageSetReturn =
  | {
      normal: string
      promoted: string
      opposite: string
      oppositePromoted: string
    }
  | {
      normal: string
      promoted: undefined
      opposite: string
      oppositePromoted: undefined
    }

interface PieceProps {
  piece: PieceData
  onRightOrDoubleClick?: FlipPieceType
}

export function Piece({
  piece,
  onRightOrDoubleClick,
}: PieceProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: piece.id,
      data: { piece: piece },
    })

  const mode = useContext(ModeContext)

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const getImageSet = (): getImageSetReturn => {
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
