export interface IMarketInfoBoxProps {
  tokenSymbol: string
  collateral: bigint | undefined
  currentDebt: bigint | undefined
  ltv: bigint
  tokenPrice: bigint
  availableToBorrow: bigint
  decimals: number
}
