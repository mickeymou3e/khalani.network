import { BigNumber } from 'ethers'

import { TokenModel } from '@hadouken-project/ui'

import { IApprovalToken } from './ApproveButton.types'

export const mapToApprovalToken = (
  token: TokenModel,
  amount: BigNumber,
): IApprovalToken => ({
  symbol: token.symbol,
  address: token.address,
  amount,
})
