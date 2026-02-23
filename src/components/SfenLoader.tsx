import { useEffect, useState } from 'react'
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
  margin-bottom: 8px;
  padding: 0 8px;
  color: white;
  background-color: rgb(31 75 140);
  border: 1px solid rgb(31 75 140);
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background-color: rgb(38 89 163);
    border-color: rgb(62 120 203);
    box-shadow: 0 0 0 2px rgb(255 255 255 / 16%);
    transform: translateY(-1px);
  }
`

const ShareUrlCopyButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  padding: 0 8px;
  color: white;
  background-color: rgb(43 109 133);
  border: 1px solid rgb(43 109 133);
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background-color: rgb(53 130 158);
    border-color: rgb(76 156 185);
    box-shadow: 0 0 0 2px rgb(255 255 255 / 16%);
    transform: translateY(-1px);
  }
`

const Message = styled.p<{ $isError: boolean; $visible: boolean }>`
  height: 36px;
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 18px;
  color: ${({ $isError }): string => ($isError ? '#f55' : '#4da255')};
  overflow-y: auto;
  visibility: ${({ $visible }): string => ($visible ? 'visible' : 'hidden')};
`

interface SfenLoaderProps {
  onCopyShareUrl: () => Promise<string | null>
  onLoadSfen: (sfen: string) => string | null
  onSfenInputChange: (sfen: string) => void
  sfenInput: string
}

const copyResultDisplayMs = 3000

export function SfenLoader({
  onCopyShareUrl,
  onLoadSfen,
  onSfenInputChange,
  sfenInput,
}: SfenLoaderProps): JSX.Element {
  const [message, setMessage] = useState<string>('')
  const [messageIsError, setMessageIsError] = useState<boolean>(false)

  useEffect((): void | (() => void) => {
    if (!message || messageIsError) return

    const timeoutId = window.setTimeout(() => {
      setMessage('')
    }, copyResultDisplayMs)

    return (): void => {
      window.clearTimeout(timeoutId)
    }
  }, [message, messageIsError])

  function handleChangeSfenInput(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    onSfenInputChange(event.target.value)
    if (messageIsError && message) setMessage('')
  }

  function handleLoadSfen(): void {
    const error = onLoadSfen(sfenInput)
    if (error) {
      setMessage(error)
      setMessageIsError(true)
      return
    }

    setMessage('')
  }

  async function handleCopyShareUrl(): Promise<void> {
    const error = await onCopyShareUrl()
    if (error) {
      setMessage(error)
      setMessageIsError(true)
      return
    }

    setMessage('共有用URLをコピーしました')
    setMessageIsError(false)
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
      <ShareUrlCopyButton
        id="copy-share-url-button"
        onClick={() => void handleCopyShareUrl()}
      >
        共有URLをコピー
      </ShareUrlCopyButton>
      <Message
        id="sfen-message"
        role={messageIsError ? 'alert' : 'status'}
        $visible={!!message}
        $isError={messageIsError}
      >
        {message}
      </Message>
    </SfenLoadContainer>
  )
}
