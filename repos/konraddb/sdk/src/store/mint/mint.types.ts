import { Address } from '../../store/tokens/tokens.types'
import { BigNumber } from 'ethers'

export interface IMintRequest {
  tokenIn: Address
  amount: BigNumber
}
