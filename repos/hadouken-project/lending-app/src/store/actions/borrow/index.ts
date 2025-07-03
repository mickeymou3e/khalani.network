import { BigNumber, ContractTransaction } from 'ethers'
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
import { createBorrowPlan } from '@store/history/plans/borrow'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'
import { ENVIRONMENT } from '@utils/stringOperations'

import { waitForDataToBeUpToDate } from '../blockChange'
import { IBorrowPayload } from './types'
import { wEthApprove } from './wEthApprove'

function* borrowWrapper(
  poolContract: GodwokenLendingPool | ZkSyncLendingPool,
  assetAddress: string,
  amount: BigNumber,
  borrowType: BorrowType,
  userAddress: string,
  isWrappedToken: boolean,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.Borrow
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  const wEthGateway = yield* select(contractsSelectors.wEthGateway)

  try {
    if (isWrappedToken) {
      if (!wEthGateway) throw new Error('wEthGateway not defined')
      gasEstimation = yield* call(
        wEthGateway?.estimateGas?.borrowETH,
        poolContract.address,
        amount,
        Number(borrowType),
        0,
      )
    } else {
      gasEstimation = yield* call(
        poolContract.estimateGas.borrow,
        assetAddress,
        amount,
        Number(borrowType),
        0,
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
      wEthGateway.borrowETH,
      poolContract.address,
      amount,
      Number(borrowType),
      0,
    )
  } else {
    result = yield* call(
      poolContract.borrow,
      assetAddress,
      amount,
      Number(borrowType),
      0,
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
      if (isWrappedToken) {
        if (!wEthGateway) throw Error('wEthGateway not defined')

        yield* call(
          wEthGateway.callStatic.borrowETH,
          poolContract.address,
          amount,
          Number(borrowType),
          0,
        )
      } else {
        yield* call(
          poolContract.callStatic.borrow,
          assetAddress,
          amount,
          Number(borrowType),
          0,
          userAddress,
          {
            gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
            gasPrice: GAS_PRICE(applicationChainId),
          },
        )
      }
    } catch (error) {
      yield* call(setContractError, error)
      throw Error(error)
    }
  }

  return result
}

export function* borrowSaga(action: PayloadAction<IBorrowPayload>): Generator {
  let borrowPlanTransactionId
  try {
    const { amount, assetAddress, borrowType } = action.payload
    const reserveSelector = yield* select(reservesSelectors.selectById)
    const stableDebtToken = yield* select(contractsSelectors.stableDebtToken)
    const variableDebtToken = yield* select(
      contractsSelectors.variableDebtToken,
    )

    const userAddress = yield* select(walletSelectors.ethAddress)
    const wEthGateway = yield* select(contractsSelectors.wEthGateway)
    const poolContract = yield* select(contractsSelectors.pool)

    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const config = getConfig(applicationChainId)?.(ENVIRONMENT)

    const isWrappedToken =
      action.payload.assetAddress.toLowerCase() ===
      config?.nativeToken.wrapAddress?.toLowerCase()

    const { transactionId, shouldApproveToken } = yield* call(
      createBorrowPlan,
      assetAddress,
      amount,
      borrowType,
      isWrappedToken,
    )

    borrowPlanTransactionId = transactionId

    if (shouldApproveToken) {
      if (!wEthGateway) throw Error('wEthGateway not defined')

      const reserve = reserveSelector(action.payload.assetAddress)
      if (!reserve) throw Error('reserve not found')
      if (borrowType === BorrowType.stable) {
        if (!stableDebtToken) throw Error('stableDebtToken not found')

        const contract = stableDebtToken(reserve.stableDebtTokenAddress)

        yield* operationWrapper(
          transactionId,
          call(wEthApprove, contract, wEthGateway.address, amount),
        )
      } else {
        if (!variableDebtToken) throw Error('variableDebtToken not found')

        const contract = variableDebtToken(reserve.variableDebtTokenAddress)

        yield* operationWrapper(
          transactionId,
          call(wEthApprove, contract, wEthGateway.address, amount),
        )
      }
    }

    if (!transactionId || !userAddress || !poolContract) throw Error()

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(
        borrowWrapper,
        poolContract,
        assetAddress,
        amount,
        borrowType,
        userAddress,
        isWrappedToken,
      ),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.borrowSuccess())
  } catch (error) {
    if (borrowPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: borrowPlanTransactionId,
        }),
      )
    }

    yield* put(providerActions.borrowFailure())

    console.error(error)
  }
}
