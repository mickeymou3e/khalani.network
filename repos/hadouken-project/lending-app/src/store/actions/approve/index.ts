import { BigNumber } from 'ethers'
import { call, select } from 'typed-redux-saga'

import {
  GAS_LIMIT_SLIPPAGE,
  GAS_PRICE,
  GasLimits,
  WAIT_TRANSACTION_IN_BLOCKS,
} from '@constants/Godwoken'
import { ERC20 as GodwokenERC20 } from '@hadouken-project/lending-contracts/godwoken'
import { ERC20 as ZkSyncERC20 } from '@hadouken-project/lending-contracts/zksync'
import { addSlippageToValue } from '@utils/math'

import { walletSelectors } from '../../wallet/wallet.selector'

export function* approveToken(
  token: GodwokenERC20 | ZkSyncERC20,
  to: string,
  amount: BigNumber,
): Generator {
  let gasEstimation = GasLimits.Approve
  try {
    gasEstimation = yield* call(token.estimateGas.approve, to, amount)
  } catch (exc) {
    console.error(exc)
  }
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  const result = yield* call(token.approve, to, amount, {
    gasLimit: addSlippageToValue(gasEstimation, GAS_LIMIT_SLIPPAGE),
    gasPrice: GAS_PRICE(applicationChainId),
  })

  yield* call(result.wait, WAIT_TRANSACTION_IN_BLOCKS)
}
