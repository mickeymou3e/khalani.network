import { BigNumber } from 'ethers'

import { Address } from '@tvl-labs/swap-v2-sdk'

export interface IApproveButtonProps {
  tokensToApprove: IApprovalToken[]
}

export interface IApprovalToken {
  address: Address
  symbol: string
  amount: BigNumber
}
