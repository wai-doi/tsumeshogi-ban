import Image from '../../images/black_gold.png'
import OppositeImage from '../../images/white_gold.png'

import type { PieceImage } from '../../types.ts'

export const GoldImage: PieceImage = {
  normal: Image,
  promoted: undefined,
  opposite: OppositeImage,
  oppositePromoted: undefined,
}
