import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { gql } from '@apollo/client'
import { subgraphClients } from '@graph/subgraph'
import { Liquidation } from '@store/liquidation/liquidation.types'
import { APP_ENVIRONMENT } from '@utils/stringOperations'

import { IApolloLiquidationsQueryResult } from './types'

const LIQUIDATIONS_QUERY = gql`
  {
    liquidations {
      user {
        id
      }
      id
      liquidator
      debtAsset
      debtToCover
      collateralAsset
      liquidatedCollateralAmount
    }
  }
`

export function* fetchLiquidations(): Generator<StrictEffect, Liquidation[]> {
  const subgraphClient = subgraphClients[APP_ENVIRONMENT]

  const response = yield* call<IApolloLiquidationsQueryResult>(
    subgraphClient.query,
    {
      query: LIQUIDATIONS_QUERY,
      variables: {
        where: {
          isActive: true,
        },
      },
      fetchPolicy: 'network-only',
    },
  )

  return response.data.liquidations.map((liquidation) => {
    return {
      ...liquidation,
      user: liquidation.user.id,
      debtToCover: BigNumber.from(liquidation.debtToCover),
      liquidatedCollateralAmount: BigNumber.from(
        liquidation.liquidatedCollateralAmount,
      ),
    }
  })
}
