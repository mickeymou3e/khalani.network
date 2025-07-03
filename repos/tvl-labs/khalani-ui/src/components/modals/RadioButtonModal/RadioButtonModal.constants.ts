export const getDefaultValue = (decimals: number): bigint => {
  return BigInt(15) * BigInt(10) ** BigInt(decimals)
}
