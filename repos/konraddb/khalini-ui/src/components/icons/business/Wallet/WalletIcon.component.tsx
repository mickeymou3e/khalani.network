import React from 'react'

import { IIcon } from '@interfaces/core'

const WalletIcon: React.FC<IIcon> = ({ fill = 'white', ...rest }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M42 19V13C42 11.6739 41.4732 10.4021 40.5355 9.46447C39.5979 8.52678 38.3261 8 37 8H11C9.67392 8 8.40215 8.52678 7.46447 9.46447C6.52678 10.4021 6 11.6739 6 13V20"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M42 29V35C42 36.3261 41.4732 37.5979 40.5355 38.5355C39.5979 39.4732 38.3261 40 37 40H22"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 40V28"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1207 26V28"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1207 40V42"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 34H13C13.7956 34 14.5587 34.3161 15.1213 34.8787C15.6839 35.4413 16 36.2044 16 37C16 37.7956 15.6839 38.5587 15.1213 39.1213C14.5587 39.6839 13.7956 40 13 40H6V34Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 28H12.3C13.0956 28 13.8587 28.3161 14.4213 28.8787C14.9839 29.4413 15.3 30.2044 15.3 31V31C15.3 31.7956 14.9839 32.5587 14.4213 33.1213C13.8587 33.6839 13.0956 34 12.3 34H6V28Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M37 19H42C42.5304 19 43.0391 19.2107 43.4142 19.5858C43.7893 19.9609 44 20.4696 44 21V27C44 27.5304 43.7893 28.0391 43.4142 28.4142C43.0391 28.7893 42.5304 29 42 29H37C35.6739 29 34.4021 28.4732 33.4645 27.5355C32.5268 26.5979 32 25.3261 32 24V24C32 22.6739 32.5268 21.4021 33.4645 20.4645C34.4021 19.5268 35.6739 19 37 19V19Z"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 18H26"
      stroke={fill}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default WalletIcon
