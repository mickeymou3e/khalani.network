export interface ILPBalanceProps {
  label?: string
  slippage?: bigint
  balance?: string
  tokenSymbols?: string[]
  poolShare?: string
  gasPayment?: bigint
  nativeTokenSymbol?: string
  isPoolShare?: boolean
  isLoading?: boolean
  fromModal?: boolean
  isGasPayment?: boolean
}
