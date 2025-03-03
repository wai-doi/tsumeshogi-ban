import './ModeButton.css'

interface ModeButtonProps {
  children: React.ReactNode
  isActive: boolean
  onModeSwitch: React.MouseEventHandler<HTMLButtonElement>
}

export function ModeButton({
  children,
  isActive,
  onModeSwitch,
}: ModeButtonProps): JSX.Element {
  return (
    <button
      className={'mode-button ' + (isActive ? 'active-mode' : 'inactive-mode')}
      onClick={onModeSwitch}
    >
      {children}
    </button>
  )
}
