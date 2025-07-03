import { ContractTransaction } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { BorrowType } from '@constants/Lending'
import { LendingPool as GodwokenLendingPool } from '@hadouken-project/lending-contracts/godwoken'
import { LendingPool as ZkSyncLendingPool } from '@hadouken-project/lending-contracts/zksync'
import { PayloadAction } from '@reduxjs/toolkit'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createSwapBorrowModePlan } from '@store/history/plans/swapBorrowMode'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { addSlippageToValue } from '@utils/math'

import { walletSelectors } from '../../wallet/wallet.selector'
import { waitForDataToBeUpToDate } from '../blockChange'
import { ISwapBorrowModePayload } from './types'

function* swapBorrowModeWrapper(
  poolContract: GodwokenLendingPool | ZkSyncLendingPool,
  assetAddress: string,
  borrowType: BorrowType,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.SwapBorrowMode
  const applicationChainId = yield* select(walletSelectors.applicationChainId)

  try {
    gasEstimation = yield* call(
      poolContract.estimateGas.swapBorrowRateMode,
      assetAddress,
      Number(borrowType),
    )
  } catch (e) {
    console.error(e)
  }

  const result = yield* call(
    poolContract.swapBorrowRateMode,
    assetAddress,
    Number(borrowType),
    {
      gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
      gasPrice: GAS_PRICE(applicationChainId),
    },
  )

  try {
    yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
  } catch (_error) {
    try {
      yield* call(
        poolContract.callStatic.swapBorrowRateMode,
        assetAddress,
        Number(borrowType),
        {
          gasLimit: gasEstimation,
          gasPrice: GAS_PRICE(applicationChainId),
        },
      )
    } catch (error) {
      yield* call(setContractError, error)
      throw Error(error)
    }
  }

  return result
}

export function* swapBorrowModeSaga(
  action: PayloadAction<ISwapBorrowModePayload>,
): Generator {
  let swapBorrowModePlanTransactionId
  try {
    const { amount, assetAddress, borrowType } = action.payload
    const poolContract = yield* select(contractsSelectors.pool)

    const { transactionId } = yield* call(
      createSwapBorrowModePlan,
      assetAddress,
      amount,
      borrowType,
    )

    swapBorrowModePlanTransactionId = transactionId

    if (!transactionId || !poolContract) throw Error()

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(swapBorrowModeWrapper, poolContract, assetAddress, borrowType),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.swapBorrowModeSuccess())
  } catch (error) {
    if (swapBorrowModePlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: swapBorrowModePlanTransactionId,
        }),
      )
    }

    yield* put(providerActions.swapBorrowModeFailure())

    console.error(error)
  }
}
