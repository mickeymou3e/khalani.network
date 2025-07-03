import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { getTokens } from '@dataSource/graph/pools/poolsTokens/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { AaveAPYToken } from '@interfaces/token'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'

export function* fetchAaveTokensApy(): Generator<StrictEffect, AaveAPYToken[]> {
  const lendingContracts = yield* select(contractsSelectors.lendingContracts)
  const addressProvider = lendingContracts?.addressProvider
  const addressProviderAddress = addressProvider?.address
  const uiHelper = lendingContracts?.uiHelper

  if (uiHelper && addressProviderAddress) {
    const reserves = yield* call(
      uiHelper.getReservesData,
      addressProviderAddress,
    )
    const chainId = yield* select(networkSelectors.applicationChainId)

    return reserves.map((reserve) => {
      const tokenConfig = getTokens(chainId).find(
        (config) =>
          address(config.unwrappedAddress ?? '') ===
          address(reserve.aTokenAddress),
      )

      return {
        id: address(reserve.underlyingAsset),
        underlyingAddress: address(reserve.underlyingAsset),
        address: address(reserve.aTokenAddress),
        wrappedAddress: address(tokenConfig?.address ?? ''),

        // 27 - 2 as percentage
        APY: BigDecimal.from(reserve.liquidityRate, 25),
      }
    })
  }

  return []
}
