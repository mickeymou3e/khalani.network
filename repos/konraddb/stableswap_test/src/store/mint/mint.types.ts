import { BigNumber } from 'ethers'

import { Address } from '@tvl-labs/swap-v2-sdk'

export interface IMintRequest {
  token: Address
  user: Address
  amount: BigNumber
}
