import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { getTokens } from '@dataSource/graph/pools/poolsTokens/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { ILendingReserve } from '@store/lending/lending.types'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'

export function* fetchLendingReserves(): Generator<
  StrictEffect,
  ILendingReserve[]
> {
  const lendingContracts = yield* select(contractsSelectors.lendingContracts)

  const addressProvider = lendingContracts?.addressProvider
  const providerAddress = addressProvider?.address
  const uiHelper = lendingContracts?.uiHelper
  const chainId = yield* select(networkSelectors.applicationChainId)

  if (uiHelper && providerAddress) {
    const reserves = yield* call(uiHelper.getReservesData, providerAddress)

    return reserves.map((reserve) => {
      const tokenConfig = getTokens(chainId).find(
        (config) =>
          address(config.unwrappedAddress ?? '') ===
          address(reserve.aTokenAddress),
      )

      return {
        id: reserve.underlyingAsset,
        underlyingAsset: reserve.underlyingAsset,
        aTokenAddress: reserve.aTokenAddress,
        wrappedATokenAddress: address(tokenConfig?.address ?? ''),
        APY: BigDecimal.from(reserve.liquidityRate, 25),
      }
    })
  }

  return []
}
