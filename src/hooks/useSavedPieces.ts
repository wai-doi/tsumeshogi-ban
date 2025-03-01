import { useState } from 'react'

import type { PieceData } from '../types.ts'

interface UseSavedPiecesReturn {
  savedPieces: PieceData[] | null
  savePieces: (pieces: PieceData[]) => void
  deleteSavedPieces: () => void
}

export function useSavedPieces(): UseSavedPiecesReturn {
  const localStorageKey = 'pieces'

  const [savedPieces, setSavedPieces] = useState<PieceData[] | null>(
    JSON.parse(localStorage.getItem(localStorageKey) || 'null'),
  )

  function savePieces(pieces: PieceData[]): void {
    localStorage.setItem(localStorageKey, JSON.stringify(pieces))
    setSavedPieces(pieces)
  }

  function deleteSavedPieces(): void {
    localStorage.removeItem(localStorageKey)
    setSavedPieces(null)
  }

  return { savedPieces, savePieces, deleteSavedPieces }
}
