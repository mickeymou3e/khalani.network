import { select, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { StepStatus } from '@tvl-labs/khalani-ui/dist/components/Stepper/Stepper.types'
import { allowanceSelectors, safeSelector } from '@tvl-labs/sdk'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

import { notificationActions } from './notification.slice'
import {
  InitializeNotificationParams,
  Step,
  StepType,
} from './notification.types'

export function* createNotificationFlow(
  action: PayloadAction<InitializeNotificationParams>,
): Generator {
  try {
    const steps: Step[] = []
    const { tokensToApprove: approvalTokens, type } = action.payload

    const allowances = yield* select(allowanceSelectors.allowances)
    const safeDeployed = yield* select(safeSelector.deployed)

    const tokensToApprove: IApprovalToken[] = []
    for (let index = 0; index < approvalTokens.length; index++) {
      const approvalToken = approvalTokens[index]
      const amount = approvalToken.amount
      const tokenAddress = approvalToken.address
      const foundAllowance = allowances.find(
        (allowance) =>
          allowance.tokenAddress.toLowerCase() === tokenAddress.toLowerCase() &&
          allowance.spender.toLowerCase() ===
            approvalToken.spender.toLowerCase() &&
          allowance.owner.toLowerCase() === approvalToken.owner.toLowerCase(),
      )
      if (foundAllowance && foundAllowance.balance < amount) {
        tokensToApprove.push(approvalToken)
      }
    }

    const areTokensToApprove = tokensToApprove.length > 0

    if (action.payload.type === StepType.WITHDRAW) {
      steps.push({
        id: 1,
        status: safeDeployed ? StepStatus.COMPLETED : StepStatus.ACTIVE,
        type: StepType.CREATE_SAFE,
      })
    }

    steps.push({
      id: steps.length + 1,
      status: areTokensToApprove
        ? steps.find((i) => i.status === StepStatus.ACTIVE)
          ? StepStatus.IDLE
          : StepStatus.ACTIVE
        : StepStatus.COMPLETED,
      type: StepType.APPROVE,
    })

    steps.push({
      id: steps.length + 1,
      status: steps.find((i) => i.status === StepStatus.ACTIVE)
        ? StepStatus.IDLE
        : StepStatus.ACTIVE,
      type,
    })

    const currentStep =
      steps.find((i) => i.status === StepStatus.ACTIVE)?.id || 1
    yield* put(notificationActions.setCurrentStep(currentStep))

    yield* put(notificationActions.setTokensToApprove(tokensToApprove))
    yield* put(notificationActions.initializeNotificationSuccess(steps))
  } catch (error) {
    console.error(error)
    yield* put(notificationActions.initializeNotificationFailure())
  }
}
