export interface ITokenPreview {
  symbol: string
  displayName: string
  balance: string
  valueUSD: string
  percentage?: string
  isFetchingBalances?: boolean
  source?: string
}
