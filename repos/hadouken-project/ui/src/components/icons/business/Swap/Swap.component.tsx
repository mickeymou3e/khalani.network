import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const SwapIcon: React.FC<IIcon> = ({ fill = '#93B9C3', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{ fill, width: '16px', height: '16px', ...sx }}
    {...rest}
  >
    <path
      d="M4.5 14.5L1.5 11.5L4.5 8.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 11.5H1.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 7.5L14.5 4.5L11.5 1.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 4.5H14.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default SwapIcon
