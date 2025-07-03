import { all, takeLatest } from 'typed-redux-saga'

import { lockDropActions } from './lockDrop.slice'
import { initializeLockdrop } from './saga/initialization/initializeLockdrop'
import {
  phaseOneCalculateEstimatedReward,
  phaseOneLockAmountChange,
  phaseOneLockDurationChange,
  phaseOneLockRequest,
} from './saga/phaseOne'
import {
  phaseThreeClaimLpTokensRequest,
  phaseThreeUnlockRequest,
} from './saga/phaseThree'
import { phaseTwoClaimRequest, phaseTwoDepositRequest } from './saga/phaseTwo'
import { updateLockDropTimer } from './saga/updateLockDropTimer.saga'
import { updateLockdrop } from './saga/updateLockdrop.saga'
import { updateLockdropDepositTokensBalances } from './saga/updateLockdropDepositBalances.saga'
import { updateLockdropUserClaimedLpTokens } from './saga/updateLockdropUserClaimedLpTokens.saga'

export function* lockDropMasterSaga(): Generator {
  yield all([
    // Init
    takeLatest(
      lockDropActions.initializeLockdropRequest.type,
      initializeLockdrop,
    ),

    // Phase 1
    takeLatest(
      lockDropActions.phaseOneLockAmountChangeRequest.type,
      phaseOneLockAmountChange,
    ),
    takeLatest(
      lockDropActions.phaseOneLockDurationChangeRequest.type,
      phaseOneLockDurationChange,
    ),
    takeLatest(lockDropActions.phaseOneLockRequest.type, phaseOneLockRequest),
    takeLatest(
      lockDropActions.phaseOneCalculateEstimatedRewardRequest.type,
      phaseOneCalculateEstimatedReward,
    ),

    // Phase 2
    takeLatest(
      lockDropActions.phaseTwoDepositRequest.type,
      phaseTwoDepositRequest,
    ),

    // Phase 3
    takeLatest(
      lockDropActions.phaseThreeUnlockRequest.type,
      phaseThreeUnlockRequest,
    ),
    takeLatest(
      lockDropActions.phaseThreeClaimLpTokensRequest.type,
      phaseThreeClaimLpTokensRequest,
    ),

    // Common
    takeLatest(lockDropActions.claimHDKRequest.type, phaseTwoClaimRequest),

    // Updates
    takeLatest(
      lockDropActions.updateLockdropUserClaimedLpTokensRequest.type,
      updateLockdropUserClaimedLpTokens,
    ),
    takeLatest(lockDropActions.updateTimerRequest.type, updateLockDropTimer),
    takeLatest(lockDropActions.updateLockdropDataRequests.type, updateLockdrop),
    takeLatest(
      lockDropActions.updateLockdropDepositTokensBalancesRequest.type,
      updateLockdropDepositTokensBalances,
    ),
  ])
}
