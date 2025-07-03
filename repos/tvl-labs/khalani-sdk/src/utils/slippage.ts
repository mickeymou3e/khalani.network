export const ONE_PERCENT = BigInt(10000)
export const SLIPPAGE_DECIMALS = 4
export const HUNDRED_PERCENTAGE = BigInt(1000000)

export const removeSlippageFromValue = (
  value: bigint,
  slippage: bigint,
): bigint => {
  return value - (value * slippage) / HUNDRED_PERCENTAGE
}
