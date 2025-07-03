import { call, put, select } from 'typed-redux-saga'

import { ActionInProgress } from '@interfaces/action'
import { PayloadAction } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createBackstopWithdrawPlan } from '@store/history/plans/backstop/createBackstopWithdrawPlan'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { backstopSelectors } from '../../backstop.selector'
import { backstopActions } from '../../backstop.slice'
import { BackstopWithdrawRequestPayload } from '../../backstop.types'
import { backstopWithdrawSaga } from './backstopWithdraw.saga'

export function* backstopWithdrawRequestSaga(
  action: PayloadAction<BackstopWithdrawRequestPayload>,
): Generator {
  try {
    yield* put(
      contractsActions.setActionInProgress(ActionInProgress.BackstopWithdraw),
    )

    const { amount: withdrawAmount } = action.payload
    const liquidationToken = yield* select(backstopSelectors.liquidationToken)
    const userAddress = yield* select(walletSelectors.userAddress)
    const backstopContract = yield* select(contractsSelectors.backstopContracts)

    const backstopAddress = backstopContract?.backstop?.address

    if (!backstopAddress) throw Error('Backstop not defined')
    if (!userAddress) throw Error('User not defined')
    if (!liquidationToken) throw Error('Liquidation token not defined')

    const liquidationTokenAddress = liquidationToken.address

    const { transactionId, operationId } = yield* call(
      createBackstopWithdrawPlan,
      withdrawAmount,
    )

    const tokenConnector = yield* select(contractsSelectors.tokenConnector)
    const tokenContract = yield* call(tokenConnector, liquidationTokenAddress)

    yield* operationWrapper(
      transactionId,
      operationId,
      call(
        backstopWithdrawSaga,
        backstopActions.backstopWithdrawRequest(action.payload),
      ),
    )

    const backstopTotalBalance = yield* call(
      tokenContract.balanceOf,
      backstopAddress,
    )

    yield* put(
      backstopActions.backstopWithdrawSuccess({
        backstopTotalBalance: BigDecimal.from(
          backstopTotalBalance,
          liquidationToken.decimals,
        ),
      }),
    )
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(backstopActions.backstopWithdrawFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
