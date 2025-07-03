import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const InvestIcon: React.FC<IIcon> = ({ fill = '#35FFC2', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 9 9"
    sx={{ fill: 'none', width: '9px', height: '9px', ...sx }}
    {...rest}
  >
    <path
      d="M4.192 8.008V4.664H0.992V3.576H4.192V0.231999H5.408V3.576H8.608V4.664H5.408V8.008H4.192Z"
      fill={fill}
    />
  </SvgIcon>
)

export default InvestIcon
