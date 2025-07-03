import { BigNumber, ContractTransaction, ethers } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { getConfig } from '@hadouken-project/lending-contracts'
import type { LendingPool as GodwokenLendingPool } from '@hadouken-project/lending-contracts/godwoken'
import type { LendingPool as ZkSyncLendingPool } from '@hadouken-project/lending-contracts/zksync'
import { PayloadAction } from '@reduxjs/toolkit'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createWithdrawPlan } from '@store/history/plans/withdraw'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'
import { ENVIRONMENT } from '@utils/stringOperations'

import { approveToken } from '../approve'
import { waitForDataToBeUpToDate } from '../blockChange'
import { IWithdrawPayload } from './types'

function* withdrawWrapper(
  poolContract: GodwokenLendingPool | ZkSyncLendingPool,
  assetAddress: string,
  amount: BigNumber,
  userAddress: string,
  isWrappedToken: boolean,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.Withdraw
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  const wEthGateway = yield* select(contractsSelectors.wEthGateway)

  try {
    if (isWrappedToken) {
      if (!wEthGateway) throw new Error('wEthGateway not defined')
      gasEstimation = yield* call(
        wEthGateway?.estimateGas?.withdrawETH,
        poolContract.address,
        amount,
        userAddress,
      )
    } else {
      gasEstimation = yield* call(
        poolContract.estimateGas.withdraw,
        assetAddress,
        amount,
        userAddress,
      )
    }
  } catch (e) {
    console.error(e)
  }
  let result

  if (isWrappedToken) {
    if (!wEthGateway) throw Error('wEthGateway not defined')

    result = yield* call(
      wEthGateway.withdrawETH,
      poolContract.address,
      amount,
      userAddress,
      {
        gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
        gasPrice: GAS_PRICE(applicationChainId),
      },
    )
  } else {
    result = yield* call(
      poolContract.withdraw,
      assetAddress,
      amount,
      userAddress,
      {
        gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
        gasPrice: GAS_PRICE(applicationChainId),
      },
    )
  }

  try {
    yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
  } catch (_error) {
    try {
      yield* call(
        poolContract.callStatic.withdraw,
        assetAddress,
        amount,
        userAddress,
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

export function* withdrawSaga(
  action: PayloadAction<IWithdrawPayload>,
): Generator {
  let withdrawPlanTransactionId
  try {
    const { amount, assetAddress, withdrawAll } = action.payload
    const userAddress = yield* select(walletSelectors.ethAddress)
    const poolContract = yield* select(contractsSelectors.pool)
    const ercSelector = yield* select(contractsSelectors.ercSelector)
    const wEthGateway = yield* select(contractsSelectors.wEthGateway)
    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const reserveSelector = yield* select(reservesSelectors.selectById)
    const reserve = reserveSelector(action.payload.assetAddress)

    const config = getConfig(applicationChainId)?.(ENVIRONMENT)

    const isWrappedToken =
      action.payload.assetAddress.toLowerCase() ===
      config?.nativeToken?.wrapAddress?.toLowerCase()

    if (!reserve) throw Error('reserve not defined')
    if (!poolContract) throw Error('poolContract not defined')
    if (!userAddress) throw Error('userAddress not defined')

    const { transactionId, shouldApproveToken } = yield* call(
      createWithdrawPlan,
      assetAddress,
      amount,
      userAddress,
      withdrawAll,
      isWrappedToken,
      reserve.aTokenAddress,
    )

    if (!transactionId) throw Error('transactionId not defined')

    withdrawPlanTransactionId = transactionId

    const amountToWithdraw = withdrawAll ? ethers.constants.MaxUint256 : amount

    if (shouldApproveToken) {
      if (!wEthGateway) throw Error('wEthGateway not defined')
      if (!ercSelector) throw Error('ercSelector not defined')

      const token = ercSelector(reserve.aTokenAddress)
      yield* operationWrapper(
        transactionId,
        call(
          approveToken,
          token,
          wEthGateway.address,
          addSlippageToValue(amount, 2),
        ),
      )
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(
        withdrawWrapper,
        poolContract,
        assetAddress,
        amountToWithdraw,
        userAddress,
        isWrappedToken,
      ),
    )

    yield* call(transactionResult.wait, WAIT_TRANSACTION_IN_BLOCKS)

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.withdrawSuccess())
  } catch (error) {
    if (withdrawPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: withdrawPlanTransactionId,
        }),
      )
    }

    yield* put(providerActions.withdrawFailure())

    console.error(error)
  }
}
