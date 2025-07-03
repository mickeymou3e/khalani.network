interface IntentDomain {
  name: string
  version: string
  verifyingContract: `0x${string}`
}

interface IntentType {
  name: string
  type: string
}

export enum OutcomeAssetStructure {
  AnySingle = 0,
  Any = 1,
  All = 2,
}

export enum FillStructure {
  Exact = 0,
  Minimum = 1,
  PercentageFilled = 2,
  ConcreteRange = 3,
}

export const FillStructureMap: Record<FillStructure, string> = {
  [FillStructure.Exact]: 'Exact',
  [FillStructure.Minimum]: 'Minimum',
  [FillStructure.PercentageFilled]: 'PercentageFilled',
  [FillStructure.ConcreteRange]: 'ConcreteRange',
}

export const FillStructureStringToEnum: Record<string, FillStructure> = {
  Exact: FillStructure.Exact,
  Minimum: FillStructure.Minimum,
  PercentageFilled: FillStructure.PercentageFilled,
  ConcreteRange: FillStructure.ConcreteRange,
}

export enum RpcIntentState {
  NonExistent = 'NonExistent',
  Open = 'Open',
  Locked = 'Locked',
  Solved = 'Solved',
  Settled = 'Settled',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
}

export interface CreateIntentParams {
  srcToken: string
  srcAmount: string
  destTokens: string[]
  destChains: number[]
  selectedChain: number
  srcChainId: string
  srcSymbol: string
  destChainId: string
  destSymbol: string
}

export interface Intent {
  author: string
  ttl: bigint
  nonce: bigint
  srcMToken: string
  srcAmount: bigint
  outcome: Outcome
}

export interface Outcome {
  mTokens: string[]
  mAmounts: bigint[]
  outcomeAssetStructure: OutcomeAssetStructure
  fillStructure: FillStructure
}

export interface MedusaIntent {
  author: string
  ttl: string
  nonce: string
  srcMToken: string
  srcAmount: string
  outcome: {
    mTokens: string[]
    mAmounts: string[]
    outcomeAssetStructure: string
    fillStructure: string
  }
}

export interface SignIntentPayload {
  domain: IntentDomain
  types: Record<string, IntentType[]>
  message: {
    author: `0x${string}`
    ttl: bigint
    nonce: bigint
    srcMToken: `0x${string}`
    srcAmount: bigint
    outcome: {
      mTokens: `0x${string}`[]
      mAmounts: bigint[]
      outcomeAssetStructure: OutcomeAssetStructure
      fillStructure: FillStructure
    }
  }
  primaryType: string
  account: string
}

export { IntentDomain, IntentType }
