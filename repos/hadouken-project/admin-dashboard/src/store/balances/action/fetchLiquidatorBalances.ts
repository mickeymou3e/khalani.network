import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { tokenSelectors } from '@store/tokens/tokens.selector'
import { getAppConfig } from '@utils/config'

import { fetchBalance } from './fetchBalance'

export function* fetchLiquidatorBalances(): Generator<StrictEffect, void> {
  try {
    const liquidatorAddress = getAppConfig().contracts.liquidator

    if (liquidatorAddress) {
      const erc20Tokens = yield* select(tokenSelectors.selectAllStandardTokens)

      yield* call(fetchBalance, {
        address: liquidatorAddress,
        tokens: erc20Tokens,
      })
    }
  } catch {}
}
