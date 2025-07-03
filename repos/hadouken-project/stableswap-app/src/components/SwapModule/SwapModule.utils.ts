import { TokenModelBalance } from '@hadouken-project/ui'
import { IPrice } from '@store/prices/prices.types'
import { BigDecimal } from '@utils/math'

export const sortByTokenBalance = (
  tokA: TokenModelBalance,
  tokB: TokenModelBalance,
  prices: IPrice[],
): number => {
  const priceA = prices.find((price) => price.id === tokA.id)
  const priceB = prices.find((price) => price.id === tokB.id)

  const balanceA = priceA?.price.mul(
    BigDecimal.from(tokA.balance, tokA.decimals),
  )

  const balanceB = priceB?.price.mul(
    BigDecimal.from(tokB.balance, tokB.decimals),
  )

  const tokenBalanceA = balanceA ? balanceA.toNumber() : 0
  const tokenBalanceB = balanceB ? balanceB.toNumber() : 0

  return tokenBalanceB - tokenBalanceA
}
