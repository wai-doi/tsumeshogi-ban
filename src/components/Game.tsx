import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { isEqual } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaEdit, FaEraser, FaPlay, FaTrash } from 'react-icons/fa'
import { styled } from 'styled-components'

import { ModeContext } from '../contexts/modeContext.ts'
import { useCurrentPieces } from '../hooks/useCurrentPieces.ts'
import { useMovePiece } from '../hooks/useMovePiece.ts'
import { usePiecesHistory } from '../hooks/usePiecesHistory.ts'
import { usePromotePiece } from '../hooks/usePromotePiece.ts'
import { useSavedPieces } from '../hooks/useSavedPieces.ts'
import { loadPiecesFromSfen, toSfen } from '../utils/sfen.ts'

import { Board } from './Board.tsx'
import { ColumnNumbers } from './ColumnNumbers.tsx'
import { PieceBox } from './PieceBox.tsx'
import { PieceStand } from './PieceStand.tsx'
import { RowNumbers } from './RowNumbers.tsx'
import { SfenLoader } from './SfenLoader.tsx'
import { StepButtonGroup } from './StepButtonGroup.tsx'

import type { Mode, PromotePiece } from '../types.ts'

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const BoardAndRowNumbersDiv = styled.div`
  display: flex;
  gap: 2px;
`

const ButtonsAndStandDiv = styled.div`
  display: flex;
  flex-flow: column;
  width: 14rem;
  margin-left: 20px;
`

const Buttons = styled.div`
  display: flex;
  flex-flow: column;
`

const PieceStandContainer = styled.div`
  margin-top: auto;
`

const SfenLoaderContainer = styled.div`
  margin-top: 14px;
  margin-bottom: 5px;
`

const EditButtons = styled.div`
  display: flex;
  flex-flow: column;
  gap: 12px;

  button {
    margin-bottom: 0;
  }
`

const CurrentMode = styled.div`
  width: 13rem;
  margin-bottom: 10px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
`

const ModeBadge = styled.span<{ $isEditing: boolean }>`
  display: inline-block;
  margin-left: 6px;
  padding: 2px 8px;
  color: ${({ $isEditing }): string => ($isEditing ? '#d4ecff' : '#fff5cf')};
  background-color: ${({ $isEditing }): string =>
    $isEditing ? '#114f86' : '#8c5d04'};
  border-radius: 999px;
`

const CurrentMove = styled.div`
  margin-bottom: 5px;
  font-weight: bold;
`

const Button = styled.button`
  width: 12.5rem;
  height: 44px;
  margin-bottom: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 10px;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 0 0 2px rgb(255 255 255 / 16%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

const SwitchModeButton = styled(Button)`
  color: white;
  background-color: rgb(31 75 140);
  border-color: rgb(31 75 140);

  &:hover:not(:disabled) {
    background-color: rgb(38 89 163);
    border-color: rgb(62 120 203);
  }
`

const SecondaryButton = styled(Button)`
  height: 40px;
  color: #d4d8df;
  background-color: rgb(255 255 255 / 4%);
  border: 1px solid #697385;
  font-size: 1rem;

  &:hover:not(:disabled) {
    background-color: rgb(255 255 255 / 10%);
    border-color: #8d99af;
  }
`

const DangerTextButton = styled.button`
  width: 12.5rem;
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: #d7abab;
  background-color: rgb(87 30 30 / 45%);
  border: 1px solid rgb(160 63 63 / 75%);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    color: #ecc9c9;
    background-color: rgb(109 42 42 / 55%);
    border-color: rgb(187 91 91 / 85%);
    transform: translateY(-1px);
  }

  &:disabled {
    color: #7f6a6a;
    background-color: rgb(63 44 44 / 45%);
    border-color: rgb(107 85 85 / 70%);
    cursor: not-allowed;
  }
