import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { isEqual } from 'lodash'
import { createContext, useState } from 'react'
import { FaChessKing, FaEdit, FaEraser, FaTrash } from 'react-icons/fa'

import { useCurrentPieces } from '../hooks/useCurrentPieces.ts'
import { useMovePiece } from '../hooks/useMovePiece.ts'
import { usePiecesHistory } from '../hooks/usePiecesHistory.ts'
import { useSavedPieces } from '../hooks/useSavedPieces.ts'

import { Board } from './Board.tsx'
import { ColumnNumbers } from './ColumnNumbers.tsx'
import './Game.css'
import { ModeButton } from './ModeButton.tsx'
import { PieceBox } from './PieceBox.tsx'
import { PieceStand } from './PieceStand.tsx'
import { RowNumbers } from './RowNumbers.tsx'
import { StepButtonGroup } from './StepButtonGroup.tsx'

import type { Mode } from '../types.ts'

export const ModeContext = createContext<Mode>('edit')

export function Game(): JSX.Element {
  const { savedPieces, savePieces, deleteSavedPieces } = useSavedPieces()
  const { currentPieces, setCurrentPieces, clearCurrentPieces } =
    useCurrentPieces(savedPieces)
  const [mode, setMode] = useState<Mode>('edit')

  const {
    currentMove,
    initializePiecesHistory,
    savePiecesHistory,
    handleFirstStepBack,
    handleStepBack,
    handleStepForward,
    handleLastStepForward,
    isFirstMove,
    isLastMove,
  } = usePiecesHistory(currentPieces, setCurrentPieces)

  const { flipPiece, dropPiece } = useMovePiece(
    mode,
    currentPieces,
    setCurrentPieces,
    currentMove,
    savePiecesHistory,
  )

  const pointSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  })
  const sensors = useSensors(pointSensor)

  const isEditing = mode === 'edit'
  const isSolving = mode === 'solve'

  const piecesInStand = currentPieces.filter((piece) => piece.place === 'stand')
  const piecesInBox = currentPieces.filter(
    (piece) => piece.place === 'box' && !(isSolving && piece.kind === 'king'),
  )

  function handleSwitchToSolve(): void {
    if (isSolving) return

    // 保存している盤面と同じであれば、確認ダイアログは表示しない
    if (
      isEqual(savedPieces, currentPieces) ||
      confirm('盤面を保存して解答しますか？')
    ) {
      savePieces(currentPieces)
      setMode('solve')
      initializePiecesHistory()
    }
  }

  function handleDeleteSavedBoard(): void {
    if (!savedPieces) return

    if (confirm('保存した配置を消しますか？')) {
      deleteSavedPieces()
    }
  }

  function handleClearBoard(): void {
    if (confirm('配置をクリアしますか？')) {
      clearCurrentPieces()
    }
  }

  function handleSwitchToEdit(): void {
    if (isEditing) return

    setMode('edit')
    setCurrentPieces(savedPieces!)
  }

  return (
    <>
      <ModeContext.Provider value={mode}>
        <div className="mode-button-container">
          <ModeButton isActive={isEditing} onModeSwitch={handleSwitchToEdit}>
            <FaEdit /> 編集モード
          </ModeButton>
          <ModeButton isActive={isSolving} onModeSwitch={handleSwitchToSolve}>
            <FaChessKing /> 解答モード
          </ModeButton>
        </div>
        <DndContext onDragEnd={dropPiece} sensors={sensors}>
          <div className="board-container">
            <div className="board-and-row-numbers">
              <div>
                <ColumnNumbers />
                <Board currentPieces={currentPieces} onPieceFlip={flipPiece} />
              </div>
              <RowNumbers />
            </div>
            <div className="button-stand">
              <div className="buttons">
                {isEditing && (
                  <>
                    <button
                      className="button switch-mode-button"
                      onClick={handleSwitchToSolve}
                    >
                      <FaChessKing /> 保存して解答する
                    </button>
                    <button
                      className="button"
                      disabled={!savedPieces}
                      onClick={handleDeleteSavedBoard}
                    >
                      <FaTrash /> 保存した配置を消す
                    </button>
                    <button className="button" onClick={handleClearBoard}>
                      <FaEraser /> 配置をクリア
                    </button>
                  </>
                )}
                {isSolving && (
                  <>
                    <button
                      className="button switch-mode-button"
                      onClick={handleSwitchToEdit}
                    >
                      <FaEdit /> 盤面を編集する
                    </button>
                    <span className="current-move">{currentMove} 手目</span>
                    <StepButtonGroup
                      onFirstStepBack={handleFirstStepBack}
                      onStepBack={handleStepBack}
                      onStepForward={handleStepForward}
                      onLastStepForward={handleLastStepForward}
                      isFirstMove={isFirstMove}
                      isLastMove={isLastMove}
                    />
                  </>
                )}
              </div>
              <PieceStand pieces={piecesInStand} />
            </div>
          </div>
          <PieceBox pieces={piecesInBox} />
        </DndContext>
      </ModeContext.Provider>
    </>
  )
}
