import React from 'react'

import { IIcon } from '@interfaces/core'

const BellIcon: React.FC<IIcon> = ({ fill = '#CAF5FF', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M14.4 7.8C13.6 7.1 13 6.7 13 6V5C13 2.2 10.8 0 8 0C5.2 0 3 2.2 3 5V6C3 6.7 2.4 7.1 1.6 7.8C0.8 8.4 0 9 0 10C0 12.8 6.1 13 8 13C9.9 13 16 12.8 16 10C16 9 15.2 8.4 14.4 7.8Z"
      fill={fill}
    />
    <path
      d="M10.9 13.9C9.80001 14 8.90001 14 8.00001 14C7.10001 14 6.20001 14 5.10001 13.9C5.50001 15.1 6.60001 16 8.00001 16C9.40001 16 10.5 15.1 10.9 13.9Z"
      fill={fill}
    />
  </svg>
)

export default BellIcon
