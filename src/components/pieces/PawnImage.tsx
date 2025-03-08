import Image from '../../images/black_pawn.png'
import PromotedImage from '../../images/black_prom_pawn.png'
import OppositeImage from '../../images/white_pawn.png'
import OppositePromotedImage from '../../images/white_prom_pawn.png'

import type { PieceImage } from '../../types.ts'

export const PawnImage: PieceImage = {
  normal: Image,
  promoted: PromotedImage,
  opposite: OppositeImage,
  oppositePromoted: OppositePromotedImage,
}
