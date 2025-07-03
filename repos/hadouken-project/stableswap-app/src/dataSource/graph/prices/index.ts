import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'

import { subgraphClients } from '../../../utils/network/subgraph'
import { Subgraph } from '../../../utils/network/subgraph.types'
import { TOKENS_PRICES_QUERY } from './queries'
import { IApolloTokenPricesQueryResult, QueryTokenPrice } from './types'

export function* queryTokenPrices(): Generator<
  StrictEffect,
  QueryTokenPrice[]
> {
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)
  const queryResult = yield* call<IApolloTokenPricesQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: TOKENS_PRICES_QUERY,
    },
  )

  return queryResult.data.tokens
}
