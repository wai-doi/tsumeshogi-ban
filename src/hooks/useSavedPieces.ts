import { useState } from 'react'
import { PieceData } from '../components/Board'

export function useSavedPieces() {
  const localStorageKey = 'pieces'

  const [savedPieces, setSavedPieces] = useState<PieceData[] | null>(
    JSON.parse(localStorage.getItem(localStorageKey) || 'null'),
  )

  function savePieces(pieces: PieceData[]) {
    localStorage.setItem(localStorageKey, JSON.stringify(pieces))
    setSavedPieces(pieces)
  }

  function deleteSavedPieces() {
    localStorage.removeItem(localStorageKey)
    setSavedPieces(null)
  }

  return { savedPieces, savePieces, deleteSavedPieces }
}
