import { Network } from '@constants/Networks'
import { APIError } from '@interfaces/api'
import { Outcome } from '@interfaces/outcome'

export interface ICreateIntentSliceState {
  loading: boolean
  initialized: boolean
  signed: boolean
  error: APIError | null
  depositId: string | null
  intent: Intent | null
  params: UIIntentParams | Intent | null
}

export type CreateIntentResult = {
  intent: Intent
  signature: string
  depositId: string
}

type Hash = string
type Signature = string

export interface SwapIntent {
  inquiryHash: Hash
  offerHash: Hash
  permit2Signature: Signature
  intentSignature: Signature
}

export interface Intent {
  author: string
  ttl: bigint
  nonce: bigint
  srcMToken: string
  srcAmount: bigint
  outcome: Outcome
}

export interface SignedIntent {
  intent: Intent
  signature: string
}

export interface UIIntentParams {
  srcToken: string
  srcAmount: bigint
  selectedChain?: Network
  destTokens?: string[]
  destChains?: number[]
  slippage?: number
  feePercentage?: number
}

export type PlaceIntentParams = SignedIntent
export type PlaceIntentResult = string
