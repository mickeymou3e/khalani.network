import { call, put, select } from 'typed-redux-saga'

import { ActionInProgress } from '@interfaces/action'
import { PayloadAction } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createBackstopDepositPlan } from '@store/history/plans/backstop/createBackstopDepositPlan'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { backstopSelectors } from '../../backstop.selector'
import { backstopActions } from '../../backstop.slice'
import { BackstopDepositRequestPayload } from '../../backstop.types'
import { depositToBackstopSaga } from './depositToBackstop.saga'

export function* depositToBackstopRequestSaga(
  action: PayloadAction<BackstopDepositRequestPayload>,
): Generator {
  try {
    yield* put(
      contractsActions.setActionInProgress(ActionInProgress.BackstopDeposit),
    )

    const { amount: depositAmount } = action.payload
    const liquidationToken = yield* select(backstopSelectors.liquidationToken)
    const userAddress = yield* select(walletSelectors.userAddress)
    const backstopContract = yield* select(contractsSelectors.backstopContracts)

    const backstopAddress = backstopContract?.backstop?.address

    if (!backstopAddress) throw Error('Backstop not defined')
    if (!userAddress) throw Error('User not defined')
    if (!liquidationToken) throw Error('Liquidation token not defined')

    const liquidationTokenAddress = liquidationToken.address

    const { shouldApproveToken, transactionId, operationIds } = yield* call(
      createBackstopDepositPlan,
      liquidationTokenAddress,
      depositAmount,
    )

    const tokenConnector = yield* select(contractsSelectors.tokenConnector)
    const tokenContract = yield* call(tokenConnector, liquidationTokenAddress)

    if (shouldApproveToken) {
      yield* operationWrapper(
        transactionId,
        operationIds[0],
        call(approveToken, tokenContract, backstopAddress, depositAmount, 0),
      )
    }

    yield* operationWrapper(
      transactionId,
      operationIds[shouldApproveToken ? 1 : 0],
      call(
        depositToBackstopSaga,
        backstopActions.depositToBackstopRequest(action.payload),
      ),
    )

    const backstopTotalBalance = yield* call(
      tokenContract.balanceOf,
      backstopAddress,
    )

    yield* put(
      backstopActions.depositToBackstopSuccess({
        backstopTotalBalance: BigDecimal.from(
          backstopTotalBalance,
          liquidationToken.decimals,
        ),
      }),
    )
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(backstopActions.depositToBackstopFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
