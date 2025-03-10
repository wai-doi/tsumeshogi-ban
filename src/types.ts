export type PieceKind =
  | 'pawn'
  | 'lance'
  | 'knight'
  | 'silver'
  | 'gold'
  | 'bishop'
  | 'rook'
  | 'king'

type Place = 'board' | 'stand' | 'box'

export interface PieceData {
  id: string
  kind: PieceKind
  place: Place
  row: number | null
  col: number | null
  promoted: boolean
  opposite: boolean
  promotable: boolean
}

export interface PieceImage {
  normal: string
  promoted: string | undefined
  opposite: string
  oppositePromoted: string | undefined
}

export type Mode = 'edit' | 'solve'

export interface PromotePiece {
  piece: PieceData
  row: number
  col: number
}

export interface PieceFlipHandler {
  (event: React.MouseEvent, pieceId: string): void
}

export interface PromoteHandler {
  (pieceId: string): void
}

export interface NotPromoteHandler {
  (): void
}
