import { FaGithub, FaQuestionCircle } from 'react-icons/fa'
import { styled } from 'styled-components'

import { Game } from './components/Game.tsx'

const RootContainer = styled.div`
  max-width: 65%;
  margin: 0 auto;
  text-align: center;
  user-select: none;
`

const TitleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Navigation = styled.div`
  position: absolute;
  right: 0;
  font-size: 40px;
  color: white;

  a {
    margin: 0 10px;
    color: white;
  }
`

function App(): JSX.Element {
  return (
    <RootContainer>
      <TitleContainer>
        <h1>詰将棋盤</h1>
        <Navigation>
          <a href="https://github.com/wai-doi/tsumeshogi-ban/">
            <FaGithub />
          </a>
          <a href="https://github.com/wai-doi/tsumeshogi-ban/blob/main/README.md">
            <FaQuestionCircle />
          </a>
        </Navigation>
      </TitleContainer>
      <Game />
    </RootContainer>
  )
}

// eslint-disable-next-line import/no-default-export
export default App
