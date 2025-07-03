import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const ArrowLeftIcon: React.FC<IIcon> = ({ fill = '#79D2FF', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{ fill: 'none', width: '16px', height: '16px', ...sx }}
    {...rest}
  >
    <path
      d="M2 8.001C2 8.327 2.159 8.633 2.427 8.82L12.427 15.82C12.732 16.034 13.131 16.058 13.462 15.888C13.793 15.715 14 15.374 14 15.001L14 0.999C14 0.626 13.793 0.285 13.462 0.112C13.131 -0.0580003 12.732 -0.0340003 12.427 0.18L2.427 7.18C2.159 7.367 2 7.673 2 7.999C2 8 2 8 2 8.001C2 8 2 8 2 8.001Z"
      fill={fill}
    />
  </SvgIcon>
)

export default ArrowLeftIcon
