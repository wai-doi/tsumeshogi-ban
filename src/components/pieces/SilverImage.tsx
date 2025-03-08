import PromotedImage from '../../images/black_prom_silver.png'
import Image from '../../images/black_silver.png'
import OppositePromotedImage from '../../images/white_prom_silver.png'
import OppositeImage from '../../images/white_silver.png'

import type { PieceImage } from '../../types.ts'

export const SilverImage: PieceImage = {
  normal: Image,
  promoted: PromotedImage,
  opposite: OppositeImage,
  oppositePromoted: OppositePromotedImage,
}
