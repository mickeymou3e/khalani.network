import React from 'react'

import {
  FormControlLabel,
  Radio as MUIRadio,
  styled,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import { IRadioButtonProps } from './RadioButton.types'

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 24,
  height: 24,
  boxShadow: `0 0 0 1px ${alpha(theme.palette.secondary.main, 0.7)}`,
  'input:hover ~ &': {
    boxShadow: `0 0 0 1px ${theme.palette.secondary.main}`,
  },
  'input:disabled ~ &': {
    boxShadow: `0 0 0 1px ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
}))

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  '&:before': {
    display: 'block',
    borderRadius: '50%',
    width: 24,
    height: 24,

    backgroundImage: `radial-gradient(${theme.palette.secondary.main},${theme.palette.secondary.main} 50%,transparent 55%)`,
    content: '""',
    'input:disabled ~ &': {
      opacity: 0.3,
    },
  },
}))

const RadioButton: React.FC<IRadioButtonProps> = ({
  label,
  value,
  disabled,
  sx,
  checked,
  onClick,
}) => (
  <FormControlLabel
    sx={{
      marginLeft: 1.5,
      marginRight: 2,
      ...sx,
    }}
    value={value}
    control={
      <MUIRadio
        sx={{
          '&:hover': {
            bgcolor: 'transparent',
          },
          padding: (theme) => `0 ${theme.spacing(1)} 0 0`,
        }}
        checked={checked}
        disableRipple
        onClick={onClick}
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        disabled={disabled}
      />
    }
    label={
      <Typography
        variant="paragraphTiny"
        color={(theme) =>
          disabled
            ? alpha(theme.palette.text.darkGray, 0.3)
            : theme.palette.text.primary
        }
      >
        {label}
      </Typography>
    }
  />
)

export default RadioButton
