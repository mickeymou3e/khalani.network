import { eventChannel, EventChannel } from 'redux-saga'
import { Effect, StrictEffect } from 'redux-saga/effects'
import { apply, call, cancelled, put, select, take } from 'typed-redux-saga'

import { FetchResult, Observable } from '@apollo/client'
import { fetchPools } from '@dataSource/graph/pools'
import { mapPoolSharesQueryResult } from '@dataSource/graph/user/userPoolsShares/mapper'
import { POOL_SHARES_SUBSCRIPTION } from '@dataSource/graph/user/userPoolsShares/subscription'
import { IPoolSharesQueryResult } from '@dataSource/graph/user/userPoolsShares/types'
import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { poolBalancesSelectors } from '@store/balances/selectors/pool/balances.selector'
import { waitForUserBalanceBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { userSharesActions } from '@store/userShares/userShares.slice'
import {
  DepositTokenBalances,
  IUserShares,
  TokenBalances,
} from '@store/userShares/userShares.types'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { calculateWithdrawPreviewSaga } from '@store/withdraw/saga/calculateWithdrawPreview.saga'
import { IWithdrawRequest, IWithdrawType } from '@store/withdraw/withdraw.types'
import { BigDecimal, SLIPPAGE_DECIMALS } from '@utils/math'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

function* computeUserDepositPoolShares(
  userAddress: string,
  pools: IPool[],
  userShares: IUserShares[],
): Generator<StrictEffect, DepositTokenBalances['depositTokenBalances']> {
  const selectPoolUnderlyingBalances = yield* select(
    poolBalancesSelectors.selectPoolUnderlyingBalances,
  )
  const poolModelSelector = yield* select(poolsModelsSelector.selectById)

  const poolsWithValues = pools.map((pool) => {
    return {
      ...pool,
      poolLpToken:
        userShares && userShares.length > 0
          ? userShares[0].sharesOwned[pool.address] ?? BigDecimal.from(0)
          : BigDecimal.from(0),
    }
  })

  let poolDepositTokenBalances: DepositTokenBalances['depositTokenBalances'] = {}

  for (const pool of poolsWithValues) {
    const poolModel = poolModelSelector(pool.id)

    if (poolModel) {
      if (
        poolModel.pool.poolType === PoolType.ComposableStable ||
        poolModel.pool.poolType === PoolType.WeightedBoosted
      ) {
        const data: IWithdrawRequest = {
          inToken: poolModel.address,
          inTokenAmount: pool.poolLpToken,
          outTokens: poolModel.depositTokens.map((token) => token.address),
          outTokensAmounts: [],
          type: IWithdrawType.ExactIn,
          poolId: pool.id,
          slippage: BigDecimal.from(0, SLIPPAGE_DECIMALS),
          isMaxAmount: true,
          tokenIndex: null,
        }

        try {
          const withdrawPreview = yield* call(
            calculateWithdrawPreviewSaga,
            data,
          )
          const outTokens = withdrawPreview.outTokens
          const amounts = withdrawPreview.outTokensAmounts

          const balances = outTokens.reduce<TokenBalances>(
            (prev, current, index) => {
              const newData = {
                ...prev,
                [current]: amounts[index],
              }
              return newData
            },
            {},
          )

          poolDepositTokenBalances = {
            ...poolDepositTokenBalances,
            [pool.address]: balances,
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        if (userAddress) {
          const poolShare =
            userShares && userShares.length > 0
              ? userShares[0].sharesOwned[pool.address]
              : BigDecimal.from(0)

          const totalPoolUnderlyingBalances = selectPoolUnderlyingBalances(
            pool.id,
          )

          const totalPoolShare = pool?.totalShares

          if (poolShare && totalPoolShare) {
            const scaleFactor = poolShare.div(totalPoolShare)

            const poolUnderlyingBalances =
              totalPoolUnderlyingBalances &&
              Object.keys(totalPoolUnderlyingBalances).reduce<TokenBalances>(
                (poolBalances, tokenAddress) => {
                  const value = totalPoolUnderlyingBalances[tokenAddress]
                    ? totalPoolUnderlyingBalances[tokenAddress]?.mul(
                        scaleFactor,
                      )
                    : BigDecimal.from(0)

                  return {
                    ...poolBalances,
                    [tokenAddress]: value,
                  }
                },
                {},
              )

            if (poolDepositTokenBalances) {
              poolDepositTokenBalances = {
                ...poolDepositTokenBalances,
                [pool.address]: poolUnderlyingBalances,
              }
            } else {
              poolDepositTokenBalances = {
                [pool.address]: poolUnderlyingBalances,
              }
            }
          }
        }
      }
    }
  }

  return poolDepositTokenBalances
}

export function createPoolSharesChannel(
  observable: Observable<FetchResult<IPoolSharesQueryResult>>,
): EventChannel<IPoolSharesQueryResult> {
  return eventChannel((emit) => {
    const subscription = observable.subscribe({
      next: ({ data }) => {
        if (data) {
          emit(data)
        }
      },
      error: (e) => console.error(e),
    })

    return () => {
      subscription.unsubscribe()
    }
  })
}

export function* createUserPoolSharesObservable(
  userAddress: string,
): Generator<Effect> {
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)
  const observable = ((yield* apply(
    subgraphClients[chainId],
    subgraphClients[chainId].subscribe,
    [
      {
        context: {
          type: Subgraph.Balancer,
        },
        fetchPolicy: 'network-only',
        query: POOL_SHARES_SUBSCRIPTION,
        variables: {
          userAddress: userAddress,
        },
      },
    ],
  )) as unknown) as Observable<FetchResult<IPoolSharesQueryResult>>

  return observable
}

export function* subscribeUserPoolsShares(
  userAddress: string,
  tokens: IToken[],
): Generator {
  const userPoolSharesObservable = yield* call(
    createUserPoolSharesObservable,
    userAddress,
  )
  const userPoolSharesChannel = yield* call(
    createPoolSharesChannel,
    userPoolSharesObservable,
  )

  try {
    while (true) {
      const data = yield* take(userPoolSharesChannel)

      yield* put(userSharesActions.updateUserSharesRequest(''))

      const userAddress = yield* select(walletSelectors.userAddress)

      if (!userAddress) {
        yield* put(
          userSharesActions.updateUserSharesSuccess({
            lpTokenShares: [],
            depositBalances: {},
          }),
        )
      } else {
        const pools = yield* call(fetchPools)

        const userShares = yield* call(mapPoolSharesQueryResult, tokens, data)

        yield* call(waitForUserBalanceBeFetched)

        const depositBalances = yield* call(
          computeUserDepositPoolShares,
          userAddress,
          pools,
          userShares,
        )

        yield* put(
          userSharesActions.updateUserSharesSuccess({
            lpTokenShares: userShares,
            depositBalances: depositBalances,
          }),
        )
      }
    }
  } finally {
    if (yield* cancelled()) {
      userPoolSharesChannel.close()
    }
  }
}
