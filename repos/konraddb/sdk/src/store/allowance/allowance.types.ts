import { BigNumber } from 'ethers'

import { Address } from '../tokens/tokens.types'
import { RequestStatus } from '../../constants/Request'

export interface IAllowanceSliceState {
  allowances: IAllowance[]
  status: RequestStatus
}

export interface IAllowance {
  tokenAddress: Address
  balance: BigNumber
  spender: string
}
