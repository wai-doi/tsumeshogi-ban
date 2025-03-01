import { useState } from 'react'

import type { PieceData } from '../types.ts'

interface UsePiecesHistoryReturn {
  currentMove: number
  initializePiecesHistory: () => void
  savePiecesHistory: (nextPieces: PieceData[]) => void
  firstStepBack: () => void
  stepBack: () => void
  stepForward: () => void
  lastStepForward: () => void
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

  function firstStepBack(): void {
    if (currentMove === 0) return
    const nextCurrentMove = 0
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function stepBack(): void {
    if (currentMove === 0) return
    const nextCurrentMove = currentMove - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function stepForward(): void {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = currentMove + 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function lastStepForward(): void {
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
    firstStepBack,
    stepBack,
    stepForward,
    lastStepForward,
    isFirstMove,
    isLastMove,
  }
}
