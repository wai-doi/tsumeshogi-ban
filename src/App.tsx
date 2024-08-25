import './App.css'
import Board from './components/Board.tsx'
import { FaGithub, FaQuestionCircle } from "react-icons/fa";


function App() {
  return (
    <>
      <div className='title-container'>
        <h1>詰将棋盤</h1>
        <div className='navigation'>
          <a href='https://github.com/wai-doi/tsumeshogi-ban/'><FaGithub /></a>
          <a href='https://github.com/wai-doi/tsumeshogi-ban/blob/main/README.md'><FaQuestionCircle /></a>
        </div>
      </div>
      <Board />
    </>
  )
}

export default App
