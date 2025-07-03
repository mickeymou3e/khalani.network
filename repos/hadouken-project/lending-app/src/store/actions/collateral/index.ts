import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { ContractTransaction } from '@ethersproject/contracts'
import { LendingPool as GodwokenLendingPool } from '@hadouken-project/lending-contracts/godwoken'
import { LendingPool as ZkSyncLendingPool } from '@hadouken-project/lending-contracts/zksync'
import { StrictEffect } from '@redux-saga/types'
import { PayloadAction } from '@reduxjs/toolkit'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createCollateralPlan } from '@store/history/plans/collateral'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { addSlippageToValue } from '@utils/math'

import { walletSelectors } from '../../wallet/wallet.selector'
import { waitForDataToBeUpToDate } from '../blockChange'
import { ICollateralPayload } from './types'

export function* setUserUseReserveAsCollateralWrapper(
  poolContract: GodwokenLendingPool | ZkSyncLendingPool,
  asset: string,
  useAsCollateral: boolean,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.SwitchCollateral
  const applicationChainId = yield* select(walletSelectors.applicationChainId)

  try {
    gasEstimation = yield* call(
      poolContract.estimateGas.setUserUseReserveAsCollateral,
      asset,
      useAsCollateral,
    )
  } catch (exc) {
    console.error(exc)
  }

  const result = yield* call(
    poolContract.setUserUseReserveAsCollateral,
    asset,
    useAsCollateral,
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
        poolContract.callStatic.setUserUseReserveAsCollateral,
        asset,
        useAsCollateral,
        {
          gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
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

export function* collateralSaga(
  action: PayloadAction<ICollateralPayload>,
): Generator {
  let collateralPlanTransactionId
  try {
    const { asset, amount, useAsCollateral } = action.payload
    const poolContract = yield* select(contractsSelectors.pool)

    const { transactionId } = yield* call(
      createCollateralPlan,
      asset,
      amount,
      useAsCollateral,
    )

    collateralPlanTransactionId = transactionId

    if (!transactionId || !poolContract) throw Error()

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(
        setUserUseReserveAsCollateralWrapper,
        poolContract,
        asset,
        useAsCollateral,
      ),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.collateralSuccess())
  } catch (error) {
    if (collateralPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: collateralPlanTransactionId,
        }),
      )
    }

    yield* put(providerActions.collateralFailure())

    console.error(error)
  }
}
