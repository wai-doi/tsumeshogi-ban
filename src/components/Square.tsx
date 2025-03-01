import { useDroppable } from '@dnd-kit/core'

import './Square.css'

export function Square({
  row,
  col,
  children,
}: {
  row: number
  col: number
  children: React.ReactNode
}): JSX.Element {
  const { isOver, setNodeRef } = useDroppable({
    id: `square-${row}-${col}`,
    data: { row: row, col: col },
  })

  const style = {
    background: 'red',
  }

  return (
    <>
      <div ref={setNodeRef} className="square" style={isOver ? style : {}}>
        {children}
      </div>
    </>
  )
}
