import { useState } from 'react'

import type { PieceData, PromotePiece } from '../types.ts'

interface UsePiecesHistoryReturn {
  currentMove: number
  initializePiecesHistory: () => void
  savePiecesHistory: (nextPieces: PieceData[]) => void
  updateLastPieceHistory: (nextPieces: PieceData[]) => void
  handleFirstStepBack: () => void
  handleStepBack: () => void
  handleStepForward: () => void
  handleLastStepForward: () => void
  isFirstMove: () => boolean
  isLastMove: () => boolean
}

export function usePiecesHistory(
  currentPieces: PieceData[],
  setCurrentPieces: React.Dispatch<React.SetStateAction<PieceData[]>>,
  setPromotePiece: React.Dispatch<React.SetStateAction<PromotePiece | null>>,
): UsePiecesHistoryReturn {
  const [history, setHistory] = useState<PieceData[][]>([
    structuredClone(currentPieces),
  ])
  const [currentMove, setCurrentMove] = useState<number>(0)

  function initializePiecesHistory(): void {
    setHistory([structuredClone(currentPieces)])
    setCurrentMove(0)
  }

  function savePiecesHistory(nextPieces: PieceData[]): void {
    // 末尾に新しい盤面を加える
    const nextHistory = [...history.slice(0, currentMove + 1), nextPieces]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function updateLastPieceHistory(nextPieces: PieceData[]): void {
    // 末尾の盤面を上書きする
    const nextHistory = [...history.slice(0, currentMove), nextPieces]
    setHistory(nextHistory)
  }

  function handleFirstStepBack(): void {
    if (currentMove === 0) return
    const nextCurrentMove = 0
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
    setPromotePiece(null)
  }

  function handleStepBack(): void {
    if (currentMove === 0) return
    const nextCurrentMove = currentMove - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
    setPromotePiece(null)
  }

  function handleStepForward(): void {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = currentMove + 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
    setPromotePiece(null)
  }

  function handleLastStepForward(): void {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = history.length - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
    setPromotePiece(null)
  }

  function isFirstMove(): boolean {
    return currentMove === 0
  }

  function isLastMove(): boolean {
    return currentMove === history.length - 1
  }

  return {
    currentMove,
    initializePiecesHistory,
    updateLastPieceHistory,
    savePiecesHistory,
    handleFirstStepBack,
    handleStepBack,
    handleStepForward,
    handleLastStepForward,
    isFirstMove,
    isLastMove,
  }
}
