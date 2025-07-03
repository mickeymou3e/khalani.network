import { RequestStatus } from '@constants/Request'

export interface IWithdrawMTokenSagaState {
  loading: boolean
  status: RequestStatus
  params: WithdrawMTokenParams | null
  initialized: boolean
  signed: boolean
  error: string | null
}

export interface WithdrawMTokenParams {
  from: string
  mToken: string
  amount: bigint
}

export interface PayloadAddress {
  address: string
  nonce: string
  chain_id: number
}

export interface SignedPayloadAddress {
  payload: PayloadAddress
  signature: { r: string; s: string; v: number }
}
