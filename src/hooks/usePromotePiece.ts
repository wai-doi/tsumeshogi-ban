import type {
  NotPromoteHandler,
  PieceData,
  PromoteHandler,
  PromotePiece,
} from '../types.ts'

interface UsePromotePieceReturn {
  promotePiece: PromotePiece | null
  setPromotePiece: React.Dispatch<React.SetStateAction<PromotePiece | null>>
  promote: PromoteHandler
  notPromote: NotPromoteHandler
}

export function usePromotePiece(
  currentPieces: PieceData[],
  setCurrentPieces: React.Dispatch<React.SetStateAction<PieceData[]>>,
  promotePiece: PromotePiece | null,
  setPromotePiece: React.Dispatch<React.SetStateAction<PromotePiece | null>>,
  updateLastPieceHistory: (nextPieces: PieceData[]) => void,
): UsePromotePieceReturn {
  function promote(pieceId: string): void {
    const nextPieces = structuredClone(currentPieces)
    const piece = nextPieces.find((p) => p.id === pieceId)

    piece!.promoted = true

    setCurrentPieces(nextPieces)
    updateLastPieceHistory(nextPieces)
    setPromotePiece(null)
  }

  function notPromote(): void {
    setPromotePiece(null)
  }

  return { promotePiece, setPromotePiece, promote, notPromote }
}
