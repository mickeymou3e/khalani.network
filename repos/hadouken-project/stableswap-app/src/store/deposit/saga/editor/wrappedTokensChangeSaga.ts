import { call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'

import { poolsModelsSelector } from '../../../pool/selectors/models/pool-model.selector'
import { depositSelectors } from '../../deposit.selector'
import { depositActions } from '../../deposit.slice'
import { getPoolDepositTokens, waitForPoolsAndTokensBeFetched } from './utils'

export function* wrappedTokensChangeSaga(
  action: PayloadAction<boolean>,
): Generator {
  yield* call(waitForPoolsAndTokensBeFetched)

  const poolModelSelector = yield* select(poolsModelsSelector.selectById)
  const applicationChainId = yield* select(networkSelectors.applicationChainId)
  const editor = yield* select(depositSelectors.depositEditor)

  if (editor.poolId) {
    const poolModel = poolModelSelector(editor.poolId)

    if (poolModel) {
      const depositTokens = yield* call(
        getPoolDepositTokens,
        poolModel,
        applicationChainId,
        action.payload,
      )

      yield* put(
        depositActions.wrappedTokenChangeSuccess({
          depositTokens: depositTokens.map((token) => ({
            ...token,
            amount: undefined,
          })),
          totalDepositValueUSD: BigDecimal.from(0),
          buttonDisabled: true,
          showWrappedTokens: action.payload,
        }),
      )
    }
  }
}
