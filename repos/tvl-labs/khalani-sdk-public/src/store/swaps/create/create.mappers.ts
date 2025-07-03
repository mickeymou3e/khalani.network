import {
  reverseMapFillStructure,
  reverseMapOutcomeAssetStructure,
} from '@interfaces/outcome'
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
