import './ModeButton.css'

type ModeButtonProps = {
  children: React.ReactNode
  isActive: boolean
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>
}

export function ModeButton({
  children,
  isActive,
  handleOnClick,
}: ModeButtonProps) {
  return (
    <button
      className={'mode-button ' + (isActive ? 'active-mode' : 'inactive-mode')}
      onClick={handleOnClick}
    >
      {children}
    </button>
  )
}
