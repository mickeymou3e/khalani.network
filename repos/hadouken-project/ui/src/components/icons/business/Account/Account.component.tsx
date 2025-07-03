import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const AccountIcon: React.FC<IIcon> = ({ fill = 'white', sx, ...rest }) => (
  <SvgIcon
    sx={{ width: '48px', height: '48px', fill: 'none', ...sx }}
    viewBox="0 0 48 48"
    {...rest}
  >
    <path
      d="M32 42H36C37.5913 42 39.1174 41.3679 40.2426 40.2426C41.3679 39.1174 42 37.5913 42 36V32"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 6H36C37.5913 6 39.1174 6.63214 40.2426 7.75736C41.3679 8.88258 42 10.4087 42 12V16"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 32V36C6 37.5913 6.63214 39.1174 7.75736 40.2426C8.88258 41.3679 10.4087 42 12 42H16"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 16V12C6 10.4087 6.63214 8.88258 7.75736 7.75736C8.88258 6.63214 10.4087 6 12 6H16"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 33C34 31.6739 33.4732 30.4021 32.5355 29.4645C31.5979 28.5268 30.3261 28 29 28H19C17.6739 28 16.4021 28.5268 15.4645 29.4645C14.5268 30.4021 14 31.6739 14 33"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 23C26.7614 23 29 20.7614 29 18C29 15.2386 26.7614 13 24 13C21.2386 13 19 15.2386 19 18C19 20.7614 21.2386 23 24 23Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default AccountIcon
