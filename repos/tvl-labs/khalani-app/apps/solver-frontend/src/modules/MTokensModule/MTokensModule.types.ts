import { ENetwork } from '@tvl-labs/khalani-ui'

export interface LiquidityListItem {
  id: string
  sourceChain: ENetwork
  tokenSymbol: string
  tokenDecimals: number
  destinationChains: ENetwork[]
  balance: bigint
  fee: number
}
