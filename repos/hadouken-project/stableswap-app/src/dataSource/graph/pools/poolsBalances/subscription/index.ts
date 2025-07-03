import { eventChannel, EventChannel } from 'redux-saga'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, select } from 'typed-redux-saga'

import { FetchResult, Observable } from '@apollo/client'
import { POOL_TOKENS_BALANCES_SUBSCRIPTION } from '@dataSource/graph/pools/poolsBalances/subscription/subscription'
import { IPoolTokensQueryResult } from '@dataSource/graph/pools/poolsBalances/types'
import { IPool } from '@interfaces/pool'
import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

export function createPoolTokensBalancesChannel(
  observable: Observable<FetchResult<IPoolTokensQueryResult>>,
): EventChannel<IPoolTokensQueryResult> {
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

export function* createPoolTokensBalancesObservable(
  poolsIds: IPool['id'][],
): Generator<StrictEffect> {
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)
  const observable = ((yield* apply(
    subgraphClients[chainId],
    subgraphClients[chainId].subscribe,
    [
      {
        fetchPolicy: 'no-cache',
        context: {
          type: Subgraph.Balancer,
        },
        query: POOL_TOKENS_BALANCES_SUBSCRIPTION,
        variables: {
          poolsIds: poolsIds,
        },
      },
    ],
  )) as unknown) as Observable<FetchResult<IPoolTokensQueryResult>>

  return observable
}
