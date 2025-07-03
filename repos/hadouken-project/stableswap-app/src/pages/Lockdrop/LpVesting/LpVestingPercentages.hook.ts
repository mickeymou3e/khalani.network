import { BigDecimal } from '@utils/math'

export const useLpTokensPercentage = (
  amount: BigDecimal,
  total: BigDecimal,
): string => {
  const percentageCalculation = amount
    .mul(BigDecimal.from(100, 0))
    .div(total)
    .toNumber()

  const percentage =
    percentageCalculation < 1 && amount.gt(BigDecimal.from(0))
      ? 1
      : percentageCalculation

  return percentage.toFixed(2)
}
