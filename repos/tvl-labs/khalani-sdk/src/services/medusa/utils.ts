import { splitSignature } from 'ethers/lib/utils'
import { Intent } from '../../store/swaps/create/create.types'
import { mapFillStructure, mapOutcomeAssetStructure } from '@interfaces/outcome'

export const mapToTargetFormat = (params: Intent) => {
  const { author, ttl, nonce, srcMToken, srcAmount, outcome } = params

  return {
    author,
    ttl: ttl.toString(),
    nonce: nonce.toString(),
    srcMToken,
    srcAmount: srcAmount.toString(),
    outcome: {
      mTokens: outcome.mTokens,
      mAmounts: outcome.mAmounts.map((amount) => amount.toString()),
      outcomeAssetStructure: mapOutcomeAssetStructure(
        outcome.outcomeAssetStructure,
      ),
      fillStructure: mapFillStructure(outcome.fillStructure),
    },
  }
}

export const parseSignatureToRsv = (signature: string) => {
  const parsedSignature = splitSignature(signature)

  const { r, s, v } = parsedSignature
  return {
    r,
    s,
    v,
  }
}
