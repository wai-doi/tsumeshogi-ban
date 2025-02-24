import { createContext, useState } from 'react'
import { isEqual } from 'lodash'
import './Board.css'
import PieceStand from './PieceStand.tsx'
import PieceBox from './PieceBox.tsx'
import Square from './Square.tsx'
import Piece from './pieces/Piece.tsx'
import { ModeButton } from './ModeButton.tsx'
import { ColumnNumbers } from './ColumnNumbers.tsx'
import { RowNumbers } from './RowNumbers.tsx'
import { useSavedPieces } from '../hooks/useSavedPieces'
import { useCurrentPieces } from '../hooks/useCurrentPieces.ts'
import { usePiecesHistory } from '../hooks/usePiecesHistory'
import { useMovePiece } from '../hooks/useMovePiece'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  FaTrash,
  FaEraser,
  FaEdit,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaChessKing,
} from 'react-icons/fa'

export type PieceKind =
  | 'pawn'
  | 'lance'
  | 'knight'
  | 'silver'
  | 'gold'
  | 'bishop'
  | 'rook'
  | 'king'

type Place = 'board' | 'stand' | 'box'

export type PieceData = {
  id: string
  kind: PieceKind
  place: Place
  row: number | null
  col: number | null
  promoted: boolean
  opposite: boolean
  promotable: boolean
}

type Mode = 'edit' | 'solve'

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
