import React from 'react'

import { IIcon } from '@interfaces/core'

const SwapRight: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    {...rest}
  >
    <g clipPath="url(#clip0_1081_2311)">
      <path
        d="M12.5 4L11.09 5.41L16.67 11H4.5V13H16.67L11.09 18.59L12.5 20L20.5 12L12.5 4Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_1081_2311">
        <rect width="24" height="24" fill={fill} transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
)

export default SwapRight
