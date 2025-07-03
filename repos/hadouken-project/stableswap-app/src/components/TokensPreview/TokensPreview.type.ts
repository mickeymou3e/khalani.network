import { BigDecimal } from '@utils/math'

export interface ITokenPreviewProps {
  tokens: {
    id: string
    symbol: string
    amount: BigDecimal
    amountUSD: BigDecimal
    percentage: BigDecimal
    displayName: string
    source?: string
  }[]
}
