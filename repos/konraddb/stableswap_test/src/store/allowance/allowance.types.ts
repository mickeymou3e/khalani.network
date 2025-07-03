import { BigNumber } from 'ethers'

import { IInitializeSaga } from '@interfaces/data'
import { Address } from '@tvl-labs/swap-v2-sdk'

export interface IAllowanceSliceState extends IInitializeSaga {
  allowances: IAllowance[]
}

export interface IAllowance {
  tokenAddress: Address
  balance: BigNumber
}
