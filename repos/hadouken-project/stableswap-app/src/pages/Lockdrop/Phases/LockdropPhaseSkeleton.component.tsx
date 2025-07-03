import React, { ReactElement } from 'react'

import { TableSkeleton } from '@hadouken-project/ui'
import { Grid, Box, Skeleton, Paper } from '@mui/material'

import { COLUMNS } from '../LocksTable/Lockdrop.table'

export const LockdropPhaseSkeleton = (): ReactElement => {
  return (
    <Box>
      <Skeleton sx={{ marginLeft: 4 }} width="400px" height="60px" />
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Paper>
            <TableSkeleton columns={COLUMNS} rowsCount={3} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Skeleton width="100%" height="80px" variant="rectangular" />
            <Skeleton
              width="100%"
              height="50px"
              variant="rectangular"
              sx={{ marginBlock: 2 }}
            />
            <Skeleton width="100%" height="120px" variant="rectangular" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Paper>
              <Skeleton width="100%" height="100px" variant="rectangular" />
              <Box mt={2}>
                <Skeleton width="100%" height="30px" variant="rectangular" />
                <Box mt={2}>
                  <Skeleton width="100%" height="50px" variant="rectangular" />
                </Box>
              </Box>
            </Paper>
          </Box>
          <Box mt={2}>
            <Paper>
              <Skeleton width="100%" height="150px" variant="rectangular" />
              <Skeleton
                width="100%"
                height="150px"
                variant="rectangular"
                sx={{ marginTop: 2 }}
              />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
