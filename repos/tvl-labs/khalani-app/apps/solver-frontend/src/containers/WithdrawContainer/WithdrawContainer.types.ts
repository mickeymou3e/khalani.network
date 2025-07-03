import { IChain } from '@tvl-labs/khalani-ui'

export interface WithdrawContainerProps {
  id: string
  open: boolean
  onClose: () => void
  onSubmit: () => void
  tokenSymbol: string
  tokenDecimals: number
  mToken: string
  sourceChain: IChain | undefined
  destinationChain: IChain | undefined
  amount: bigint
  fee: number
  feeUsd: number
  feeSymbol: string
  isIntentBalance: boolean
  outputAmount: bigint
  successMessage: string
  pendingMessage: string
}
