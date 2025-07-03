export interface ITokenWithChainTileProps {
  chainId: number
  poolTokensSymbols: string[]
  liquidity: bigint
  volume: bigint
  poolId: string
  apr: string
  onClick: (poolId: string) => void
  userPoolTokenBalanceUSD?: string
}
