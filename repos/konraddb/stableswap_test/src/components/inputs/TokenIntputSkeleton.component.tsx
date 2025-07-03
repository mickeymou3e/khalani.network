import React from 'react'

import { Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'

const TokenInputSkeleton: React.FC = () => (
  <Grid container>
    <Grid item xs={12}>
      <Hidden mdUp>
        <Grid container>
          <Grid
            item
            container
            xs={8}
            direction="row-reverse"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end" marginX={1}>
                <Skeleton variant="text" width="100%" height="100%" />
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="text"
              size="small"
              color="primary"
              disabled
            />
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
    <Grid item xs={12}>
      <Box
        display="flex"
        width="100%"
        height={56}
        padding={0.5}
        sx={{
          border: (theme) => `1px solid ${theme.palette.primary.light}`,
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    </Grid>
  </Grid>
)

export default TokenInputSkeleton
