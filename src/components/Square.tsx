import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'

import { ModeContext } from './Game.tsx'
import { PromoteModal } from './PromoteModal.tsx'
import './Square.css'

import type {
  NotPromoteHandler,
  PromoteHandler,
  PromotePiece,
} from '../types.ts'

interface SquareProps {
  row: number
  col: number
  children: React.ReactNode
  promotePiece: PromotePiece | null
  onPromote: PromoteHandler
  onNotPromote: NotPromoteHandler
  isDroppableSquare: (row: number, col: number) => boolean
}

export function Square({
  row,
  col,
  children,
  promotePiece,
  onPromote,
  onNotPromote,
  isDroppableSquare,
}: SquareProps): JSX.Element {
  const mode = useContext(ModeContext)
  const isEditing = mode === 'edit'

  const { isOver, setNodeRef } = useDroppable({
    id: `square-${row}-${col}`,
    data: { row: row, col: col },
  })

  const backgroundColor = (): React.CSSProperties['backgroundColor'] => {
    if (isEditing) {
      return isOver ? 'red' : undefined
    }

    if (isDroppableSquare(row, col)) {
      return isOver ? 'red' : '#f7e3a1'
    }

    return undefined
  }

  const style: React.CSSProperties = {
    backgroundColor: backgroundColor(),
  }

  return (
    <>
      <div ref={setNodeRef} className="square" style={style}>
        {children}
        {promotePiece && (
          <PromoteModal
            piece={promotePiece.piece}
            onPromote={onPromote}
            onNotPromote={onNotPromote}
          />
        )}
      </div>
    </>
  )
}
