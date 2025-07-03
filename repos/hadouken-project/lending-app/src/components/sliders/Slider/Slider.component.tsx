import React from 'react'

import MUISlider, { SliderProps } from '@mui/material/Slider'
import { styled } from '@mui/material/styles'

import { calculateGradientValue, scaleValue } from './Slider.utils'

const StyledSlider = styled(MUISlider)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  border: 'none',
  width: '100%',

  '& .MuiSlider-rail': {
    backgroundImage: `linear-gradient(0.25turn, ${theme.palette.quaternary?.main}, ${theme.palette.warning.light}, ${theme.palette.error.light})`,
    height: '8px',
    opacity: 1,
    borderRadius: '0px',
  },

  '& .MuiSlider-track': {
    opacity: 0,
  },

  '& .MuiSlider-thumb': {
    top: -10,
    width: '12px',
    height: '12px',
    borderRadius: '1px',
    background: 'none',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: 'none',
    boxShadow: 'none',

    '&:focus, &:hover, &.Mui-active, &::after, &.Mui-focusVisible': {
      boxShadow: 'none',
    },
  },
}))

const Slider: React.FC<SliderProps> = ({ value, max, ...rest }) => {
  return (
    <StyledSlider
      size="medium"
      value={value}
      max={max}
      {...rest}
      sx={{
        backgroundColor: 'transparent',
        '& .MuiSlider-thumb': {
          borderTop: (theme) =>
            `12px solid ${calculateGradientValue(
              scaleValue(
                !value || Array.isArray(value) ? 0 : (value as number),
                max ?? 0,
              ),
              [
                theme.palette.quaternary?.main,
                theme.palette.warning.light,
                theme.palette.error.light,
              ],
            )}`,
        },
      }}
    />
  )
}

export default Slider
