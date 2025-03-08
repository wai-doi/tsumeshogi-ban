import Image from '../../images/black_bishop.png'
import PromotedImage from '../../images/black_horse.png'
import OppositeImage from '../../images/white_bishop.png'
import OppositePromotedImage from '../../images/white_horse.png'

import type { PieceImage } from '../../types.ts'

export const BishopImage: PieceImage = {
  normal: Image,
  promoted: PromotedImage,
  opposite: OppositeImage,
  oppositePromoted: OppositePromotedImage,
}
