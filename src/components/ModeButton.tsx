import './ModeButton.css'

interface ModeButtonProps {
  children: React.ReactNode
  isActive: boolean
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>
}

export function ModeButton({
  children,
  isActive,
  handleOnClick,
}: ModeButtonProps): JSX.Element {
  return (
    <button
      className={'mode-button ' + (isActive ? 'active-mode' : 'inactive-mode')}
      onClick={handleOnClick}
    >
      {children}
    </button>
  )
}
