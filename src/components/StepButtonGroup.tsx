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
        className="step-button"
        onClick={onFirstStepBack}
        disabled={isFirstMove()}
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        className="step-button"
        onClick={onStepBack}
        disabled={isFirstMove()}
      >
        <FaAngleLeft />
      </button>
      <button
        className="step-button"
        onClick={onStepForward}
        disabled={isLastMove()}
      >
        <FaAngleRight />
      </button>
      <button
        className="step-button"
        onClick={onLastStepForward}
        disabled={isLastMove()}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  )
}
