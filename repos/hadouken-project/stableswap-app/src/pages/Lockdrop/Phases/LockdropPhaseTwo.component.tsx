import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { Box, Grid, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'

import { LockdropDeposit } from '../Deposit'
import { LockdropDepositBalance } from '../Deposit/LockdropDepositBalance.component'
import { MESSAGES } from '../Lockdrop.messages'
import { LockdropClaim } from '../LockdropClaim/LockdropClaim.component'
import { LockdropLocks } from '../LocksTable/LockdropLocksTable.component'
import { ParticipationRate } from '../ParticipationRate'
import { LockDropTimer } from '../Timer/LockdropTimer.component'

export const LockdropPhaseTwo = (): ReactElement => {
  const currentPhaseEndTime = useSelector(
    lockdropSelectors.lockdropPhaseEndTime,
  )

  return (
    <Box>
      <Box pl={3}>
        <Typography variant="h1">{MESSAGES.TITLE} 2</Typography>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <LockdropLocks />
        </Grid>
        <Grid item xs={12} md={6}>
          <LockdropClaim />
          <LockdropDeposit />
          <LockdropDepositBalance />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>{currentPhaseEndTime && <LockDropTimer />}</Box>
          <Box mt={2}>
            <ParticipationRate />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
