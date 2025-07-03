import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const NetworkIcon: React.FC<IIcon> = ({ fill = 'white', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 48 48"
    sx={{ fill: 'none', width: '48px', height: '48px', ...sx }}
    {...rest}
  >
    <path
      d="M28.908 34.182H39.09C41.802 34.182 44 36.38 44 39.092C43.998 41.802 41.8 44 39.088 44H28.906C26.196 44 23.998 41.802 23.998 39.09C23.998 36.38 26.196 34.182 28.908 34.182Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.014 38.694L24.712 29.692C24.874 27.608 26.612 26 28.702 26H39.296C41.386 26 43.122 27.608 43.284 29.69L43.982 38.692"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.092 12.182H8.91C6.198 12.182 4 14.38 4 17.092C4.002 19.802 6.2 22 8.912 22H19.094C21.804 22 24.002 19.802 24.002 17.09C24.002 14.38 21.804 12.182 19.092 12.182Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.986 16.694L23.288 7.692C23.126 5.608 21.388 4 19.298 4H8.70401C6.61401 4 4.87801 5.608 4.71601 7.69L4.01801 16.692"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 35L8 32L11 35"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 32V36C8 39.314 10.686 42 14 42"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M43 13L40 16L37 13"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40 16V12C40 8.686 37.314 6 34 6"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="17" r="1" fill={fill} />
    <circle cx="39" cy="39" r="1" fill={fill} />
  </SvgIcon>
)

export default NetworkIcon
