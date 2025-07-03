import { Address } from '@store/tokens/tokens.types'
import { RequestStatus } from '@constants/Request'

export interface IAllowanceSliceState {
  allowances: IAllowance[]
  status: RequestStatus
}

export interface IAllowance {
  tokenAddress: Address
  balance: bigint
  spender: string
  owner: string
}
