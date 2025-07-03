import { Network } from '@constants/Networks'

import { IApprovalToken } from '../ApproveButton/ApproveButton.types'

export interface IConfirmButtonProps {
  onClick: () => void
  text: string
  disabled: boolean
  expectedChainId: Network
  tokensWithAmount?: IApprovalToken[]
}
