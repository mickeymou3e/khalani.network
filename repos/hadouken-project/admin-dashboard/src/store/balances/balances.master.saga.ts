import { all, takeEvery, takeLatest } from 'typed-redux-saga'

import {
  fetchLiquidatorBalances,
  fetchOracleBalance,
  fetchProtocolFeeBalances,
  fetchTreasuryBalances,
} from './action'
import { balancesActions } from './balances.slice'

export function* balancesMasterSaga(): Generator {
  yield all([
    takeLatest(
      balancesActions.fetchLiquidatorBalancesRequest.type,
      fetchLiquidatorBalances,
    ),
    takeEvery(
      balancesActions.fetchOracleBalancesRequest.type,
      fetchOracleBalance,
    ),
    takeLatest(
      balancesActions.fetchTreasuryBalanceRequest.type,
      fetchTreasuryBalances,
    ),
    takeLatest(
      balancesActions.fetchProtocolFeeBalanceRequest.type,
      fetchProtocolFeeBalances,
    ),
  ])
}
