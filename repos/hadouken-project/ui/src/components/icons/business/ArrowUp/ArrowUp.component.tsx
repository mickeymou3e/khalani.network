import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const ArrowUpIcon: React.FC<IIcon> = ({ fill = '#79D2FF', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{ fill: 'none', width: '16px', height: '16px', ...sx }}
    {...rest}
  >
    <path
      d="M8.00101 2C8.32701 2 8.633 2.159 8.82 2.427L15.82 12.427C16.034 12.732 16.058 13.131 15.888 13.462C15.715 13.793 15.374 14 15.001 14H0.999005C0.626005 14 0.285004 13.793 0.112005 13.462C-0.0579955 13.131 -0.0339955 12.732 0.180005 12.427L7.18 2.427C7.367 2.159 7.673 2 7.999 2C8 2 8 2 8.00101 2C8 2 8 2 8.00101 2Z"
      fill={fill}
    />
  </SvgIcon>
)

export default ArrowUpIcon
