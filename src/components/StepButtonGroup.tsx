import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa'

import './StepButtonGroup.css'

interface StepButtonGroupProps {
  onFirstStepBack: () => void
  onStepBack: () => void
  onStepForward: () => void
  onLastStepForward: () => void
  isFirstMove: () => boolean
  isLastMove: () => boolean
}

export function StepButtonGroup({
  onFirstStepBack,
  onStepBack,
  onStepForward,
  onLastStepForward,
  isFirstMove,
  isLastMove,
}: StepButtonGroupProps): JSX.Element {
  return (
    <div className="step-buttons">
      <button
        id="first-step-back"
        className="step-button"
        onClick={onFirstStepBack}
        disabled={isFirstMove()}
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        id="step-back"
        className="step-button"
        onClick={onStepBack}
        disabled={isFirstMove()}
      >
        <FaAngleLeft />
      </button>
      <button
        id="step-forward"
        className="step-button"
        onClick={onStepForward}
        disabled={isLastMove()}
      >
        <FaAngleRight />
      </button>
      <button
        id="last-step-forward"
        className="step-button"
        onClick={onLastStepForward}
        disabled={isLastMove()}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  )
}
