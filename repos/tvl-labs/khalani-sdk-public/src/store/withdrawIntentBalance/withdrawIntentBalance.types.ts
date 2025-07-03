import { RequestStatus } from '@constants/Request'

export interface IWithdrawIntentBalanceSagaState {
  loading: boolean
  status: RequestStatus
  params: WithdrawIntentBalanceParams | null
  initialized: boolean
  signed: boolean
  error: string | null
}

export interface WithdrawIntentBalanceParams {
  intentId: string
}
