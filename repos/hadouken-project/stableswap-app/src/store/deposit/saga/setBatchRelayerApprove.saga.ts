import { call } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { ContractTransaction } from '@ethersproject/contracts'
import { Vault } from '@hadouken-project/typechain'
import { StrictEffect } from '@redux-saga/types'

export function* setBatchRelayerApproveSaga(
  vault: Vault,
  userAddress: string,
  batchRelayerAddress: string,
  approve: boolean,
): Generator<StrictEffect, ContractTransaction> {
  const result = yield* call(
    vault.setRelayerApproval,
    userAddress,
    batchRelayerAddress,
    approve,
  )
  yield* call(result.wait, CONFIRMATIONS)

  return result
}
