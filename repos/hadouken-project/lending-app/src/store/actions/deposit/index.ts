import { BigNumber, ContractTransaction } from 'ethers'
import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { getConfig } from '@hadouken-project/lending-contracts'
import { LendingPool as GodwokenLendingPool } from '@hadouken-project/lending-contracts/godwoken'
import { LendingPool as ZkSyncLendingPool } from '@hadouken-project/lending-contracts/zksync'
import { StrictEffect } from '@redux-saga/types'
import { PayloadAction } from '@reduxjs/toolkit'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createDepositPlan } from '@store/history/plans/deposit'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'
import { ENVIRONMENT } from '@utils/stringOperations'

import { approveToken } from '../approve'
import { waitForDataToBeUpToDate } from '../blockChange'
import { IDepositPayload } from './types'

function* depositWrapper(
  poolContract: GodwokenLendingPool | ZkSyncLendingPool,
  assetAddress: string,
  amount: BigNumber,
  userAddress: string,
  isWrappedToken: boolean,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.Deposit
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  const wEthGateway = yield* select(contractsSelectors.wEthGateway)
  try {
    if (isWrappedToken) {
      if (!wEthGateway) throw new Error('wEthGateway not defined')
      gasEstimation = yield* call(
        wEthGateway?.estimateGas?.depositETH,
        poolContract.address,
        userAddress,
        0,
        { value: amount },
      )
    } else {
      gasEstimation = yield* call(
        poolContract.estimateGas.deposit,
        assetAddress,
        amount,
        userAddress,
        0,
      )
    }
  } catch (e) {
    console.error(e)
  }

  let result

  if (isWrappedToken) {
    if (!wEthGateway) throw Error('wEthGateway not defined')

    result = yield* call(
      wEthGateway.depositETH,
      poolContract.address,
      userAddress,
      0,
      {
        value: amount,
        gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
        gasPrice: GAS_PRICE(applicationChainId),
      },
    )
  } else {
    result = yield* call(
      poolContract.deposit,
      assetAddress,
      amount,
      userAddress,
      0,
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
        poolContract.callStatic.deposit,
        assetAddress,
        amount,
        userAddress,
        0,
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

export function* depositSaga(
  action: PayloadAction<IDepositPayload>,
): Generator {
  let depositPlanTransactionId
  try {
    const { amount, assetAddress } = action.payload
    const userAddress = yield* select(walletSelectors.ethAddress)
    const poolContract = yield* select(contractsSelectors.pool)
    const wEthGateway = yield* select(contractsSelectors.wEthGateway)
    const ercSelector = yield* select(contractsSelectors.ercSelector)
    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const config = getConfig(applicationChainId)?.(ENVIRONMENT)

    const isWrappedToken =
      action.payload.assetAddress.toLowerCase() ===
      config?.nativeToken?.wrapAddress?.toLowerCase()

    const { transactionId, shouldApproveToken } = yield* call(
      createDepositPlan,
      assetAddress,
      amount,
      isWrappedToken,
    )

    depositPlanTransactionId = transactionId

    if (!transactionId || !userAddress || !poolContract) throw Error()
    if (isWrappedToken && !wEthGateway) throw Error('wEthGateway not defined')

    if (shouldApproveToken) {
      const token = ercSelector?.(assetAddress)

      if (!token) throw Error('Token not found')

      const approveAddress = isWrappedToken
        ? wEthGateway?.address ?? ''
        : poolContract.address

      yield* operationWrapper(
        transactionId,
        call(approveToken, token, approveAddress, amount),
      )
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(
        depositWrapper,
        poolContract,
        assetAddress,
        amount,
        userAddress,
        isWrappedToken,
      ),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.depositSuccess())
  } catch (error) {
    if (depositPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: depositPlanTransactionId,
        }),
      )

      yield* put(providerActions.depositFailure())
    }

    console.error(error)
  }
}
