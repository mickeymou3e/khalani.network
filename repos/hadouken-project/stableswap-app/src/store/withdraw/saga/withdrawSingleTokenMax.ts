import { StrictEffect } from 'redux-saga/effects'
import { apply, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import {
  IWithdrawSingleTokenMax,
  IWithdrawTokensMaxBalance,
} from '../withdraw.types'

export function* withdrawSingleTokenMax({
  payload: { outTokens, poolId, tokenInAddress, tokenInAmount },
}: PayloadAction<IWithdrawSingleTokenMax>): Generator<
  StrictEffect,
  IWithdrawTokensMaxBalance
> {
  try {
    const userAddress = yield* select(walletSelectors.userAddress)
    const allPools = yield* select(poolSelectors.selectAll)
    const selectPoolById = yield* select(poolSelectors.selectById)

    const poolServiceProvider = yield* select(
      servicesSelectors.poolServiceProvider,
    )

    const pool = selectPoolById(poolId)

    if (!pool || !poolServiceProvider || !userAddress)
      throw new Error('Pool or user not found')

    const poolService = yield* apply(
      poolServiceProvider,
      poolServiceProvider.provide,
      [pool],
    )

    if (!poolService) throw new Error('Pool service not found')

    const tokensAmountMax: IWithdrawTokensMaxBalance = {}
    const chainId = yield* select(networkSelectors.applicationChainId)

    for (const tokenAddress of outTokens) {
      const { amountsOut, assets } = yield* apply(
        poolService,
        poolService.queryExitTokenIn,
        [
          {
            pool,
            allPools,
            account: userAddress,
            amountsIn: [tokenInAmount.toBigNumber()],
            tokenInAddress,
            tokensOutAddresses: [tokenAddress],
            chainId,
          },
        ],
      )

      const tokenIndex = assets.indexOf(tokenAddress)

      tokensAmountMax[tokenAddress] = amountsOut[tokenIndex]
    }

    return tokensAmountMax
  } catch (e) {
    return {}
  }
}
