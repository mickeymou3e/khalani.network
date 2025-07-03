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
import { createBackstopWithdrawPlan } from '@store/history/plans/backstop/withdraw'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'

import { waitForDataToBeUpToDate } from '../../blockChange'
import { IBackstopWithdrawPayload } from './types'

function* backstopWithdrawWrapper(
  bammContract: GodwokenBAMM | ZkSyncBAMM,
  amount: BigNumber,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.WithdrawBackstop
  const applicationChainId = yield* select(walletSelectors.applicationChainId)

  try {
    gasEstimation = yield* call(bammContract.estimateGas.withdraw, amount)
  } catch (e) {
    console.error(e)
  }

  const result = yield* call(bammContract.withdraw, amount, {
    gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
    gasPrice: GAS_PRICE(applicationChainId),
  })

  try {
    yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
  } catch (_error) {
    try {
      yield* call(bammContract.callStatic.withdraw, amount, {
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

export function* backstopWithdrawSaga(
  action: PayloadAction<IBackstopWithdrawPayload>,
): Generator {
  let backstopWithdrawPlanTransactionId
  try {
    const { amount, assetAddress } = action.payload
    const reserveSelector = yield* select(reservesSelectors.selectById)
    const reserve = reserveSelector(assetAddress)
    const pool = yield* select(contractsSelectors.pool)
    const userAddress = yield* select(walletSelectors.ethAddress)
    const bammSelector = yield* select(contractsSelectors.bammSelector)
    const ercSelector = yield* select(contractsSelectors.ercSelector)

    if (!reserve) {
      throw Error('reserve not found')
    }
    if (!pool) {
      throw Error('pool not found')
    }

    const bammAddress = yield* call(pool.getBProtocol, assetAddress)
    const bamm = bammSelector?.(bammAddress)
    const aTokenContract = ercSelector?.(reserve.aTokenAddress)
    if (!bamm) {
      throw Error('bam not found')
    }

    if (!aTokenContract) {
      throw Error('erc not found')
    }

    const aTokenBammBalance = yield* call(
      aTokenContract.balanceOf,
      bamm.address,
    )

    const collateralValue = yield* call(bamm.getCollateralValue)
    const bammTotalSupply = yield* call(bamm.totalSupply)

    const withdrawAmount = amount
      .mul(bammTotalSupply)
      .div(aTokenBammBalance.add(collateralValue.value))

    if (!bamm) {
      throw Error('bamm not connected')
    }

    const { transactionId } = yield* call(
      createBackstopWithdrawPlan,
      reserve?.aTokenAddress,
      amount,
    )

    backstopWithdrawPlanTransactionId = transactionId

    if (!transactionId || !userAddress) throw Error()

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(backstopWithdrawWrapper, bamm, withdrawAmount),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.backstopWithdrawSuccess())
    yield* call(fetchBackstopPools)
  } catch (error) {
    if (backstopWithdrawPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: backstopWithdrawPlanTransactionId,
        }),
      )

      yield* put(providerActions.backstopWithdrawFailure())
    }

    console.error(error)
  }
}
