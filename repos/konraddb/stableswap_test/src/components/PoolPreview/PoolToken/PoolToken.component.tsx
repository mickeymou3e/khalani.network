import React from 'react'

import { getTokenIconComponent } from '@hadouken-project/ui'
import { Box, Skeleton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { getRepresentativeValue } from '@utils/string'

import ColorIndicator from './ColorIndicator/ColorIndicator.component'
import { IPoolTokenProps } from './PoolToken.types'

const PoolToken: React.FC<IPoolTokenProps> = ({
  symbol,
  value,
  decimals,
  percentage,
  color,
}) => {
  const Icon = symbol ? getTokenIconComponent(symbol) : null
  const tokenValue = value && getRepresentativeValue(value, decimals)

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Grid container item xs={7} spacing={1} alignItems="center" wrap="nowrap">
        <Grid item>
          <Box display="flex" alignItems="center">
            {value && Icon ? (
              <Icon />
            ) : (
              <Skeleton variant="circular" width={24} height={24} />
            )}
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" alignItems="center">
            {tokenValue ? (
              <Typography noWrap>
                <b>{`${tokenValue} ${symbol?.toUpperCase()}`}</b>
              </Typography>
            ) : (
              <Skeleton variant="rectangular" height={24} width={100} />
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container item xs={5} spacing={1} justifyContent="flex-end">
        <Grid
          item
          container
          xs={12}
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          <Grid item>
            <Box display="flex" alignItems="center">
              {percentage ? (
                <Typography noWrap>
                  <b>{`(${percentage}%)`}</b>
                </Typography>
              ) : (
                <Skeleton variant="rectangular" height={24} width={75} />
              )}
            </Box>
          </Grid>
          <Grid item>
            <Box height={24} display="flex" alignItems="center">
              {value ? (
                <ColorIndicator
                  width={16}
                  height={16}
                  color={color ?? 'inherit'}
                />
              ) : (
                <Skeleton variant="circular" width={16} height={16} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PoolToken
