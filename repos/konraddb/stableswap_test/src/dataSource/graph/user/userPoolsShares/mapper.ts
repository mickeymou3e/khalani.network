import { flatten, groupBy, map } from 'lodash'

import { ITokenBalance } from '@dataSource/graph/pools/poolsBalances/types'
import { IPoolSharesQueryResult } from '@dataSource/graph/user/userPoolsShares/types'
import { IToken } from '@interfaces/token'
import { IUserShares } from '@store/userShares/userShares.types'
import { BigDecimal } from '@utils/math'

export function mapPoolSharesQueryResult(
  tokens: IToken[],
  queryResult: IPoolSharesQueryResult,
): IUserShares[] {
  const usersShares = flatten(
    queryResult.users.map(({ id: userAddress, sharesOwned }) =>
      sharesOwned.map(({ balance, poolId: { address: poolAddress } }) => {
        return {
          id: `${userAddress}${poolAddress}`,
          walletAddress: userAddress,
          tokenAddress: poolAddress,
          balance: BigDecimal.fromString(balance),
          updatedAt: Date.now(),
        } as ITokenBalance
      }),
    ),
  )

  return map(
    groupBy(usersShares, ({ walletAddress }) => walletAddress),
    (tokenBalances) =>
      tokenBalances.reduce(
        (balances, tokenBalance) => {
          const { tokenAddress, walletAddress, balance } = tokenBalance

          return {
            id: walletAddress,
            sharesOwned: {
              ...balances.sharesOwned,
              [tokenAddress]: balance,
            },
          }
        },
        { id: '', sharesOwned: {} } as IUserShares,
      ),
  )
}
