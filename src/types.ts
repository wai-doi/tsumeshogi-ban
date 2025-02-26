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

export type PieceData = {
  id: string
  kind: PieceKind
  place: Place
  row: number | null
  col: number | null
  promoted: boolean
  opposite: boolean
  promotable: boolean
}

export type Mode = 'edit' | 'solve'
