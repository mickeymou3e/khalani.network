export interface IToken {
  id: string
  address: string
  decimals: number
  name: string
  symbol: string
  chainId: string
  sourceChainId?: string
}
