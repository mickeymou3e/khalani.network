import React from 'react'

import { IIcon } from '@interfaces/core'

const SwapIcon: React.FC<IIcon> = ({ fill = '#93B9C3', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M4.5 14.5L1.5 11.5L4.5 8.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 11.5H1.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 7.5L14.5 4.5L11.5 1.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 4.5H14.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SwapIcon
