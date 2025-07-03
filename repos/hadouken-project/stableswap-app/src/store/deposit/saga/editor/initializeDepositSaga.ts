import { call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'

import { getPoolConfig } from '../../../../dataSource/graph/pools/pools/constants'
import { BigDecimal } from '../../../../utils/math'
import { poolsModelsSelector } from '../../../pool/selectors/models/pool-model.selector'
import { depositActions } from '../../deposit.slice'
import { LOW_LIQUIDITY_THRESHOLD } from './constants'
import { getPoolDepositTokens, waitForPoolsAndTokensBeFetched } from './utils'

export function* initializeDepositSaga(
  action: PayloadAction<string>,
): Generator {
  const poolId = action.payload
  yield* call(waitForPoolsAndTokensBeFetched)

  const applicationChainId = yield* select(networkSelectors.applicationChainId)
  const poolModelSelector = yield* select(poolsModelsSelector.selectById)
  const poolModel = poolModelSelector(poolId)

  if (poolModel) {
    const depositTokens = yield* call(
      getPoolDepositTokens,
      poolModel,
      applicationChainId,
      false,
    )
    const poolType = poolModel.pool.poolType

    const poolConfig = getPoolConfig(poolModel.address, applicationChainId)

    const showWrappedCheckbox = Boolean(
      poolConfig &&
        poolConfig?.wrappedDepositTokens &&
        poolConfig?.wrappedDepositTokens.length > 0,
    )

    yield* put(
      depositActions.initializeDepositSuccess({
        depositTokens: depositTokens.map((token) => ({
          ...token,
          amount: undefined,
        })),
        poolId: poolId,
        poolType: poolType,
        showWrappedCheckbox,
        showLowLiquidityBanner:
          poolModel &&
          poolModel.pool &&
          poolModel?.pool?.totalLiquidity?.lt(
            BigDecimal.from(LOW_LIQUIDITY_THRESHOLD, 0),
          ),
      }),
    )
  }
}
