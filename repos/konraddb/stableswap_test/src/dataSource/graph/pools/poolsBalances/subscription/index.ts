import { eventChannel, EventChannel } from 'redux-saga'
import { apply } from 'typed-redux-saga'

import { FetchResult, Observable } from '@apollo/client'
import { POOL_TOKENS_BALANCES_SUBSCRIPTION } from '@dataSource/graph/pools/poolsBalances/subscription/subscription'
import { IPoolTokensQueryResult } from '@dataSource/graph/pools/poolsBalances/types'
import { IPool } from '@interfaces/pool'
import { subgraphClient } from '@utils/network/subgraph'
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

export function* createPoolTokensBalancesObservable(poolsIds: IPool['id'][]) {
  const observable = ((yield* apply(subgraphClient, subgraphClient.subscribe, [
    {
      context: {
        type: Subgraph.Balancer,
      },
      fetchPolicy: 'network-only',
      query: POOL_TOKENS_BALANCES_SUBSCRIPTION,
      variables: {
        poolsIds: poolsIds,
      },
    },
  ])) as unknown) as Observable<FetchResult<IPoolTokensQueryResult>>

  return observable
}
