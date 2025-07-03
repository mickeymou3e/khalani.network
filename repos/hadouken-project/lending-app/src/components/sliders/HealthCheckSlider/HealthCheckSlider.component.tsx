import React from 'react'

import Slider from '@components/sliders/Slider'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { IHealthCheckSlider } from './HealthCheckSlider.types'

const HealthCheckSlider: React.FC<IHealthCheckSlider> = ({
  leftLabel,
  factorLabel,
  rightLabel,
  factorValueLabel,
  min,
  value,
  onValueChange,
  ...rest
}) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onValueChange?.(newValue)
    }
  }
  return (
    <>
      <Box
        display={{ xs: 'block', xl: 'flex' }}
        textAlign="center"
        justifyContent="center"
      >
        <Typography color="textPrimary" variant="paragraphMedium">
          {factorLabel}
        </Typography>
        <Typography
          color="textSecondary"
          variant="paragraphMedium"
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            ml: { xs: 0, md: 1 },
          }}
        >
          {factorValueLabel}
        </Typography>
      </Box>

      <Grid sx={{ pt: 4 }} container>
        <Grid item xs={12}>
          <Slider value={value} onChange={handleChange} min={min} {...rest} />
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.quaternary.main}
            textAlign="left"
            sx={{
              textTransform: 'uppercase',
            }}
          >
            {leftLabel}
          </Typography>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            textAlign: 'end',
          }}
        >
          <Typography
            variant="paragraphTiny"
            textAlign="end"
            color={(theme) => theme.palette.error.main}
            sx={{
              textTransform: 'uppercase',
            }}
          >
            {rightLabel}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}

export default HealthCheckSlider
