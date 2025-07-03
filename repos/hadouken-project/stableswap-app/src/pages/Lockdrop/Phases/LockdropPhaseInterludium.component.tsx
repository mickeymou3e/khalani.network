import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { Box, Paper, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { LockdropPhase } from '@store/lockDrop/lockDrop.types'

import { MESSAGES } from '../Lockdrop.messages'
import { LockdropClaim } from '../LockdropClaim/LockdropClaim.component'
import { LockdropLocks } from '../LocksTable/LockdropLocksTable.component'

export const LockdropPhaseInterludium = (): ReactElement => {
  const currentPhase = useSelector(lockdropSelectors.lockdropCurrentPhase)

  return (
    <Box>
      <Typography ml={2} variant="h1">
        {currentPhase === LockdropPhase.InterludiumOne
          ? MESSAGES.INTERLUDIUM_ONE
          : MESSAGES.INTERLUDIUM_TWO}
      </Typography>
      <Paper sx={{ mt: 2, mb: 2 }}>
        <Typography variant="paragraphMedium">
          {MESSAGES.INTERLUDIUM_DESCRIPTION}
        </Typography>
      </Paper>
      <Box sx={{ marginTop: 1 }}>
        <LockdropLocks />
      </Box>
      <Box width={{ xs: '100%', md: '50%' }} mt={2}>
        {currentPhase === LockdropPhase.InterludiumTwo && <LockdropClaim />}
      </Box>
    </Box>
  )
}
