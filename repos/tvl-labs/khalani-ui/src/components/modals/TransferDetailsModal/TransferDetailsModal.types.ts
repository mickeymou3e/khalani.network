import { IChain, ETransactionStatus } from '@interfaces/core'
import { DialogProps } from '@mui/material'

export interface TransferDetailsModalProps
  extends Omit<DialogProps, 'onClose'> {
  tokenSymbol: string
  sourceChain: IChain
  destinationChain: IChain
  destChains?: IChain[]
  amount: bigint
  tokenDecimals: number
  summaryItems: {
    id: number
    label: string
    value: React.ReactNode
  }[]
  progress: bigint
  statusText: string
  status: ETransactionStatus
  errorMessage?: string
  onClose: () => void
  buttonText?: string
  handleClick?: () => void
  onSourceChainClick?: () => void
  onDestinationChainClick?: () => void
}
