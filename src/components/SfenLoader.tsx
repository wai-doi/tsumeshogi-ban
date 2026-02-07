import { useState } from 'react'
import { styled } from 'styled-components'

const SfenLoadContainer = styled.div`
  width: 13rem;
  text-align: left;
`

const SfenLabel = styled.label`
  display: inline-block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: bold;
`

const SfenInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  margin-bottom: 8px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 13px;
`

const SfenLoadButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  padding: 0 8px;
  color: white;
  background-color: rgb(31 75 140);
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
`

const SfenError = styled.p<{ $visible: boolean }>`
  height: 36px;
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 18px;
  color: #f55;
  overflow-y: auto;
  visibility: ${({ $visible }): string => ($visible ? 'visible' : 'hidden')};
`

interface SfenLoaderProps {
  onLoadSfen: (sfen: string) => string | null
}

export function SfenLoader({ onLoadSfen }: SfenLoaderProps): JSX.Element {
  const [sfenInput, setSfenInput] = useState<string>('')
  const [sfenError, setSfenError] = useState<string | null>(null)

  function handleChangeSfenInput(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setSfenInput(event.target.value)
    if (sfenError) setSfenError(null)
  }

  function handleLoadSfen(): void {
    const error = onLoadSfen(sfenInput)
    setSfenError(error)
  }

  function handleKeyDownSfenInput(
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void {
    if (event.key !== 'Enter') return
    if (event.nativeEvent.isComposing) return

    event.preventDefault()
    handleLoadSfen()
  }

  return (
    <SfenLoadContainer>
      <SfenLabel htmlFor="sfen-input">SFEN</SfenLabel>
      <SfenInput
        id="sfen-input"
        type="text"
        placeholder="例: 7ks/5+P3/9/9/9/9/9/9/9 b GS"
        value={sfenInput}
        onChange={handleChangeSfenInput}
        onKeyDown={handleKeyDownSfenInput}
      />
      <SfenLoadButton id="load-sfen-button" onClick={handleLoadSfen}>
        読込
      </SfenLoadButton>
      <SfenError id="sfen-error" role="alert" $visible={!!sfenError}>
        {sfenError || ''}
      </SfenError>
    </SfenLoadContainer>
  )
}
