import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { LockdropPhase } from '@store/lockDrop/lockDrop.types'
import { walletSelectors } from '@store/wallet/wallet.selector'

import {
  LockdropPhaseInterludium,
  LockdropPhaseOne,
  LockdropPhaseSkeleton,
  LockdropPhaseThree,
  LockdropPhaseTwo,
} from './Phases'
import { LockdropPhasePreludium } from './Phases/LockdropPhasePreludium.component'

const LockdropPage: React.FC = () => {
  const dispatch = useDispatch()

  const user = useSelector(walletSelectors.userAddress)
  const currentPhase = useSelector(lockdropSelectors.lockdropCurrentPhase)

  useEffect(() => {
    dispatch(lockDropActions.initializeLockdropRequest())
  }, [dispatch, user])

  return (
    <Box>
      {currentPhase === undefined && <LockdropPhaseSkeleton />}
      {currentPhase === LockdropPhase.PreludiumOne && (
        <LockdropPhasePreludium />
      )}
      {currentPhase === LockdropPhase.One && <LockdropPhaseOne />}
      {currentPhase === LockdropPhase.Two && <LockdropPhaseTwo />}
      {currentPhase === LockdropPhase.Three && <LockdropPhaseThree />}
      {(currentPhase === LockdropPhase.InterludiumOne ||
        currentPhase === LockdropPhase.InterludiumTwo) && (
        <LockdropPhaseInterludium />
      )}
    </Box>
  )
}

export default LockdropPage
