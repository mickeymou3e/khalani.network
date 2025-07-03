import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { PROPORTIONAL_TOKEN } from '@containers/pools/WithdrawContainer/WithdrawContainer.constants'
import {
  calculateMaxAvailableUserLpTokenBalance,
  renderIconForProportional,
} from '@containers/pools/WithdrawContainer/WithdrawContainer.utils'
import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { PoolType } from '@interfaces/pool'
import { PayloadAction } from '@reduxjs/toolkit'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import {
  getPoolDepositTokens,
  waitForPoolsAndTokensBeFetched,
  waitForUserBalanceBeFetched,
  waitForUserShareBeFetched,
} from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { withdrawSelectors } from '../withdraw.selector'
import { withdrawActions } from '../withdraw.slice'
import { calculateComposablePoolProportionalWithdrawSaga } from './composablePool/calculateComposablePoolProportionalWithdraw.saga'
import { withdrawSingleTokenMax } from './withdrawSingleTokenMax'

export function* initializeWithdrawSaga(
  action: PayloadAction<{
    poolId: string
  }>,
): Generator<StrictEffect, void> {
  try {
    yield* call(waitForPoolsAndTokensBeFetched)

    const applicationChainId = yield* select(
      networkSelectors.applicationChainId,
    )
    const poolId = action.payload.poolId

    const selectPoolModel = yield* select(poolsModelsSelector.selectById)

    const poolModel = selectPoolModel(poolId)

    const poolConfig = getPoolConfig(
      poolModel?.address ?? '',
      applicationChainId,
    )

    const showWrappedCheckbox = Boolean(
      poolConfig &&
        poolConfig.wrappedDepositTokens &&
        poolConfig.wrappedDepositTokens.length > 0,
    )

    yield* put(withdrawActions.setShowWrappedCheckbox(showWrappedCheckbox))

    const tokens = poolModel
      ? getPoolDepositTokens(poolModel, applicationChainId, false)
      : []

    const proportionalToken: TokenModelBalanceWithIcon = {
      ...PROPORTIONAL_TOKEN,
      icon: renderIconForProportional(tokens),
    }

    yield* put(
      withdrawActions.setWithdrawTokens({
        withdrawTokens: tokens,
        proportionalToken,
      }),
    )

    yield* put(withdrawActions.setSelectedToken(proportionalToken))

    yield* call(waitForUserShareBeFetched)

    const selectTokenById = yield* select(tokenSelectors.selectById)

    const userAddress = yield* select(walletSelectors.userAddress)

    if (poolModel && userAddress) {
      const poolToken = selectTokenById(poolModel.address)

      yield* call(waitForUserBalanceBeFetched)

      const selectTokenBalance = yield* select(
        balancesSelectors.selectTokenBalance,
      )

      const userPoolTokenBalance = selectTokenBalance(
        userAddress,
        poolModel.address,
      )

      if (userPoolTokenBalance && poolToken) {
        const {
          userMaxLpTokenBalance,
          isUserShareGreaterThanMaximumShare,
        } = yield* call(
          calculateMaxAvailableUserLpTokenBalance,
          poolModel.pool.poolType,
          { ...poolToken, displayName: '', source: '' },
          poolModel.pool.totalShares,
          userPoolTokenBalance,
        )

        const tokens = getPoolDepositTokens(
          poolModel,
          applicationChainId,
          false,
        )

        const tokensAmountMax = yield* call(
          withdrawSingleTokenMax,
          withdrawActions.withdrawSingleTokenMaxRequest({
            outTokens: tokens.map(({ address }) => address),
            poolId: poolModel.pool.id,
            tokenInAddress: poolToken.address,
            tokenInAmount: userMaxLpTokenBalance,
          }),
        )

        yield* put(
          withdrawActions.withdrawSingleTokenRequestUpdate(tokensAmountMax),
        )

        const isComposablePool =
          poolModel.pool.poolType === PoolType.ComposableStable

        if (isComposablePool) {
          const withdrawEditor = yield* select(withdrawSelectors.withdrawEditor)
          yield* call(
            calculateComposablePoolProportionalWithdrawSaga,
            withdrawActions.calculateComposablePoolProportionalWithdrawRequest({
              percentage: withdrawEditor.percentage,
              poolId,
            }),
          )
        }

        yield* put(
          withdrawActions.withdrawInitializeSuccess({
            poolId,
            buttonDisabled: false,
            isUserShareGreaterThanMaximumShare,
            userMaxLpTokenBalance,
            isInitialized: true,
          }),
        )
      }
    }
  } catch (e) {
    console.error(e)
  }
}
