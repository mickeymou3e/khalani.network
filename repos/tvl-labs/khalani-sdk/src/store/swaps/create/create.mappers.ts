import {
  reverseMapFillStructure,
  reverseMapOutcomeAssetStructure,
} from '@interfaces/outcome'
import { MedusaIntent } from '@services/medusa/history.service'
import { hexToBigInt } from '@utils/text'

export function mapMedusaIntent(refinement: any) {
  return {
    author: refinement.author,
    ttl: hexToBigInt(refinement.ttl),
    nonce: hexToBigInt(refinement.nonce),
    srcMToken: refinement.srcMToken,
    srcAmount: hexToBigInt(refinement.srcAmount),
    outcome: {
      mTokens: refinement.outcome.mTokens,
      mAmounts: refinement.outcome.mAmounts.map(hexToBigInt),
      outcomeAssetStructure: reverseMapOutcomeAssetStructure(
        refinement.outcome.outcomeAssetStructure,
      ),
      fillStructure: reverseMapFillStructure(refinement.outcome.fillStructure),
    },
  }
}

export function mapToRefinementObj(medusaIntent: MedusaIntent) {
  return {
    Refinement: {
      author: medusaIntent.author,
      ttl: medusaIntent.ttl,
      nonce: medusaIntent.nonce,
      srcMToken: medusaIntent.srcMToken,
      srcAmount: medusaIntent.srcAmount,
      outcome: {
        mAmounts: medusaIntent.outcome.mAmounts,
        mTokens: medusaIntent.outcome.mTokens,
        outcomeAssetStructure: medusaIntent.outcome.outcomeAssetStructure,
        fillStructure: medusaIntent.outcome.fillStructure,
      },
    },
  }
}
