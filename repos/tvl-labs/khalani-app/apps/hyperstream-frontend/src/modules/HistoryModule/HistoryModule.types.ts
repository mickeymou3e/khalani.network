import { ETransactionStatus, IChain } from '@tvl-labs/khalani-ui'

export interface HistoryListItem {
  id: string
  timestamp: number
  sourceChain: IChain
  destinationChain: IChain
  tokenSymbol: string
  tokenDecimals: number
  balance: bigint
  outcomeAmount: bigint
  status: ETransactionStatus
  progress?: bigint
  sourceAddress: string
  destinationAddress: string
  statusText: string
  destChains?: IChain[]
  transactionHash?: string
  depositTx?: string
  destinationTxHash?: string
  withdrawTxHash?: string
  fee?: number
  feeSymbol?: string
  feeUsd?: number
  errorMessage?: string
  errorCode?: string
  buttonText?: string
  handleClick?: () => void
  intentType?: string
}
