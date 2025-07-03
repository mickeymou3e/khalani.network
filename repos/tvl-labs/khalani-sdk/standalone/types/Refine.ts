export interface RefineResult {
  Refinement: {
    author: string
    ttl: string
    nonce: string
    srcMToken: string
    srcAmount: string
    outcome: {
      mAmounts: string[]
      mTokens: string[]
      outcomeAssetStructure: string
      fillStructure: string
    }
  }
}

export enum RefineResultStatus {
  RefinementNotFound = 'RefinementNotFound',
}

export type RefineResultOrNotFound = RefineResult | RefineResultStatus

export interface CreateRefinePayload {
  author: string
  ttl: string
  nonce: string
  srcMToken: string
  srcAmount: string
  outcome: {
    mAmounts: string[]
    mTokens: string[]
    outcomeAssetStructure: string
    fillStructure: string
  }
}
