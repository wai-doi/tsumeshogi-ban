import PromotedImage from '../../images/black_dragon.png'
import Image from '../../images/black_rook.png'
import OppositePromotedImage from '../../images/white_dragon.png'
import OppositeImage from '../../images/white_rook.png'

import type { PieceImage } from '../../types.ts'

export const RookImage: PieceImage = {
  normal: Image,
  promoted: PromotedImage,
  opposite: OppositeImage,
  oppositePromoted: OppositePromotedImage,
}
