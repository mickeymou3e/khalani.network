import { StepperProps } from '@components/Stepper'
import { IChildren } from '@interfaces/children'
import { IModal } from '@interfaces/core'

export interface ITransactionSummaryModalProps
  extends IModal,
    StepperProps,
    IChildren {
  buttonLabel: string
  secondaryButtonLabel: string
  isButtonDisabled: boolean
  currentStep: number
  handleButtonClick: () => void
  handleSecondaryButtonClick: () => void
}
