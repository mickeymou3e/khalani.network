import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const SwapRight: React.FC<IIcon> = ({ fill = '#FFFFFF', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 16 17"
    sx={{ fill: 'none', width: '16px', height: '17px', ...sx }}
  >
    <path
      d="M15 8.5H1"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    />
    <path
      d="M10 3.5L15 8.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.5L15 8.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default SwapRight
