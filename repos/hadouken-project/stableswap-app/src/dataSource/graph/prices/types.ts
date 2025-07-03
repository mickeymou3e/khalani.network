import { ApolloQueryResult } from '@apollo/client'

import { ApolloRequest } from '../types'

export type QueryTokenPrice = {
  address: string
  latestUSDPrice: string | null
}

export type IApolloTokenPricesQueryResult = ApolloRequest<
  ApolloQueryResult<{ tokens: QueryTokenPrice[] }>
>
