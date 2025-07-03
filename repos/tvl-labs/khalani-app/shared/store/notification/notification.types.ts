import { Step as StepUI } from '@tvl-labs/khalani-ui'
import { RequestStatus } from '@tvl-labs/sdk'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

export interface NotificationStore {
  steps: Step[]
  status: RequestStatus
  tokensToApprove: IApprovalToken[]
  currentStep: number
  type: StepType | null
}

export interface Step extends StepUI {
  type: StepType
}

export interface InitializeNotificationParams {
  tokensToApprove: IApprovalToken[]
  type: StepType
}

export enum StepType {
  APPROVE,
  DEPOSIT,
  WITHDRAW,
  BRIDGE,
  CREATE_SAFE,
  STAKE,
  BORROW,
}
