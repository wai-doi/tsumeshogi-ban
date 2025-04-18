import { styled } from 'styled-components'

import { BishopImage } from './pieces/BishopImage.tsx'
import { GoldImage } from './pieces/GoldImage.tsx'
import { KingImage } from './pieces/KingImage.tsx'
import { KnightImage } from './pieces/KnightImage.tsx'
import { LanceImage } from './pieces/LanceImage.tsx'
import { PawnImage } from './pieces/PawnImage.tsx'
import { RookImage } from './pieces/RookImage.tsx'
import { SilverImage } from './pieces/SilverImage.tsx'

import type {
  NotPromoteHandler,
  PieceData,
  PieceImage,
  PieceKind,
  PromoteHandler,
} from '../types.ts'

const PromoteModalDiv = styled.div`
  position: absolute;
  top: 70px;
  left: -30px;
  z-index: 100;
  display: flex;
  background-color: orange;
`

const PromoteModalImg = styled.img`
  width: 60px;
  height: 64px;
  cursor: pointer;
  border: 2px solid #c67a2d;
`

const PieceImageMap = new Map<PieceKind, PieceImage>([
  ['pawn', PawnImage],
  ['lance', LanceImage],
  ['knight', KnightImage],
  ['silver', SilverImage],
  ['gold', GoldImage],
  ['bishop', BishopImage],
  ['rook', RookImage],
  ['king', KingImage],
])

interface PromoteModalProps {
  piece: PieceData
  onPromote: PromoteHandler
  onNotPromote: NotPromoteHandler
}

export function PromoteModal({
  piece,
  onPromote,
  onNotPromote,
}: PromoteModalProps): JSX.Element {
  const pieceImage = PieceImageMap.get(piece.kind)!
  const normalImage = piece.opposite ? pieceImage.opposite : pieceImage.normal
  const promotedImage = piece.opposite
    ? pieceImage.oppositePromoted
    : pieceImage.promoted

  return (
    <PromoteModalDiv>
      <PromoteModalImg
        className="promote"
        src={promotedImage}
        onClick={() => onPromote(piece.id)}
      ></PromoteModalImg>
      <PromoteModalImg
        className="normal"
        src={normalImage}
        onClick={onNotPromote}
      ></PromoteModalImg>
    </PromoteModalDiv>
  )
}
