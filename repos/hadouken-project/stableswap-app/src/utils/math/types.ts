import { TokenBalance } from '../../interfaces/token'

export type PriceImpactDepositInput = {
  depositAmounts: TokenBalance[]
  poolId: string
  chainId: string
  userAddress?: string
}
