import { styled } from 'styled-components'

const ColumnNumbersDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 33px;
  font-size: small;
  color: gray;
`

export function ColumnNumbers(): JSX.Element {
  return (
    <ColumnNumbersDiv>
      {'987654321'.split('').map((num) => (
        <span key={num}>{num}</span>
      ))}
    </ColumnNumbersDiv>
  )
}
