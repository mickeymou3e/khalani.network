import { call, select } from 'typed-redux-saga'

import { tokenSelectors } from '@store/tokens/tokens.selector'
import { getAppConfig } from '@utils/config'

import { fetchBalance } from './fetchBalance'

export function* fetchProtocolFeeBalances(): Generator {
  try {
    const protocolFeeAddress = getAppConfig().contracts.protocolFeeCollector
    if (protocolFeeAddress) {
      //* NOTE: after add protocol fee implementation change to swap tokens
      const tokens = yield* select(tokenSelectors.selectAllStandardTokens)

      yield* call(fetchBalance, {
        address: protocolFeeAddress,
        tokens: tokens,
      })
    }
  } catch {}
}
