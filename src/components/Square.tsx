import { useDroppable } from '@dnd-kit/core'

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
}

export function Square({
  row,
  col,
  children,
  promotePiece,
  onPromote,
  onNotPromote,
}: SquareProps): JSX.Element {
  const { isOver, setNodeRef } = useDroppable({
    id: `square-${row}-${col}`,
    data: { row: row, col: col },
  })

  const style: React.CSSProperties = {
    background: 'red',
  }

  return (
    <>
      <div ref={setNodeRef} className="square" style={isOver ? style : {}}>
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
