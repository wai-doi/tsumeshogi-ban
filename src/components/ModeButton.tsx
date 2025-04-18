import { styled } from 'styled-components'

interface ModeButtonProps {
  children: React.ReactNode
  isActive: boolean
  onModeSwitch: React.MouseEventHandler<HTMLButtonElement>
}

const StyledButton = styled.button<{ isActive: boolean }>`
  padding: 8px 15px;
  font-size: 16px;
  font-weight: bold;
  color: ${({ isActive }): string => (isActive ? 'white' : '#bbb')};
  background-color: ${({ isActive }): string =>
    isActive ? '#007bff' : '#444'};
  border: 2px solid ${({ isActive }): string => (isActive ? '#0056b3' : '#666')};
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: ${({ isActive }): string =>
      isActive ? '#007bff' : '#666'};
    border-color: white;
    transform: scale(1.05);
  }
`

export function ModeButton({
  children,
  isActive,
  onModeSwitch,
}: ModeButtonProps): JSX.Element {
  return (
    <StyledButton isActive={isActive} onClick={onModeSwitch}>
      {children}
    </StyledButton>
  )
}
