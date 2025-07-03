import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { CONFIRMATIONS, NetworkOverrides } from '@constants/Networks'
import { ContractTransaction } from '@ethersproject/contracts'
import { ERC20 } from '@hadouken-project/swap-contracts-v2'
import { BigDecimal } from '@utils/math'

export function* approveToken(
  token: ERC20,
  to: string,
  amount: BigDecimal,
): Generator<StrictEffect, ContractTransaction> {
  const result = yield* call(
    token.approve,
    to,
    amount.toBigNumber(),
    NetworkOverrides.TxParams,
  )

  yield* call(result.wait, CONFIRMATIONS)
  return result
}
