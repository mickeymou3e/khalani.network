import React from 'react'

import { IIcon } from '@interfaces/core'

const ArrowDownIcon: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...rest}
  >
    <path
      d="M21 7.5L12 16.5L3 7.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ArrowDownIcon
