import { useState } from 'react'

import type { PieceData } from '../types.ts'

export function usePiecesHistory(
  currentPieces: PieceData[],
  setCurrentPieces: React.Dispatch<React.SetStateAction<PieceData[]>>,
) {
  const [history, setHistory] = useState<PieceData[][]>([
    structuredClone(currentPieces),
  ])
  const [currentMove, setCurrentMove] = useState<number>(0)

  function initializePiecesHistory() {
    setHistory([structuredClone(currentPieces)])
    setCurrentMove(0)
  }

  function savePiecesHistory(nextPieces: PieceData[]) {
    // 末尾に新しい盤面を加える
    const nextHistory = [...history.slice(0, currentMove + 1), nextPieces]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function firstStepBack() {
    if (currentMove === 0) return
    const nextCurrentMove = 0
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function stepBack() {
    if (currentMove === 0) return
    const nextCurrentMove = currentMove - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function stepForward() {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = currentMove + 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function lastStepForward() {
    if (currentMove === history.length - 1) return
    const nextCurrentMove = history.length - 1
    setCurrentMove(nextCurrentMove)
    setCurrentPieces(history[nextCurrentMove])
  }

  function isFirstMove() {
    return currentMove === 0
  }

  function isLastMove() {
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
