import { BigNumber, ContractTransaction, ethers } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { BorrowType } from '@constants/Lending'
import { getConfig } from '@hadouken-project/lending-contracts'
import { LendingPool as GodwokenLendingPool } from '@hadouken-project/lending-contracts/godwoken'
import { LendingPool as ZkSyncLendingPool } from '@hadouken-project/lending-contracts/zksync'
import { PayloadAction } from '@reduxjs/toolkit'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createRepayPlan } from '@store/history/plans/repay'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'
import { ENVIRONMENT } from '@utils/stringOperations'

import { approveToken } from '../approve'
import { waitForDataToBeUpToDate } from '../blockChange'
import { IRepayPayload } from './types'

// this slippage will be returned from wEthGateway contract
const REPAY_WETH_SLIPPAGE = 2

function* repayWrapper(
  poolContract: GodwokenLendingPool | ZkSyncLendingPool,
  assetAddress: string,
  amount: BigNumber,
  borrowType: BorrowType,
  userAddress: string,
  repayAll: boolean,
  isWrappedToken: boolean,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.Repay
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  const wEthGateway = yield* select(contractsSelectors.wEthGateway)

  const repayAmount = repayAll ? ethers.constants.MaxUint256 : amount

  if (isWrappedToken) {
    if (!wEthGateway) throw Error('wEthGateway not found')

    gasEstimation = yield* call(
      wEthGateway.estimateGas.repayETH,
      poolContract.address,
      repayAmount,
      Number(borrowType),
      userAddress,
      {
        value: repayAll
          ? addSlippageToValue(amount, REPAY_WETH_SLIPPAGE)
          : amount,
      },
    )
  } else {
    try {
      gasEstimation = yield* call(
        poolContract.estimateGas.repay,
        assetAddress,
        repayAmount,
        Number(borrowType),
        userAddress,
      )
    } catch (e) {
      console.error(e)
    }
  }

  let result

  if (isWrappedToken) {
    if (!wEthGateway) throw Error('wEthGateway not found')
    result = yield* call(
      wEthGateway?.repayETH,
      poolContract.address,
      repayAmount,
      Number(borrowType),
      userAddress,
      {
        value: repayAll
          ? addSlippageToValue(amount, REPAY_WETH_SLIPPAGE)
          : amount,
        gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
        gasPrice: GAS_PRICE(applicationChainId),
      },
    )
  } else {
    result = yield* call(
      poolContract.repay,
      assetAddress,
      repayAmount,
      Number(borrowType),
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
    if (isWrappedToken) {
      try {
        if (!wEthGateway) throw Error('wEthGateway not found')
        yield* call(
          wEthGateway.callStatic.repayETH,
          poolContract.address,
          repayAmount,
          Number(borrowType),
          userAddress,
          {
            value: repayAll
              ? addSlippageToValue(amount, REPAY_WETH_SLIPPAGE)
              : amount,
            gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
            gasPrice: GAS_PRICE(applicationChainId),
          },
        )
      } catch (error) {
        yield* call(setContractError, error)
        throw Error(error)
      }
    } else {
      try {
        yield* call(
          poolContract.callStatic.repay,
          assetAddress,
          repayAmount,
          Number(borrowType),
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
  }

  return result
}

export function* repaySaga(action: PayloadAction<IRepayPayload>): Generator {
  let repayPlanTransactionId
  try {
    const {
      amount,
      assetAddress,
      borrowType,
      repayAll,
      slippage,
    } = action.payload
    const userAddress = yield* select(walletSelectors.ethAddress)
    const poolContract = yield* select(contractsSelectors.pool)
    const ercSelector = yield* select(contractsSelectors.ercSelector)
    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const config = getConfig(applicationChainId)?.(ENVIRONMENT)

    const amountWithSlippage = repayAll
      ? addSlippageToValue(amount, slippage)
      : amount

    const isWrappedToken =
      action.payload.assetAddress.toLowerCase() ===
      config?.nativeToken?.wrapAddress?.toLowerCase()

    const { transactionId, shouldApproveToken } = yield* call(
      createRepayPlan,
      assetAddress,
      amount,
      amountWithSlippage,
      isWrappedToken,
    )

    repayPlanTransactionId = transactionId

    if (!transactionId || !poolContract || !userAddress) throw Error()

    if (shouldApproveToken) {
      const token = ercSelector?.(assetAddress)

      if (!token) throw Error('Token not found')

      yield* operationWrapper(
        transactionId,
        call(approveToken, token, poolContract.address, amountWithSlippage),
      )
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(
        repayWrapper,
        poolContract,
        assetAddress,
        amount,
        borrowType,
        userAddress,
        repayAll,
        isWrappedToken,
      ),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.repaySuccess())
  } catch (error) {
    if (repayPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: repayPlanTransactionId,
        }),
      )
    }

    yield* put(providerActions.repayFailure())

    console.error(error)
  }
}
