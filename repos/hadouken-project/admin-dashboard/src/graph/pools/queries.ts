import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { gql } from '@apollo/client'
import { subgraphClients } from '@graph/subgraph'
import { APP_ENVIRONMENT } from '@utils/stringOperations'

import { IApolloReservesQueryResult, IReserve } from './types'

export const RESERVE_FIELDS = gql`
  fragment ReserveFields on Reserve {
    id
    address
    symbol
    aTokenAddress
    stableDebtTokenAddress
    variableDebtTokenAddress
    variableBorrowRate
    stableBorrowRate
    variableBorrowIndex
    availableLiquidity
    totalStableDebt
    totalVariableDebt
    totalStableDebt
    ltv
    liquidityThreshold
    liquidityBonus
    decimals
    isActive
    isFrozen
    isBorrowingEnable
    isStableBorrowingEnable
    liquidityRate
    lastUpdateTimestamp
    liquidityIndex
    borrowCap
    depositCap
  }
`

const RESERVES_QUERY = gql`
  ${RESERVE_FIELDS}
  query reservesQuery($where: Reserve_filter) {
    reserves(where: $where) {
      ...ReserveFields
    }
  }
`

export function* fetchReserves(): Generator<StrictEffect, IReserve[]> {
  const subgraphClient = subgraphClients[APP_ENVIRONMENT]

  const response = yield* call<IApolloReservesQueryResult>(
    subgraphClient.query,
    {
      query: RESERVES_QUERY,
      variables: {
        where: {
          isActive: true,
        },
      },
      fetchPolicy: 'network-only',
    },
  )

  return response.data.reserves.map((reserve) => {
    const {
      symbol,
      decimals,
      availableLiquidity,
      stableBorrowRate,
      variableBorrowRate,
      totalStableDebt,
      totalVariableDebt,
      liquidityRate,
      liquidityIndex,
      lastUpdateTimestamp,
      variableBorrowIndex,
      liquidityThreshold,
      depositCap,
      borrowCap,
    } = reserve

    return {
      ...reserve,
      symbol: symbol.split('.')[0],
      liquidityThreshold: BigNumber.from(liquidityThreshold ?? 0),
      decimals: Number(decimals),
      availableLiquidity: BigNumber.from(availableLiquidity ?? 0),
      stableBorrowRate: BigNumber.from(stableBorrowRate ?? 0),
      variableBorrowRate: BigNumber.from(variableBorrowRate ?? 0),
      totalStableDebt: BigNumber.from(totalStableDebt ?? 0),
      totalVariableDebt: BigNumber.from(totalVariableDebt ?? 0),
      liquidityRate: BigNumber.from(liquidityRate ?? 0),
      liquidityIndex: BigNumber.from(liquidityIndex ?? 0),
      variableBorrowIndex: BigNumber.from(variableBorrowIndex ?? 0),
      depositCap: BigNumber.from(depositCap ?? 0),
      borrowCap: BigNumber.from(borrowCap ?? 0),
      lastUpdateTimestamp: BigNumber.from(
        lastUpdateTimestamp ?? BigNumber.from(Date.now()).div(1000),
      ),
    }
  })
}
