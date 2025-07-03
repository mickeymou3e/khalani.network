import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const BorrowIcon: React.FC<IIcon> = ({ fill = '#CAF5FF', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 48 48"
    sx={{ fill: 'none', width: '48px', height: '48px', ...sx }}
    {...rest}
  >
    <path
      d="M12 42H8C6.896 42 6 41.104 6 40V28C6 26.896 6.896 26 8 26H12C13.104 26 14 26.896 14 28V40C14 41.104 13.104 42 12 42Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 34H30.666C31.532 34 32.374 33.72 33.066 33.2L37.898 29.576C39.104 28.672 40.792 28.792 41.858 29.858C43.042 31.042 43.042 32.96 41.858 34.142L37.712 38.288C36.596 39.404 35.172 40.166 33.624 40.476L27.764 41.648C26.602 41.88 25.404 41.852 24.254 41.564L18.954 40.24C18.32 40.08 17.67 40 17.016 40H14"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 34H28.97C30.644 34 32 32.644 32 30.97V30.364C32 28.974 31.054 27.762 29.706 27.426L25.122 26.28C24.376 26.094 23.612 26 22.844 26C20.99 26 19.176 26.548 17.634 27.578L14 30"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.334 20H38.668C40.508 20 42 18.508 42 16.666V7.334C42 5.492 40.508 4 38.666 4H21.332C19.492 4 18 5.492 18 7.334V16.668C18 18.508 19.492 20 21.334 20Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.122 9.878C33.294 11.05 33.294 12.952 32.122 14.122C30.95 15.292 29.048 15.294 27.878 14.122C26.706 12.95 26.706 11.048 27.878 9.878C29.05 8.708 30.95 8.708 32.122 9.878Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default BorrowIcon
