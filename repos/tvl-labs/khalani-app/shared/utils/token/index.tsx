import { TokenModel } from '@tvl-labs/sdk'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

export const mapToApprovalToken = (
  token: TokenModel,
  owner: string,
  spender: string,
  amount: bigint,
): IApprovalToken => ({
  symbol: token.symbol,
  address: token.address,
  amount,
  decimals: token.decimals,
  spender,
  owner,
})
