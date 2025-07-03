import React, { ReactElement } from 'react'

import { Box, Grid, Typography } from '@mui/material'

import { MESSAGES } from '../Lockdrop.messages'
import { LockdropClaim } from '../LockdropClaim/LockdropClaim.component'
import { LockdropLocks } from '../LocksTable/LockdropLocksTable.component'
import { LpVesting } from '../LpVesting/LpVesting.component'

export const LockdropPhaseThree = (): ReactElement => {
  return (
    <Box>
      <Box pl={3}>
        <Typography variant="h1">{MESSAGES.TITLE} 3</Typography>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <LockdropLocks />
        </Grid>
        <Grid item xs={12} md={6}>
          <LockdropClaim />
        </Grid>
        <Grid item xs={12} md={6}>
          <LpVesting />
        </Grid>
      </Grid>
    </Box>
  )
}
