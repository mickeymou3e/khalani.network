import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { select, call } from 'typed-redux-saga'

import { PoolType } from '@interfaces/pool'
import { poolBalancesSelectors } from '@store/balances/selectors/pool/balances.selector'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { BigDecimal, calculatePriceImpactWithdraw } from '@utils/math'

import { withdrawSelectors } from '../withdraw.selector'

export function* withdrawPriceImpact(
  withdrawAmount: BigDecimal,
): Generator<StrictEffect, string> {
  try {
    yield* call(waitForPoolsAndTokensBeFetched)

    const isProportionalWithdraw = yield* select(
      withdrawSelectors.isProportionalWithdraw,
    )

    const selectPoolBalance = yield* select(
      poolBalancesSelectors.selectPoolBalances,
    )

    const { selectedToken, poolId } = yield* select(
      withdrawSelectors.withdrawEditor,
    )

    const selectPoolModel = yield* select(poolsModelsSelector.selectById)

    const poolModel = poolId && selectPoolModel(poolId)

    if (
      isProportionalWithdraw ||
      withdrawAmount.toBigNumber().eq(BigNumber.from(0))
    ) {
      return '0.00%'
    }

    if (
      selectedToken &&
      poolModel &&
      poolModel.pool.poolType === PoolType.Weighted
    ) {
      const poolBalances = selectPoolBalance(poolId)

      const withdrawAmounts = poolModel.depositTokens.map(({ address }) => {
        if (address === selectedToken.address) return withdrawAmount
        return BigDecimal.from(0, withdrawAmount.decimals)
      })

      const weights = poolModel.tokens.map(
        (token) => token.weight ?? BigDecimal.from(0),
      )

      const currentBalances: BigDecimal[] = poolBalances
        ? Object.values(poolBalances).map(
            (balance) => balance ?? BigDecimal.from(0),
          )
        : []

      const priceImpact = yield* call(
        calculatePriceImpactWithdraw,
        isProportionalWithdraw,
        withdrawAmounts,
        currentBalances,
        weights,
        poolModel.pool.swapFee,
        poolModel.pool.totalLiquidity,
      )

      return priceImpact
    }

    return '0.00%'
  } catch {
    return '0.00%'
  }
}
