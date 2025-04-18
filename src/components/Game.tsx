import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { isEqual } from 'lodash'
import { useState } from 'react'
import { FaChessKing, FaEdit, FaEraser, FaTrash } from 'react-icons/fa'
import { styled } from 'styled-components'

import { ModeContext } from '../contexts/modeContext.ts'
import { useCurrentPieces } from '../hooks/useCurrentPieces.ts'
import { useMovePiece } from '../hooks/useMovePiece.ts'
import { usePiecesHistory } from '../hooks/usePiecesHistory.ts'
import { usePromotePiece } from '../hooks/usePromotePiece.ts'
import { useSavedPieces } from '../hooks/useSavedPieces.ts'

import { Board } from './Board.tsx'
import { ColumnNumbers } from './ColumnNumbers.tsx'
import { ModeButton } from './ModeButton.tsx'
import { PieceBox } from './PieceBox.tsx'
import { PieceStand } from './PieceStand.tsx'
import { RowNumbers } from './RowNumbers.tsx'
import { StepButtonGroup } from './StepButtonGroup.tsx'

import type { Mode, PromotePiece } from '../types.ts'

const ModeButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
  font-weight: bold;
`

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`

const BoardAndRowNumbersDiv = styled.div`
  display: flex;
  gap: 2px;
`

const ButtonsAndStandDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 14rem;
  margin-left: 20px;
`

const Buttons = styled.div`
  display: flex;
  flex-flow: column;
`

const CurrentMove = styled.div`
  margin-bottom: 5px;
  font-weight: bold;
`

const Button = styled.button`
  width: 13rem;
  height: 50px;
  margin-bottom: 30px;
  font-size: large;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  border-radius: 10px;
`

const SwitchModeButton = styled(Button)`
  color: white;
  background-color: rgb(31 75 140);
`

export function Game(): JSX.Element {
  const { savedPieces, savePieces, deleteSavedPieces } = useSavedPieces()
  const { currentPieces, setCurrentPieces, clearCurrentPieces } =
    useCurrentPieces(savedPieces)
  const [mode, setMode] = useState<Mode>('edit')

  const [promotePiece, setPromotePiece] = useState<PromotePiece | null>(null)

  const {
    currentMove,
    initializePiecesHistory,
    savePiecesHistory,
    updateLastPieceHistory,
    handleFirstStepBack,
    handleStepBack,
    handleStepForward,
    handleLastStepForward,
    isFirstMove,
    isLastMove,
  } = usePiecesHistory(currentPieces, setCurrentPieces, setPromotePiece)

  const { flipPiece, dragPieceStart, dropPiece, isDroppableSquare } =
    useMovePiece(
      mode,
      currentPieces,
      setCurrentPieces,
      currentMove,
      savePiecesHistory,
      updateLastPieceHistory,
      setPromotePiece,
    )

  const { promote, notPromote } = usePromotePiece(
    currentPieces,
    setCurrentPieces,
    promotePiece,
    setPromotePiece,
    updateLastPieceHistory,
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
    setPromotePiece(null)
  }

  return (
    <>
      <ModeContext.Provider value={mode}>
        <ModeButtonContainer>
          <ModeButton isActive={isEditing} onModeSwitch={handleSwitchToEdit}>
            <FaEdit /> 編集モード
          </ModeButton>
          <ModeButton isActive={isSolving} onModeSwitch={handleSwitchToSolve}>
            <FaChessKing /> 解答モード
          </ModeButton>
        </ModeButtonContainer>
        <DndContext
          onDragStart={dragPieceStart}
          onDragEnd={dropPiece}
          sensors={sensors}
        >
          <BoardContainer>
            <BoardAndRowNumbersDiv>
              <div>
                <ColumnNumbers />
                <Board
                  currentPieces={currentPieces}
                  onPieceFlip={flipPiece}
                  promotePiece={promotePiece}
                  onPromote={promote}
                  onNotPromote={notPromote}
                  currentMove={currentMove}
                  isDroppableSquare={isDroppableSquare}
                />
              </div>
              <RowNumbers />
            </BoardAndRowNumbersDiv>
            <ButtonsAndStandDiv>
              <Buttons>
                {isEditing && (
                  <>
                    <SwitchModeButton onClick={handleSwitchToSolve}>
                      <FaChessKing /> 保存して解答する
                    </SwitchModeButton>
                    <Button
                      disabled={!savedPieces}
                      onClick={handleDeleteSavedBoard}
                    >
                      <FaTrash /> 保存した配置を消す
                    </Button>
                    <Button onClick={handleClearBoard}>
                      <FaEraser /> 配置をクリア
                    </Button>
                  </>
                )}
                {isSolving && (
                  <>
                    <SwitchModeButton onClick={handleSwitchToEdit}>
                      <FaEdit /> 盤面を編集する
                    </SwitchModeButton>
                    <CurrentMove>{currentMove} 手目</CurrentMove>
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
              </Buttons>
              <PieceStand pieces={piecesInStand} currentMove={currentMove} />
            </ButtonsAndStandDiv>
          </BoardContainer>
          <PieceBox pieces={piecesInBox} currentMove={currentMove} />
        </DndContext>
      </ModeContext.Provider>
    </>
  )
}
