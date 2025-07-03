import { BigNumber } from 'ethers'
import { CallEffect } from 'redux-saga/effects'
import { all, call, put, select } from 'typed-redux-saga'

import { HadoukenLockdrop } from '@hadouken-project/typechain'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { setContractError } from '@store/contracts/setError.saga'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { lockDropActions } from '../../lockDrop.slice'
import {
  LockdropDetails,
  LockdropPhase,
  LockdropTVL,
} from '../../lockDrop.types'
import { getLockdropTVL } from '../fetchLockdropTVL.saga'
import { getUserLocksDetails } from '../fetchUserLocks.saga'
import { initializeLockdropPhaseOne } from './initializeLockdropPhaseOne.saga'
import { initializeLockdropPhaseThree } from './initializeLockdropPhaseThree.saga'
import { initializeLockdropPhaseTwo } from './intializeLockdropPhaseTwo.saga'

export type LockdropPhaseDetails = {
  currentPhase: number
  phaseEndTime: number | undefined
  phaseOneStartTime: number
}

export function* getCurrentPhase(
  lockdropContract: HadoukenLockdrop,
): Generator<
  CallEffect<number> | CallEffect<BigNumber>,
  LockdropPhaseDetails,
  unknown
> {
  const currentPhase = yield* call(lockdropContract.callStatic.getCurrentPhase)
  const phaseOneStartTime = yield* call(lockdropContract.PHASE_ONE_START_TIME)

  let phaseEndTime: BigNumber | undefined

  switch (currentPhase) {
    case LockdropPhase.One:
      phaseEndTime = yield* call(lockdropContract.PHASE_ONE_END_TIME)
      break
    case LockdropPhase.Two:
      phaseEndTime = yield* call(lockdropContract.PHASE_TWO_END_TIME)
      break
  }

  return {
    currentPhase,
    phaseEndTime: phaseEndTime ? phaseEndTime.toNumber() : undefined,
    phaseOneStartTime: phaseOneStartTime.toNumber(),
  }
}

export function* initializeLockdrop(): Generator {
  try {
    yield* call(waitForChainToBeSet)

    const chainId = yield* select(networkSelectors.applicationChainId)

    const user = yield* select(walletSelectors.userAddress)

    const lockdropContract = yield* select(contractsSelectors.lockDropConnector)

    if (!lockdropContract) throw new Error('Lockdrop contract not found!')

    const [
      { currentPhase, phaseEndTime, phaseOneStartTime },
      { lockdrops, totalHdkTokens, totalUserHdkToClaim, totalUserValueLocked },
      lockdropTvl,
    ] = (yield* all([
      call(getCurrentPhase, lockdropContract),
      call(getUserLocksDetails, chainId, user),
      call(getLockdropTVL),
    ])) as [LockdropPhaseDetails, LockdropDetails, LockdropTVL]

    yield* call(waitForPoolsAndTokensBeFetched)

    const commonLockdropDetails = {
      currentPhase,
      phaseEndTime,
      lockDrops: lockdrops,
      lockdropTvl,
      totalUserHdkToClaim,
      totalUserValueLocked,
      totalHdkTokens,
      phaseOneStartTime,
    }

    if (currentPhase === LockdropPhase.PreludiumOne) {
      yield* put(
        lockDropActions.initializeLockdropSuccess({
          ...commonLockdropDetails,
          phaseOneStartTime,
        }),
      )
    }

    if (currentPhase === LockdropPhase.One) {
      const { phaseOne } = yield* call(initializeLockdropPhaseOne)

      yield* put(
        lockDropActions.initializeLockdropSuccess({
          phaseOne,
          ...commonLockdropDetails,
        }),
      )
    }
    if (
      currentPhase === LockdropPhase.InterludiumOne ||
      currentPhase === LockdropPhase.InterludiumTwo
    ) {
      yield* put(
        lockDropActions.initializeLockdropSuccess({
          ...commonLockdropDetails,
        }),
      )
    }

    if (currentPhase === LockdropPhase.Two) {
      const { phaseTwo } = yield* call(initializeLockdropPhaseTwo)
      yield* put(
        lockDropActions.initializeLockdropSuccess({
          phaseTwo,
          ...commonLockdropDetails,
        }),
      )
    }

    if (currentPhase === LockdropPhase.Three) {
      const { phaseThree } = yield* call(initializeLockdropPhaseThree)

      yield* put(
        lockDropActions.initializeLockdropSuccess({
          phaseThree,
          ...commonLockdropDetails,
        }),
      )
    }
  } catch (error) {
    console.log('error', error)
    yield* call(setContractError, error)

    yield* put(lockDropActions.initializeLockdropFailure())
  }
}
