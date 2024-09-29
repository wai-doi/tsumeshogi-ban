import PawnImage from './PawnImage'
import LanceImage from './LanceImage'
import KnightImage from './KnightImage'
import SilverImage from './SilverImage'
import GoldImage from './GoldImage'
import BishopImage from './BishopImage'
import RookImage from './RookImage'
import KingImage from './KingImage'
import './Piece.css'
import { useDraggable } from '@dnd-kit/core'
import { PieceType, handleRightOrDoubleClickType } from '../Board'

export default function Piece({
  piece,
  onRightOrDoubleClick,
}: {
  piece: PieceType
  onRightOrDoubleClick?: handleRightOrDoubleClickType
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece.id,
    data: { piece: piece },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const getImageSet = () => {
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

  const imagePath = () => {
    const imageSet = getImageSet()!

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
