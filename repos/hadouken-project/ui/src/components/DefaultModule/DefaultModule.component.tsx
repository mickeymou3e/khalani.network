import React from 'react'

import Paragraph from '@components/Paragraph'
import { Box, Grid, Paper } from '@mui/material'

import { IDefaultModule } from './IDefaultModule.types'

const DefaultModule: React.FC<IDefaultModule> = ({
  title,
  description,
  children,
}) => {
  return (
    <Paper elevation={2}>
      <Grid container alignItems="center">
        <Grid item xs={12} md={7}>
          <Box marginRight={{ xs: 0, md: 3.5 }}>
            <Paragraph title={title} description={description} />
          </Box>
        </Grid>
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
