import {
  FillStructure,
  Outcome,
  OutcomeAssetStructure,
} from '@interfaces/outcome'
import { BuildOutcomeParams } from './types'

export function buildOutcome(
  params: BuildOutcomeParams,
  mTokens: string[],
): Outcome {
  const { srcAmount, slippage, feePercentage } = params

  let fillStructure: FillStructure
  let mAmounts: bigint[]

  if (feePercentage !== undefined) {
    fillStructure = FillStructure.PercentageFilled
    mAmounts = mTokens.map((_) => {
      const feeInBasisPoints = Math.floor(Number(feePercentage) * 1000)
      return BigInt(feeInBasisPoints) * BigInt(10) ** BigInt(18)
    })
  } else if (slippage !== undefined) {
    fillStructure = FillStructure.Minimum
    const minAmount =
      srcAmount - BigInt(Math.floor(Number(srcAmount) * slippage))
    mAmounts = [minAmount]
  } else {
    fillStructure = FillStructure.Exact
    mAmounts = [srcAmount]
  }

  let outcomeAssetStructure: OutcomeAssetStructure
  outcomeAssetStructure = OutcomeAssetStructure.AnySingle

  const outcome: Outcome = {
    mTokens,
    mAmounts,
    outcomeAssetStructure,
    fillStructure,
  }

  return outcome
}
