import { eventChannel, EventChannel } from 'redux-saga'
import { apply, call, cancelled, put, take } from 'typed-redux-saga'

import { FetchResult, Observable } from '@apollo/client'
import { mapPoolSharesQueryResult } from '@dataSource/graph/user/userPoolsShares/mapper'
import { POOL_SHARES_SUBSCRIPTION } from '@dataSource/graph/user/userPoolsShares/subscription'
import { IPoolSharesQueryResult } from '@dataSource/graph/user/userPoolsShares/types'
import { Address } from '@interfaces/data'
import { IToken } from '@interfaces/token'
import { userSharesActions } from '@store/userShares/userShares.slice'
import { subgraphClient } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

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

export function* createUserPoolSharesObservable(userAddress: Address) {
  const observable = ((yield* apply(subgraphClient, subgraphClient.subscribe, [
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
  ])) as unknown) as Observable<FetchResult<IPoolSharesQueryResult>>

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

      const userShares = yield* call(mapPoolSharesQueryResult, tokens, data)

      yield* put(userSharesActions.updateUserSharesSuccess(userShares))
    }
  } finally {
    if (yield* cancelled()) {
      userPoolSharesChannel.close()
    }
  }
}
