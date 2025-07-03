import { call, select } from 'typed-redux-saga'

import { tokenSelectors } from '@store/tokens/tokens.selector'
import { getAppConfig } from '@utils/config'

import { fetchBalance } from './fetchBalance'

export function* fetchTreasuryBalances(): Generator {
  try {
    const treasuryAddress = getAppConfig().contracts.treasury

    if (treasuryAddress) {
      const aTokens = yield* select(tokenSelectors.selectAllDepositTokens)

      yield* call(fetchBalance, {
        address: treasuryAddress,
        tokens: aTokens,
      })
    }
  } catch {}
}
