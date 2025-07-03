import React from 'react'

import { Box, Typography, Slider as MUISlider } from '@mui/material'

import { ISliderProps } from '.'

const Slider: React.FC<ISliderProps> = ({ title, value, setValue }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="paragraphTiny">{title}</Typography>
        <Typography variant="paragraphTiny">{`${value}%`}</Typography>
      </Box>
      <MUISlider value={value} onChange={setValue} />
    </Box>
  )
}
export default Slider
