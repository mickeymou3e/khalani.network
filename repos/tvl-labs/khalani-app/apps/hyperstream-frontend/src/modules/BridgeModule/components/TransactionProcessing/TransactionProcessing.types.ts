import { IChain } from '@tvl-labs/sdk'

export interface ITransactionProcessingProps {
  sourceChain: IChain
  destinationChain: IChain
  tokenSymbol: string
  tokenDecimals: number
  amount: bigint
  depositId: string | null
  destinationTokenId: string
  destinationTokenValue: bigint
  onSuccess: () => void
}
