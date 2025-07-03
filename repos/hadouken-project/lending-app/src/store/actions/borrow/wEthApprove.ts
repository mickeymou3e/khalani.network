import { BigNumber, ContractTransaction } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import {
  StableDebtToken as GodwokenStableDebtToken,
  VariableDebtToken as GodwokenVariableDebtToken,
} from '@hadouken-project/lending-contracts/godwoken'
import {
  StableDebtToken as ZkSyncStableDebtToken,
  VariableDebtToken as ZkSyncVariableDebtToken,
} from '@hadouken-project/lending-contracts/zksync'
import { setContractError } from '@store/provider/setError.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addSlippageToValue } from '@utils/math'

export function* wEthApprove(
  contract:
    | GodwokenStableDebtToken
    | ZkSyncStableDebtToken
    | GodwokenVariableDebtToken
    | ZkSyncVariableDebtToken,
  to: string,
  amount: BigNumber,
): Generator<StrictEffect, ContractTransaction> {
  let gasEstimation = GasLimits.ApproveStable
  const applicationChainId = yield* select(walletSelectors.applicationChainId)

  try {
    gasEstimation = yield* call(
      contract.estimateGas.approveDelegation,
      to,
      amount,
    )
  } catch (e) {
    console.error(e)
  }

  const result = yield* call(contract.approveDelegation, to, amount, {
    gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
    gasPrice: GAS_PRICE(applicationChainId),
  })

  try {
    yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
  } catch (_error) {
    try {
      yield* call(contract.callStatic.approveDelegation, to, amount)
    } catch (error) {
      yield* call(setContractError, error)
      throw Error(error)
    }
  }

  return result
}
