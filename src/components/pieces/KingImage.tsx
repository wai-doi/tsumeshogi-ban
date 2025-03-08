import Image from '../../images/black_king2.png'
import OppositeImage from '../../images/white_king2.png'

import type { PieceImage } from '../../types.ts'

export const KingImage: PieceImage = {
  normal: Image,
  promoted: undefined,
  opposite: OppositeImage,
  oppositePromoted: undefined,
}
