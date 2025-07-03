import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { gql } from '@apollo/client'
import { subgraphClients } from '@graph/subgraph'
import { APP_ENVIRONMENT } from '@utils/stringOperations'

import { IApolloUsersQueryResult, IUser } from './types'

const USERS_QUERY = gql`
  {
    users {
      id
      aTokenAssets {
        id
        address
        underlyingAsset
        scaledBalance
        isCollateral
      }
      variableBorrowAssets {
        id
        address
        underlyingAsset
        scaledVariableDebt
      }
      stableBorrowAssets {
        id
        address
        underlyingAsset
        principalStableDebt
      }
    }
  }
`

export function* fetchUsers(): Generator<StrictEffect, IUser[]> {
  const subgraphClient = subgraphClients[APP_ENVIRONMENT]
  const response = yield* call<IApolloUsersQueryResult>(subgraphClient.query, {
    query: USERS_QUERY,
    variables: {
      where: {
        isActive: true,
      },
    },
    fetchPolicy: 'network-only',
  })

  return response.data.users
}
