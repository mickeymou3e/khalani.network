import { groupBy, map } from 'lodash'

import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'
import { BigDecimal } from '@utils/math'

import { IPoolTokensQueryResult, ITokenBalance } from './types'

// TODO: Refactor mappers

export function mapPoolTokensBalancesQueryResultData(
  queryResult: IPoolTokensQueryResult,
  pools: Pick<IPool, 'id' | 'address'>[],
): ITokenBalance[] {
  return queryResult.poolTokens
    .map(({ address, decimals, balance, poolId }) => {
      if (!poolId?.id) return null

      const pool = pools.find(({ id }) => id === poolId?.id)
      if (!pool) return null
      return {
        id: `${pool.address}${address}`,
        walletAddress: pool.address,
        tokenAddress: address,
        balance: balance
          ? BigDecimal.fromString(balance, decimals)
          : BigDecimal.from(0, decimals),
        updatedAt: Date.now(),
      }
    })
    .filter((token) => token !== null) as ITokenBalance[]
}

export function mapTokensBalancesQueryResult(
  tokens: IToken[],
  tokensBalances: ITokenBalance[],
): IBalance[] {
  const balances = map(
    groupBy(tokensBalances, ({ walletAddress }) => walletAddress),
    (tokenBalances) =>
      tokenBalances.reduce(
        (balances, tokenBalance) => {
          const { tokenAddress, walletAddress, balance } = tokenBalance

          return {
            id: walletAddress,
            balances: {
              ...balances.balances,
              [tokenAddress]: balance,
            },
          }
        },
        { id: '', balances: {} } as IBalance,
      ),
  )

  return balances
}
