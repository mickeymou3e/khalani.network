import { BigDecimal, ONE_PERCENT, SLIPPAGE_DECIMALS } from '@utils/math'

export const SLIPPAGE_DEFAULT_VALUE = BigDecimal.from(
  ONE_PERCENT,
  SLIPPAGE_DECIMALS,
)
