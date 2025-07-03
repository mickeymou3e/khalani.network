import { IChain } from '@store/chains/chains.types'
import { BigDecimal } from '@utils/math'

export declare type Address = string
export interface IDepositPayload {
  user: Address
  token: Address
  amount: BigDecimal
  destinationChain: IChain
}
