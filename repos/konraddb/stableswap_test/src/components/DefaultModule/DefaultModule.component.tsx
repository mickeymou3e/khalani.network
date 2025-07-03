import React from 'react'

import { Paragraph } from '@hadouken-project/ui'
import { Divider, Grid, Hidden, Paper } from '@mui/material'
import Box from '@mui/material/Box'

import { IDefaultModule } from './IDefaultModule.types'

const DefaultModule: React.FC<IDefaultModule> = ({
  title,
  description,
  children,
}) => {
  return (
    <Paper elevation={1}>
      <Grid container alignItems="center">
        <Grid item xs={12} md={7}>
          <Box marginRight={{ xs: 0, md: 3.5 }}>
            <Paragraph title={title ?? ''} description={description} />
          </Box>
        </Grid>

        {
          /**
           * TODO: Rewrite divider on css to prevent flickering based on runtime value useMediaQuery.
           * Divider in Grid Layout degenerate layout so should be 0 width
           */
          <Hidden smDown>
            <Divider
              flexItem
              orientation="vertical"
              style={{
                marginRight: '-1px',
                width: '1px',
              }}
            />
          </Hidden>
        }
        <Grid item xs={12} md={5}>
          <Box marginLeft={{ xs: 0, md: 3.5 }} marginTop={{ xs: 4, md: 0 }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default DefaultModule
