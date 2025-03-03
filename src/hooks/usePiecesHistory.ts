import { useState } from 'react'

import type { PieceData } from '../types.ts'

interface UsePiecesHistoryReturn {
  currentMove: number
  initializePiecesHistory: () => void
  savePiecesHistory: (nextPieces: PieceData[]) => void
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

  function handleFirstStepBack(): void {
    if (currentMove === 0) return
    const nextCurrentMove = 0
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function handleStepBack(): void {
    if (currentMove === 0) return
    const nextCurrentMove = currentMove - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function handleStepForward(): void {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = currentMove + 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function handleLastStepForward(): void {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = history.length - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
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
    savePiecesHistory,
    handleFirstStepBack,
    handleStepBack,
    handleStepForward,
    handleLastStepForward,
    isFirstMove,
    isLastMove,
  }
}
