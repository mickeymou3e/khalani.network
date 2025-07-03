import { put } from 'typed-redux-saga'

import { getAppConfig } from '@utils/config'

import { balancesActions } from './balances.slice'

export function* initializeBalancesSaga(): Generator {
  try {
    yield* put(balancesActions.fetchLiquidatorBalancesRequest())
    yield* put(balancesActions.fetchTreasuryBalanceRequest())
    yield* put(balancesActions.fetchProtocolFeeBalanceRequest())

    const diaOracleAddress = getAppConfig().contracts.diaOracle
    const bandOracleAddress = getAppConfig().contracts.bandOracle

    if (bandOracleAddress) {
      yield* put(balancesActions.fetchOracleBalancesRequest(bandOracleAddress))
    }

    if (diaOracleAddress) {
      yield* put(balancesActions.fetchOracleBalancesRequest(diaOracleAddress))
    }
  } catch (error) {
    console.error(error)
  }
}