`

function getSfenFromQuery(): string | null {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('sfen')
}

function setSfenToQuery(sfen: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('sfen', sfen)

  const nextPath = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(null, '', nextPath)
}

function toSfenUrl(sfen: string): URL {
  const url = new URL(window.location.href)
  url.searchParams.set('sfen', sfen)
  return url
}

function copyTextByExecCommand(text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.top = '-9999px'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  const copied = document.execCommand('copy')
  document.body.removeChild(textArea)

  return copied
}

export function Game(): JSX.Element {
  const { savedPieces, savePieces, deleteSavedPieces } = useSavedPieces()
  const { currentPieces, setCurrentPieces, clearCurrentPieces } =
    useCurrentPieces(savedPieces)
  const [mode, setMode] = useState<Mode>('edit')
  const [sfenInput, setSfenInput] = useState<string>('')
  const hasLoadedSfenFromQuery = useRef<boolean>(false)

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

  const loadSfen = useCallback(
    (inputSfen: string, shouldUpdateQuery: boolean): string | null => {
      const normalizedSfen = inputSfen.trim()
      const result = loadPiecesFromSfen(normalizedSfen, currentPieces)

      if ('error' in result) {
        return result.error
      }

      setCurrentPieces(result.pieces)
      setSfenInput(normalizedSfen)
      setPromotePiece(null)

      if (shouldUpdateQuery) {
        setSfenToQuery(normalizedSfen)
      }

      return null
    },
    [currentPieces, setCurrentPieces],
  )

  useEffect(() => {
    if (hasLoadedSfenFromQuery.current) return
    hasLoadedSfenFromQuery.current = true

    const sfenInQuery = getSfenFromQuery()
    if (!sfenInQuery) return

    setSfenInput(sfenInQuery)
    loadSfen(sfenInQuery, false)
  }, [loadSfen])

  function handleSwitchToSolve(): void {
    if (isSolving) return

    // 保存している盤面と同じであれば、確認ダイアログは表示しない
    if (
      isEqual(savedPieces, currentPieces) ||
      confirm('盤面を保存して解答を開始しますか？')
    ) {
      savePieces(currentPieces)
      setMode('solve')
      initializePiecesHistory()
    }
  }

  function handleDeleteSavedBoard(): void {
    if (!savedPieces) return

    if (confirm('保存データを削除しますか？')) {
      deleteSavedPieces()
    }
  }

  function handleClearBoard(): void {
    if (confirm('盤面を初期化しますか？')) {
      clearCurrentPieces()
    }
  }

  function handleSwitchToEdit(): void {
    if (isEditing) return

    setMode('edit')
    setCurrentPieces(savedPieces!)
    setPromotePiece(null)
  }

  function handleLoadSfen(sfenInput: string): string | null {
    return loadSfen(sfenInput, true)
  }

  async function handleCopyShareUrl(): Promise<string | null> {
    const sfen = toSfen(currentPieces)
    const shareUrl = toSfenUrl(sfen).toString()

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else if (!copyTextByExecCommand(shareUrl)) {
        return 'コピーに失敗しました'
      }
    } catch {
      return 'コピーに失敗しました'
    }

    return null
  }

  return (
    <>
      <ModeContext.Provider value={mode}>
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
              <CurrentMode>
                現在モード:
                <ModeBadge $isEditing={isEditing}>
                  {isEditing ? '編集' : '解答'}
                </ModeBadge>
              </CurrentMode>
              <Buttons>
                {isEditing && (
                  <EditButtons>
                    <SwitchModeButton onClick={handleSwitchToSolve}>
                      <FaPlay /> 解答を開始
                    </SwitchModeButton>
                    <SecondaryButton onClick={handleClearBoard}>
                      <FaEraser /> 盤面を初期化
                    </SecondaryButton>
                    <DangerTextButton
                      disabled={!savedPieces}
                      onClick={handleDeleteSavedBoard}
                    >
                      <FaTrash /> 保存データを削除
                    </DangerTextButton>
                  </EditButtons>
                )}
                {isSolving && (
                  <>
                    <SwitchModeButton onClick={handleSwitchToEdit}>
                      <FaEdit /> 編集に戻る
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
              {isEditing && (
                <SfenLoaderContainer>
                  <SfenLoader
                    onCopyShareUrl={handleCopyShareUrl}
                    onLoadSfen={handleLoadSfen}
                    onSfenInputChange={setSfenInput}
                    sfenInput={sfenInput}
                  />
                </SfenLoaderContainer>
              )}
              <PieceStandContainer>
                <PieceStand pieces={piecesInStand} currentMove={currentMove} />
              </PieceStandContainer>
            </ButtonsAndStandDiv>
          </BoardContainer>
          <PieceBox pieces={piecesInBox} currentMove={currentMove} />
        </DndContext>
      </ModeContext.Provider>
    </>
  )
}
