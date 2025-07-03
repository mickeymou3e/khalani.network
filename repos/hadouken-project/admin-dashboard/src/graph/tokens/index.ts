import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { gql } from '@apollo/client'
import { subgraphClients } from '@graph/subgraph'
import { getAppConfig } from '@utils/config'
import { APP_ENVIRONMENT } from '@utils/stringOperations'

import { IApolloApplicationTokenQueryResult, IApplicationToken } from './types'

const TOKENS_QUERY = gql`
  query tokens {
    poolTokens {
      address
      decimals
      symbol
      isAToken
      isStableDebt
      isVariableDebt
    }
  }
`

export function* fetchApplicationTokens(): Generator<
  StrictEffect,
  IApplicationToken[]
> {
  const subgraphClient = subgraphClients[APP_ENVIRONMENT]

  const tokens = yield* call<IApolloApplicationTokenQueryResult>(
    subgraphClient.query,
    {
      query: TOKENS_QUERY,
      fetchPolicy: 'network-only',
    },
  )

  const mappedSymbolTokens = tokens.data.poolTokens.map((token) => ({
    ...token,
    symbol: token.symbol.split('.')[0],
  }))

  const nativeToken = getAppConfig().nativeToken

  mappedSymbolTokens.push({
    address: nativeToken.address.toLowerCase(),
    decimals: 18,
    isAToken: false,
    isStableDebt: false,
    isVariableDebt: false,
    symbol: nativeToken.symbol,
  })

  return mappedSymbolTokens
}
