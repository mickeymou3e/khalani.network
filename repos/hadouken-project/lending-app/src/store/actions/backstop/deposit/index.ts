import { BigNumber, ContractTransaction } from 'ethers'
import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { IBAMM as GodwokenBAMM } from '@hadouken-project/lending-contracts/godwoken'
import { IBAMM as ZkSyncBAMM } from '@hadouken-project/lending-contracts/zksync'
import { StrictEffect } from '@redux-saga/types'
import { PayloadAction } from '@reduxjs/toolkit'
import { fetchBackstopPools } from '@store/backstop/fetchBackstopPools/fetchBackstopPools.saga'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createBackstopDepositPlan } from '@store/history/plans/backstop/deposit'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'

import { approveToken } from '../../approve'
import { waitForDataToBeUpToDate } from '../../blockChange'
import { IBackstopDepositPayload } from './types'

function* backstopDepositWrapper(
  bammContract: GodwokenBAMM | ZkSyncBAMM,
  amount: BigNumber,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.DepositBackstop
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  try {
    gasEstimation = yield* call(bammContract.estimateGas.deposit, amount)
  } catch (e) {
    console.error(e)
  }

  const result = yield* call(bammContract.deposit, amount, {
    gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
    gasPrice: GAS_PRICE(applicationChainId),
  })

  try {
    yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
  } catch (_error) {
    try {
      yield* call(bammContract.callStatic.deposit, amount, {
        gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
        gasPrice: GAS_PRICE(applicationChainId),
      })
    } catch (error) {
      yield* call(setContractError, error)
      throw Error(error)
    }
  }

  return result
}

export function* backstopDepositSaga(
  action: PayloadAction<IBackstopDepositPayload>,
): Generator {
  let depositPlanTransactionId
  try {
    const { amount, assetAddress } = action.payload
    const reserveSelector = yield* select(reservesSelectors.selectById)
    const reserve = reserveSelector(assetAddress)
    const pool = yield* select(contractsSelectors.pool)
    const userAddress = yield* select(walletSelectors.ethAddress)
    const bammSelector = yield* select(contractsSelectors.bammSelector)

    if (!reserve) {
      throw Error('reserve not found')
    }
    if (!pool) {
      throw Error('pool not found')
    }

    const bammAddress = yield* call(pool.getBProtocol, assetAddress)
    const bamm = bammSelector?.(bammAddress)

    if (!bamm) {
      throw Error('bamm not connected')
    }

    const approveAddress = yield* call(bamm.cBorrow)

    const ercSelector = yield* select(contractsSelectors.ercSelector)

    const { transactionId, shouldApproveToken } = yield* call(
      createBackstopDepositPlan,
      reserve?.aTokenAddress,
      amount,
      approveAddress,
    )

    depositPlanTransactionId = transactionId

    if (!transactionId || !userAddress) throw Error()

    if (shouldApproveToken) {
      const token = ercSelector?.(reserve.aTokenAddress)

      if (!token) throw Error('Token not found')

      yield* operationWrapper(
        transactionId,
        call(approveToken, token, approveAddress, amount),
      )
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(backstopDepositWrapper, bamm, amount),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.backstopDepositSuccess())
    yield* call(fetchBackstopPools)
  } catch (error) {
    if (depositPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: depositPlanTransactionId,
        }),
      )

      yield* put(providerActions.backstopDepositFailure())
    }

    console.error(error)
  }
}
