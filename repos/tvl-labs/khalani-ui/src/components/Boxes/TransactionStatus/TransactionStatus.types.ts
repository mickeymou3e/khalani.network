import { ETransactionStatus } from '@interfaces/core'

export interface ITransactionStatusProps {
  status: ETransactionStatus
  progress: bigint
  statusText: string
  errorMessage?: string
  isTooltipVisible?: boolean
}
