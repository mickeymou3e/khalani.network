import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const ArrowDownIcon: React.FC<IIcon> = ({ fill = '#FFFFFF', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 24 24"
    sx={{ fill: 'none', height: '24px', width: '24px', ...sx }}
    {...rest}
  >
    <path
      d="M21 7.5L12 16.5L3 7.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default ArrowDownIcon
