import { styled } from 'styled-components'

const RowNumbersDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding-top: 48px;
  padding-bottom: 30px;
  font-size: small;
  color: gray;
`

export function RowNumbers(): JSX.Element {
  return (
    <RowNumbersDiv>
      {'一二三四五六七八九'.split('').map((num) => (
        <span key={num}>{num}</span>
      ))}
    </RowNumbersDiv>
  )
}
