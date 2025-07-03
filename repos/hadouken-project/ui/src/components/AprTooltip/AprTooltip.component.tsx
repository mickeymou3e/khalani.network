import React from 'react'

import { AprIcon } from '@components/icons'
import {
  Box,
  Grid,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material'

import { AprTooltipProps } from './AprToolTip.types'
import { messages } from './AprTooltip.messages'

export const AprTooltip: React.FC<AprTooltipProps> = ({ apr }) => (
  <CustomWidthTooltip title={<AprToolTipContent apr={apr} />} placement="top">
    <Box sx={{ cursor: 'pointer' }}>
      <AprIcon />
    </Box>
  </CustomWidthTooltip>
)

const AprToolTipContent = ({ apr }: AprTooltipProps) => (
  <Grid container>
    <Grid item xs={12}>
      <Typography variant="paragraphSmall">{messages.TITLE}</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="paragraphTiny">
        {apr.swapApr.toFixed(2)}% {messages.SWAP_FEE_APR}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="paragraphTiny">
        {apr.lendingApr.toFixed(2)}% {messages.LENDING_BOOSTED_APR}
      </Typography>
    </Grid>
  </Grid>
)

export default AprTooltip

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: '205px',
  },
})
