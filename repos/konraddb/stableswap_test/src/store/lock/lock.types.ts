import { Network } from '@constants/Networks'
import { Address } from '@tvl-labs/swap-v2-sdk'
import { BigDecimal } from '@utils/math'

export interface ILockRequest {
  user: Address
  token: Address
  amount: BigDecimal | undefined
  destinationChain: Network | undefined
}

export interface ILockSliceState extends ILockRequest {
  loading: boolean
  error?: string
}
