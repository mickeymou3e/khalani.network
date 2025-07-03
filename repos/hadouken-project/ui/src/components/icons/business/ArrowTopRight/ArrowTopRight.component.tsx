import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const ArrowTopRightIcon: React.FC<IIcon> = ({
  fill = '#CAF5FF',
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{ fill: 'none', width: '16px', height: '16px', ...sx }}
    {...rest}
  >
    <path
      d="M10.9697 5.03003L5 11M10.9697 5.03003L6.77898 5M10.9697 5.03003L11 9.22119"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default ArrowTopRightIcon
