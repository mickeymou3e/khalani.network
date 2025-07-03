import { StepStatus } from '@tvl-labs/khalani-ui/dist/components/Stepper/Stepper.types'
import { formatTokenSymbol } from '@tvl-labs/sdk'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

import { Step, StepType } from './notification.types'

export const resolveButtonLabel = (
  steps: Step[],
  currentStep: number,
  tokensToApprove: IApprovalToken[],
): string => {
  const activeStep = steps.find((step) => step.id === currentStep)

  const tokenSymbols = tokensToApprove
    .map(({ symbol }) => formatTokenSymbol(symbol))
    .join(' and ')

  let buttonLabel = ''
  if (activeStep?.type === StepType.CREATE_SAFE) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = `Create Khalani account`
        break
      case StepStatus.PENDING:
        buttonLabel = 'Confirm Khalani account creation'
        break
      default:
        buttonLabel = 'Transaction pending...'
    }
  }

  if (activeStep?.type === StepType.APPROVE) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = `Approve ${tokenSymbols}`
        break
      case StepStatus.PENDING:
        buttonLabel = 'Confirm approval in wallet'
        break
      default:
        buttonLabel = 'Transfer pending...'
    }
  }

  if (activeStep?.type === StepType.DEPOSIT) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = 'Add liquidity'
        break
      case StepStatus.PENDING:
        buttonLabel = 'Confirm add liquidity in wallet'
        break
      default:
        buttonLabel = 'Transfer pending...'
    }
  }

  if (activeStep?.type === StepType.BRIDGE) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = 'Bridge'
        break
      case StepStatus.PENDING:
        buttonLabel = 'Sign intent in wallet'
        break
      default:
        buttonLabel = 'Intent created'
    }
  }

  if (activeStep?.type === StepType.WITHDRAW) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = 'Remove liquidity'
        break
      case StepStatus.PENDING:
        buttonLabel = 'Confirm remove liquidity in wallet'
        break
      default:
        buttonLabel = 'Transfer pending...'
    }
  }

  if (activeStep?.type === StepType.STAKE) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = 'Stake'
        break
      case StepStatus.PENDING:
        buttonLabel = 'Confirm stake in wallet'
        break
      default:
        buttonLabel = 'Transfer pending...'
    }
  }

  if (activeStep?.type === StepType.BORROW) {
    switch (activeStep.status) {
      case StepStatus.ACTIVE:
        buttonLabel = 'Borrow'
        break
      case StepStatus.PENDING:
        buttonLabel = 'Confirm borrow in wallet'
        break
      default:
        buttonLabel = 'Transfer pending...'
    }
  }

  return buttonLabel
}

export const checkIfButtonIsDisabled = (steps: Step[], currentStep: number) => {
  const activeStep = steps.find((step) => step.id === currentStep)

  return (
    activeStep?.status === StepStatus.PENDING ||
    (steps.length === currentStep &&
      activeStep?.status === StepStatus.COMPLETED)
  )
}
