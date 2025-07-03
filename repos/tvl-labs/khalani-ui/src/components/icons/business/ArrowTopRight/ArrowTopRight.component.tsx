import React from 'react'

import { IIcon } from '@interfaces/core'

const ArrowTopRightIcon: React.FC<IIcon> = ({ fill = '#CAF5FF', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M10.9697 5.03003L5 11M10.9697 5.03003L6.77898 5M10.9697 5.03003L11 9.22119"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ArrowTopRightIcon
