import React from 'react'

import { Box, Grid, Paper, styled } from '@mui/material'
import { Typography } from '@tvl-labs/khalani-ui'

export const PropertyLabel = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
`

export const SuccessStatusBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
  background: rgba(0, 255, 149, 0.2);
  border: 1px solid #00ff95;
  border-radius: 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
`

export const ErrorStatusBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid #ff0000;
  border-radius: 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
`

export const PendingStatusInnerBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
`

export const PendingStatusBox: React.FC = (props) => (
  <Paper
    sx={{
      p: '10px',
      maxWidth: '300px',
      marginLeft: 'auto',
    }}
    elevation={2}
  >
    <Grid container direction="row" alignItems="center" gap={1}>
      {props.children}
    </Grid>
  </Paper>
)
