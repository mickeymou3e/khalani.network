export const compareBigNumbers = (
  val1: bigint | null | undefined,
  val2: bigint | null | undefined,
): boolean => {
  let value1 = BigInt(0)
  let value2 = BigInt(0)

  if (val1) {
    value1 = val1
  }

  if (val2) {
    value2 = val2
  }

  return value1 === value2
}
