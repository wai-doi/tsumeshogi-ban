import { FaGithub, FaQuestionCircle } from 'react-icons/fa'

import './App.css'
import { Game } from './components/Game.tsx'

function App(): JSX.Element {
  return (
    <>
      <div className="title-container">
        <h1>詰将棋盤</h1>
        <div className="navigation">
          <a href="https://github.com/wai-doi/tsumeshogi-ban/">
            <FaGithub />
          </a>
          <a href="https://github.com/wai-doi/tsumeshogi-ban/blob/main/README.md">
            <FaQuestionCircle />
          </a>
        </div>
      </div>
      <Game />
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default App
