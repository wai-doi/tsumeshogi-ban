import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa'
import { styled } from 'styled-components'

const StepButtonsDiv = styled.div`
  display: flex;
  gap: 5px;
`

const StepButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 40px;
  font-size: large;
  font-weight: bold;
`

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
    <StepButtonsDiv>
      <StepButton
        id="first-step-back"
        onClick={onFirstStepBack}
        disabled={isFirstMove()}
      >
        <FaAngleDoubleLeft />
      </StepButton>
      <StepButton id="step-back" onClick={onStepBack} disabled={isFirstMove()}>
        <FaAngleLeft />
      </StepButton>
      <StepButton
        id="step-forward"
        onClick={onStepForward}
        disabled={isLastMove()}
      >
        <FaAngleRight />
      </StepButton>
      <StepButton
        id="last-step-forward"
        onClick={onLastStepForward}
        disabled={isLastMove()}
      >
        <FaAngleDoubleRight />
      </StepButton>
    </StepButtonsDiv>
  )
}
