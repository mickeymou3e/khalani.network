import React from 'react'

import { IIcon } from '@interfaces/core'

const ArrowUpIcon: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M7.28995 3.29L4.69995 0.7C4.30995 0.31 3.67995 0.31 3.28995 0.699999L0.699948 3.29C0.0699483 3.92 0.519948 5 1.40995 5L6.58995 5C7.47995 5 7.91995 3.92 7.28995 3.29Z"
      fill={fill}
    />
  </svg>
)

export default ArrowUpIcon
