import { IChain, ETransactionStatus } from '@interfaces/core'

export interface TransactionProcessingProps {
  sourceChain: IChain
  destinationChain: IChain
  tokenSymbol: string
  tokenDecimals: number
  amount: bigint
  progress: bigint
  status: ETransactionStatus
  statusText: string
  errorMessage?: string
  buttonText?: string
  handleClick?: () => void
}
