import './Board.css'
import Cell from './Cell'

export const Board = () => {
  const renderRow = () =>  {
    return(
      <>
        <div className='row'>
          {[...Array(9)].map(() => (<Cell/>))}
        </div>
      </>
    )
  }

  return(
    <>
      <div className='board'>
        {renderRow()}
        {renderRow()}
        {renderRow()}
        {renderRow()}
        {renderRow()}
        {renderRow()}
        {renderRow()}
        {renderRow()}
        {renderRow()}
      </div>
    </>
  )
}

export default Board
