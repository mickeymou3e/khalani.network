import React from 'react'

import { IIcon } from '@interfaces/core'

const ArrowDownIcon: React.FC<IIcon> = ({ fill = '#000000', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M16.293 8.05029L12 12.3433L7.70697 8.05029L6.29297 9.46429L12 15.1713L17.707 9.46429L16.293 8.05029Z"
      fill={fill}
    />
  </svg>
)

export default ArrowDownIcon
