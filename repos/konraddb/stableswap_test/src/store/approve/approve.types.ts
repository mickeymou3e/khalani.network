import { IApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.types'

export interface IApproveSliceState {
  loading: boolean
  approvalTokens: IApprovalToken[]
  error?: string
}
