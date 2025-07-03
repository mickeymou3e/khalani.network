import { Address } from '../../store/tokens/tokens.types'
import { BigNumber } from 'ethers'

export interface IApprovalToken {
  address: Address
  symbol: string
  amount: BigNumber
  decimals: number
  spender: Address
}
