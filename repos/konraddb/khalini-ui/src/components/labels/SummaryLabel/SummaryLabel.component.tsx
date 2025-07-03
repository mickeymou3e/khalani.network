import React from 'react'

import { Grid, Typography } from '@mui/material'

import { ISummaryLabelProps } from './SummaryLabel.types'

const SummaryLabel: React.FC<ISummaryLabelProps> = ({
  label,
  value,
  showTopBorder = false,
}) => (
  <Grid
    container
    borderTop={(theme) =>
      showTopBorder
        ? `1px solid ${theme.palette.background.backgroundBorder}`
        : 'none'
    }
    borderBottom={(theme) =>
      `1px solid ${theme.palette.background.backgroundBorder}`
    }
  >
    <Grid
      display="flex"
      alignItems="center"
      item
      xs={8}
      p={'13.5px 16px'}
      borderRight={(theme) =>
        `1px solid ${theme.palette.background.backgroundBorder}`
      }
    >
      <Typography textAlign="left" variant="paragraphSmall">
        {label}
      </Typography>
    </Grid>
    <Grid
      display="flex"
      justifyContent="end"
      alignItems="center"
      item
      xs={4}
      p={'13.5px 16px'}
    >
      {typeof value === 'string' ? (
        <Typography textAlign="right" variant="paragraphSmall">
          {value}
        </Typography>
      ) : (
        value
      )}
    </Grid>
  </Grid>
)

export default SummaryLabel
