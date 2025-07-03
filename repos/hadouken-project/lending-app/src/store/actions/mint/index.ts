import { BigNumber } from 'ethers'
import { call, put, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { ContractTransaction } from '@ethersproject/contracts'
import { ERC20Test as GodwokenERC20Test } from '@hadouken-project/lending-contracts/godwoken'
import { ERC20Test as ZkSyncERC20Test } from '@hadouken-project/lending-contracts/zksync'
import { StrictEffect } from '@redux-saga/types'
import { PayloadAction } from '@reduxjs/toolkit'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createMintPlan } from '@store/history/plans/mint'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { setContractError } from '@store/provider/setError.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'

import { waitForDataToBeUpToDate } from '../blockChange'
import { IMintPayload } from './types'

export function* mintWrapper(
  tokenContract: GodwokenERC20Test | ZkSyncERC20Test,
  userAddress: string,
  amount: BigNumber,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.Mint
  const applicationChainId = yield* select(walletSelectors.applicationChainId)

  try {
    gasEstimation = yield* call(
      tokenContract.estimateGas.mint,
      userAddress,
      amount,
    )
  } catch (exc) {}

  const result = yield* call(tokenContract.mint, userAddress, amount, {
    gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
    gasPrice: GAS_PRICE(applicationChainId),
  })

  try {
    yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
  } catch (_error) {
    try {
      yield* call(tokenContract.callStatic.mint, userAddress, amount, {
        gasLimit: gasEstimation,
        gasPrice: GAS_PRICE(applicationChainId),
      })
    } catch (error) {
      yield* call(setContractError, error)
      throw Error(error)
    }
  }

  return result
}

export function* mintSaga(action: PayloadAction<IMintPayload>): Generator {
  let mintPlanTransactionId
  try {
    const { assetAddress, amount } = action.payload
    const ethAddress = yield* select(walletSelectors.ethAddress)

    const mintSelector = yield* select(contractsSelectors.mintSelector)

    const tokenContract = mintSelector?.(assetAddress)

    const { transactionId } = yield* call(createMintPlan, assetAddress, amount)

    mintPlanTransactionId = transactionId

    if (!tokenContract || !transactionId || !ethAddress) throw Error()

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(mintWrapper, tokenContract, ethAddress, amount),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForDataToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(providerActions.mintSuccess())
  } catch (error) {
    if (mintPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: mintPlanTransactionId,
        }),
      )
    }

    yield* put(providerActions.mintFailure())

    console.error(error)
  }
}
