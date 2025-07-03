import { BigNumber } from 'ethers'

export const compareBigNumbers = (
  val1: BigNumber | null | undefined,
  val2: BigNumber | null | undefined,
): boolean => {
  let value1 = BigNumber.from(0)
  let value2 = BigNumber.from(0)

  if (val1) {
    value1 = val1
  }

  if (val2) {
    value2 = val2
  }

  return value1?.eq(value2)
}
