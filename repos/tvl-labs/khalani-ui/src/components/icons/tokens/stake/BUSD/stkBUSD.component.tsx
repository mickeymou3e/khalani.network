import React from 'react'

import { IIcon } from '@interfaces/core'

const StkBusdIcon: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M20 0C31.0467 0 40 8.95509 40 20C40 31.0467 31.0467 40 20 40C8.95509 40 0 31.0458 0 20C0 8.95509 8.95509 0 20 0Z"
      fill="url(#paint0_linear_25_583)"
    />
    <path
      d="M19.965 7L23.1772 10.2896L15.0886 18.3783L11.8763 15.166L19.965 7Z"
      fill={fill}
    />
    <path
      d="M24.8414 11.8763L28.0536 15.166L15.0886 28.131L11.8763 24.9187L24.8414 11.8763Z"
      fill={fill}
    />
    <path
      d="M10.2122 16.7529L13.4245 20.0425L10.2122 23.2547L7 20.0425L10.2122 16.7529Z"
      fill={fill}
    />
    <path
      d="M29.7178 16.7529L32.93 20.0425L19.965 33.0075L16.7528 29.7953L29.7178 16.7529Z"
      fill={fill}
    />
    <defs>
      <linearGradient
        id="paint0_linear_25_583"
        x1="20"
        y1="0"
        x2="20"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9F1BA2" />
        <stop offset="1" stopColor="#1499FA" />
      </linearGradient>
    </defs>
  </svg>
)

export default StkBusdIcon
