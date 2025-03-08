import Image from '../../images/black_lance.png'
import PromotedImage from '../../images/black_prom_lance.png'
import OppositeImage from '../../images/white_lance.png'
import OppositePromotedImage from '../../images/white_prom_lance.png'

import type { PieceImage } from '../../types.ts'

export const LanceImage: PieceImage = {
  normal: Image,
  promoted: PromotedImage,
  opposite: OppositeImage,
  oppositePromoted: OppositePromotedImage,
}
