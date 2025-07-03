import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const HyperlinkIcon: React.FC<IIcon> = ({ fill = '#CAF5FF', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{ fill: 'none', width: '16px', height: '16px', ...sx }}
    {...rest}
  >
    <path
      d="M11 3H10C9.4 3 9 3.4 9 4C9 4.6 9.4 5 10 5H11C12.7 5 14 6.3 14 8C14 9.7 12.7 11 11 11H10C9.4 11 9 11.4 9 12C9 12.6 9.4 13 10 13H11C13.8 13 16 10.8 16 8C16 5.2 13.8 3 11 3Z"
      fill={fill}
    />
    <path
      d="M6 11H5C3.3 11 2 9.7 2 8C2 6.3 3.3 5 5 5H6C6.6 5 7 4.6 7 4C7 3.4 6.6 3 6 3H5C2.2 3 0 5.2 0 8C0 10.8 2.2 13 5 13H6C6.6 13 7 12.6 7 12C7 11.4 6.6 11 6 11Z"
      fill={fill}
    />
    <path
      d="M4 8C4 8.6 4.4 9 5 9H11C11.6 9 12 8.6 12 8C12 7.4 11.6 7 11 7H5C4.4 7 4 7.4 4 8Z"
      fill={fill}
    />
  </SvgIcon>
)

export default HyperlinkIcon
