import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { isEqual } from 'lodash'
import { createContext, useState } from 'react'
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaChessKing,
  FaEdit,
  FaEraser,
  FaTrash,
} from 'react-icons/fa'

import { useCurrentPieces } from '../hooks/useCurrentPieces.ts'
import { useMovePiece } from '../hooks/useMovePiece.ts'
import { usePiecesHistory } from '../hooks/usePiecesHistory.ts'
import { useSavedPieces } from '../hooks/useSavedPieces.ts'
import { Mode } from '../types.ts'

import './Board.css'
import { ColumnNumbers } from './ColumnNumbers.tsx'
import { ModeButton } from './ModeButton.tsx'
import PieceBox from './PieceBox.tsx'
import PieceStand from './PieceStand.tsx'
import { RowNumbers } from './RowNumbers.tsx'
import Square from './Square.tsx'
import Piece from './pieces/Piece.tsx'

export const ModeContext = createContext<Mode>('edit')

export default function Board() {
  const { savedPieces, savePieces, deleteSavedPieces } = useSavedPieces()
  const { currentPieces, setCurrentPieces, clearCurrentPieces } =
    useCurrentPieces(savedPieces)
  const [mode, setMode] = useState<Mode>('edit')

  const {
    currentMove,
    initializePiecesHistory,
    savePiecesHistory,
    firstStepBack,
    stepBack,
    stepForward,
    lastStepForward,
    isFirstMove,
    isLastMove,
  } = usePiecesHistory(currentPieces, setCurrentPieces)

  const { flipPiece, dropPiece } = useMovePiece(
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

  const piecesOnBoard = currentPieces.filter((piece) => piece.place === 'board')
  const piecesInStand = currentPieces.filter((piece) => piece.place === 'stand')
  const piecesInBox = currentPieces.filter(
    (piece) => piece.place === 'box' && !(isSolving && piece.kind === 'king'),
  )

  function renderBoard() {
    return <>{[...Array(9)].map((_, row) => renderRow(row))}</>
  }

  function renderRow(row: number) {
    return (
      <div key={row} className="row">
        {[...Array(9)].map((_, col) => {
          const piece = piecesOnBoard.find(
            (piece) => piece.row === row && piece.col === col,
          )
          return (
            <Square key={col} row={row} col={col}>
              {piece ? (
                <Piece
                  piece={piece}
                  onRightOrDoubleClick={(e) => flipPiece(e, piece.id)}
                />
              ) : null}
            </Square>
          )
        })}
      </div>
    )
  }

  function handleSaveBoard() {
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

  function handleDeleteSavedBoard() {
    if (!savedPieces) return

    if (confirm('保存した配置を消しますか？')) {
      deleteSavedPieces()
    }
  }

  function handleClearBoard() {
    if (confirm('配置をクリアしますか？')) {
      clearCurrentPieces()
    }
  }

  function handleSwitchToEdit() {
    if (isEditing) return

    setMode('edit')
    setCurrentPieces(savedPieces!)
  }

  return (
    <>
      <ModeContext.Provider value={mode}>
        <div className="mode-button-container">
          <ModeButton isActive={isEditing} handleOnClick={handleSwitchToEdit}>
            <FaEdit /> 編集モード
          </ModeButton>
          <ModeButton isActive={isSolving} handleOnClick={handleSaveBoard}>
            <FaChessKing /> 解答モード
          </ModeButton>
        </div>
        <DndContext onDragEnd={dropPiece} sensors={sensors}>
          <div className="board-container">
            <div className="board-and-row-numbers">
              <div>
                <ColumnNumbers />
                <div className="board">{renderBoard()}</div>
              </div>
              <RowNumbers />
            </div>
            <div className="button-stand">
              <div className="buttons">
                {isEditing && (
                  <>
                    <button
                      className="button switch-mode-button"
                      onClick={handleSaveBoard}
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
                    <div className="step-buttons">
                      <button
                        className="step-button"
                        onClick={firstStepBack}
                        disabled={isFirstMove()}
                      >
                        <FaAngleDoubleLeft />
                      </button>
                      <button
                        className="step-button"
                        onClick={stepBack}
                        disabled={isFirstMove()}
                      >
                        <FaAngleLeft />
                      </button>
                      <button
                        className="step-button"
                        onClick={stepForward}
                        disabled={isLastMove()}
                      >
                        <FaAngleRight />
                      </button>
                      <button
                        className="step-button"
                        onClick={lastStepForward}
                        disabled={isLastMove()}
                      >
                        <FaAngleDoubleRight />
                      </button>
                    </div>
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
