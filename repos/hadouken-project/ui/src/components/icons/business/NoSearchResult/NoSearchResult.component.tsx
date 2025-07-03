import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const NoSearchResultIcon: React.FC<IIcon> = ({
  fill = 'white',
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 48 48"
    sx={{ fill: 'none', width: '48px', height: '48px', ...sx }}
    {...rest}
  >
    <path
      d="M32 20C36.4183 20 40 16.4183 40 12C40 7.58172 36.4183 4 32 4C27.5817 4 24 7.58172 24 12C24 16.4183 27.5817 20 32 20Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M42 22L37.656 17.656"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 8H12C10.4087 8 8.88258 8.63214 7.75736 9.75736C6.63214 10.8826 6 12.4087 6 14V36C6 37.5913 6.63214 39.1174 7.75736 40.2426C8.88258 41.3679 10.4087 42 12 42H36C37.5913 42 39.1174 41.3679 40.2426 40.2426C41.3679 39.1174 42 37.5913 42 36V30"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 18H18"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 26H14"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 26H30"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 34H24"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 34H14"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default NoSearchResultIcon
