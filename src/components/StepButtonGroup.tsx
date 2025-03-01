import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa'

import './StepButtonGroup.css'

type StepButtonGroupProps = {
  firstStepBack: () => void
  stepBack: () => void
  stepForward: () => void
  lastStepForward: () => void
  isFirstMove: () => boolean
  isLastMove: () => boolean
}

export function StepButtonGroup({
  firstStepBack,
  stepBack,
  stepForward,
  lastStepForward,
  isFirstMove,
  isLastMove,
}: StepButtonGroupProps): JSX.Element {
  return (
    <div className="step-buttons">
      <button
        className="step-button"
        onClick={firstStepBack}
        disabled={isFirstMove()}
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        className="step-button"
        onClick={stepBack}
        disabled={isFirstMove()}
      >
        <FaAngleLeft />
      </button>
      <button
        className="step-button"
        onClick={stepForward}
        disabled={isLastMove()}
      >
        <FaAngleRight />
      </button>
      <button
        className="step-button"
        onClick={lastStepForward}
        disabled={isLastMove()}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  )
}
