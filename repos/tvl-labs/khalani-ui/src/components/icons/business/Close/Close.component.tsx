import React from 'react'

import { IIcon } from '@interfaces/core'

const CloseIcon: React.FC<IIcon> = ({ fill = '#000000', ...rest }) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_120_341)">
      <path
        d="M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_120_341">
        <rect width="24" height="24" fill={fill} transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
)

export default CloseIcon
