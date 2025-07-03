import React from 'react'
import { useSelector } from 'react-redux'

import { Box, Grid, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'

import { LockDropHowItWorks } from '../HowItWorks/LockDropHowItWorks.component'
import { LockdropLockAsset } from '../LockAsset/LockdropLockAsset.component'
import { MESSAGES } from '../Lockdrop.messages'
import { LockdropLocks } from '../LocksTable/LockdropLocksTable.component'
import { LockDropTimer } from '../Timer/LockdropTimer.component'

export const LockdropPhaseOne: React.FC = () => {
  const currentPhaseEndTime = useSelector(
    lockdropSelectors.lockdropPhaseEndTime,
  )

  return (
    <Box>
      <Box pl={3}>
        <Typography variant="h1">{MESSAGES.TITLE} 1</Typography>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <LockdropLocks />
        </Grid>
        <Grid item xs={12} md={6}>
          <LockdropLockAsset />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>{currentPhaseEndTime && <LockDropTimer />}</Box>
          <Box mt={2}>
            <LockDropHowItWorks />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
