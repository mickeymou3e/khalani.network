import { CreateIntentParams } from '../types'

export const buildOutcome = (
  params: CreateIntentParams,
  mTokens: string[],
  fillStructure: string,
  feePercentage?: number,
) => {
  const { srcAmount } = params
  let mAmounts: string[]
  if (feePercentage) {
    mAmounts = mTokens.map((_) => {
      const feeInBasisPoints = Math.floor(Number(feePercentage) * 10000)
      const scaledAmount = BigInt(feeInBasisPoints) * BigInt(10) ** BigInt(18)
      return scaledAmount.toString()
    })
  } else {
    mAmounts = [srcAmount]
  }

  return {
    mAmounts,
    mTokens,
    outcomeAssetStructure: 'AnySingle',
    fillStructure: fillStructure,
  }
}
