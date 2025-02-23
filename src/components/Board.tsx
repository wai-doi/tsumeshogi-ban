import { createContext, useState } from 'react'
import { isEqual } from 'lodash'
import './Board.css'
import PieceStand from './PieceStand.tsx'
import PieceBox from './PieceBox.tsx'
import Square from './Square.tsx'
import Piece from './pieces/Piece.tsx'
import { ModeButton } from './ModeButton.tsx'
import { useSavedPieces } from '../hooks/useSavedPieces'
import { usePiecesHistory } from '../hooks/usePiecesHistory'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
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

export type handleRightOrDoubleClickType = (
  event: React.MouseEvent,
  pieceID: string,
) => void

export const ModeContext = createContext<Mode>('edit')

export default function Board() {
  function generatePieces(): PieceData[] {
    const pieceNumber: { kind: PieceKind; number: number }[] = [
      { kind: 'pawn', number: 18 },
      { kind: 'lance', number: 4 },
      { kind: 'knight', number: 4 },
      { kind: 'silver', number: 4 },
      { kind: 'gold', number: 4 },
      { kind: 'bishop', number: 2 },
      { kind: 'rook', number: 2 },
      { kind: 'king', number: 2 },
    ]

    function initialPiece(kind: PieceKind, id: number): PieceData {
      const promotable = !(kind === 'gold' || kind === 'king')

      return {
        id: `${kind}-${id}`,
        kind: kind,
        place: 'box',
        row: null,
        col: null,
        promoted: false,
        opposite: false,
        promotable: promotable,
      }
    }

    return pieceNumber
      .map(({ kind, number }) => {
        return [...Array(number)].map((_, i) => initialPiece(kind, i))
      })
      .flat()
  }

  const { savedPieces, savePieces, deleteSavedPieces } = useSavedPieces()
  const [currentPieces, setCurrentPieces] = useState<PieceData[]>(
    savedPieces || generatePieces(),
  )
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

  const pointSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  })
  const sensors = useSensors(pointSensor)

  const isEditing = mode === 'edit'
  const isSolving = mode === 'solve'

  const handleRightOrDoubleClick: handleRightOrDoubleClickType = function (
    event,
    pieceId,
  ) {
    event.preventDefault()
    const nextPieces = structuredClone(currentPieces)
    const piece = nextPieces.find((p) => p.id === pieceId)
    if (!piece) return

    if (piece.place !== 'board') return

    if (piece.promotable && !piece.promoted && !piece.opposite) {
      // 自分の駒が成る
      piece.promoted = true
      piece.opposite = false
    } else if (
      (isEditing && piece.promoted && !piece.opposite) ||
      (isEditing && !piece.promotable && !piece.promoted && !piece.opposite) ||
      (isSolving && piece.promoted && piece.opposite) ||
      (isSolving && !piece.promotable && !piece.promoted && piece.opposite)
    ) {
      // 相手の駒にする
      piece.promoted = false
      piece.opposite = true
    } else if (piece.promotable && !piece.promoted && piece.opposite) {
      // 相手の駒が成る
      piece.promoted = true
      piece.opposite = true
    } else if (
      (isEditing && piece.promoted && piece.opposite) ||
      (isEditing && !piece.promotable && !piece.promoted && piece.opposite) ||
      (isSolving && piece.promoted && !piece.opposite) ||
      (isSolving && !piece.promotable && !piece.promoted && !piece.opposite)
    ) {
      // 自分の駒にする
      piece.promoted = false
      piece.opposite = false
    }

    setCurrentPieces(nextPieces)

    if (isSolving) savePiecesHistory(nextPieces)
  }

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
                  onRightOrDoubleClick={(e: React.MouseEvent) =>
                    handleRightOrDoubleClick(e, piece.id)
                  }
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
      setCurrentPieces(generatePieces())
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
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="board-container">
            <div className="board-and-row-numbers">
              <div>
                <div className="column-numbers">
                  {'987654321'.split('').map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
                <div className="board">{renderBoard()}</div>
              </div>
              <div className="row-numbers">
                {'一二三四五六七八九'.split('').map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>
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

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) return

    const nextPieces = structuredClone(currentPieces)

    const movingPiece = nextPieces.find(
      (piece) =>
        piece.id ===
        (event.active.data.current && event.active.data.current.piece.id),
    )!

    // 解答モードのとき駒箱からは出せるのは相手番のみ
    if (isSolving && movingPiece.place === 'box' && currentMove % 2 === 0)
      return

    switch (event.over.id) {
      case 'piece-box':
        // 駒箱に駒を移動させるとき
        movingPiece.place = 'box'
        movingPiece.row = null
        movingPiece.col = null
        movingPiece.promoted = false
        movingPiece.opposite = false
        break
      case 'piece-stand':
        // 駒台に駒を移動させるとき
        movingPiece.place = 'stand'
        movingPiece.row = null
        movingPiece.col = null
        movingPiece.promoted = false
        movingPiece.opposite = false
        break
      default: {
        // 盤に駒を移動させるとき
        if (!event.over.data.current) return

        const capturedPiece = nextPieces.find(
          (piece) =>
            piece.row === event.over!.data.current!.row &&
            piece.col === event.over!.data.current!.col,
        )

        if (capturedPiece) {
          if (!movingPiece.opposite && capturedPiece.opposite) {
            // 相手の駒の上には持ち駒は打てない
            if (isSolving && movingPiece.place === 'stand') return
            // 自分の駒が相手の駒を取るとき
            capturedPiece.place = 'stand'
            capturedPiece.row = null
            capturedPiece.col = null
            capturedPiece.promoted = false
            capturedPiece.opposite = false
          } else if (movingPiece.opposite && !capturedPiece.opposite) {
            // 相手の駒が自分の駒を取るとき
            capturedPiece.place = 'box'
            capturedPiece.row = null
            capturedPiece.col = null
            capturedPiece.promoted = false
            capturedPiece.opposite = false
          } else {
            break
          }
        }

        if (isSolving && movingPiece.place === 'box') {
          // 解答モードでは駒箱の駒を置いたら相手の駒になる
          movingPiece.opposite = true
        }
        movingPiece.place = 'board'
        movingPiece.row = event.over.data.current.row
        movingPiece.col = event.over.data.current.col
      }
    }

    if (isEqual(currentPieces, nextPieces)) return

    setCurrentPieces(nextPieces)

    if (isSolving) savePiecesHistory(nextPieces)
  }
}
