import React from 'react'

import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { styled, Switch as MuiSwitch, SwitchProps } from '@mui/material'
import { alpha } from '@mui/material/styles'

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 60,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0px)',
    '&.Mui-checked': {
      transform: 'translateX(34px)',
      '& .MuiSwitch-thumb:before': {},
      '& + .MuiSwitch-track': {
        borderRadius: '24px',
        backgroundColor: 'transparent',
        opacity: 1,
      },
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 1,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
    backgroundColor: 'transparent',
    borderRadius: '24px',
    '&.Mui-disabled': {
      border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
      opacity: 1,
    },
  },
}))

const Switch: React.FC<SwitchProps> = (props) => {
  return (
    <StyledSwitch
      checkedIcon={
        <CheckCircleIcon
          sx={{
            color: (theme) =>
              props.disabled
                ? alpha(theme.palette.secondary.main, 0.3)
                : theme.palette.secondary.main,
          }}
        />
      }
      icon={
        <CancelIcon
          sx={{
            color: (theme) =>
              props.disabled
                ? alpha(theme.palette.secondary.main, 0.3)
                : theme.palette.secondary.main,
          }}
        />
      }
      {...props}
    />
  )
}
export default Switch
