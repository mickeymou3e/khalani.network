import { BigNumber } from 'ethers'
import { SelectEffect, CallEffect } from 'redux-saga/effects'
import { select, call } from 'typed-redux-saga'

import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { walletSelectors } from '@store/wallet/wallet.selector'

export function* fetchUserLockdropLpTokens(): Generator<
  SelectEffect | CallEffect<BigNumber>,
  {
    totalUserLpTokensAvailableToClaim: BigNumber
    userLpClaimed: BigNumber
    currentAvailableLpTokens: BigNumber
  },
  unknown
> {
  const lockdropContract = yield* select(contractsSelectors.lockDropConnector)
  const userAddress = yield* select(walletSelectors.userAddress)

  if (!lockdropContract) throw new Error('Lockdrop not defined')
  if (!userAddress) throw new Error('User not defined')

  const totalUserLpTokensAvailableToClaim = yield* call(
    lockdropContract.callStatic.getUserTotalLP,
    userAddress,
  )

  const userLpClaimed = yield* call(
    lockdropContract.totalLPWithdrawn,
    userAddress,
  )

  const currentAvailableLpTokens = yield* call(
    lockdropContract.getUserAvaibleToWithdrawLP,
    userAddress,
  )

  return {
    totalUserLpTokensAvailableToClaim,
    userLpClaimed,
    currentAvailableLpTokens,
  }
}
