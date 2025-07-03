import { call, put, select } from 'typed-redux-saga'

import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { networkSelectors } from '@store/network/network.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { getLockdropTVL } from './fetchLockdropTVL.saga'
import { getUserLocksDetails } from './fetchUserLocks.saga'

export function* updateLockdrop(): Generator {
  try {
    const applicationChainId = yield* select(
      networkSelectors.applicationChainId,
    )
    const userAddress = yield* select(walletSelectors.userAddress)

    if (!userAddress) throw new Error('User not found')

    const lockdropDetails = yield* call(
      getUserLocksDetails,
      applicationChainId,
      userAddress,
    )

    const lockdropTvl = yield* call(getLockdropTVL)

    yield* put(
      lockDropActions.updateLockdropDataSuccess({
        lockdropDetails,
        lockdropTvl,
      }),
    )
  } catch (e) {
    yield* put(lockDropActions.updateLockdropDataFailure())
  }
}
