import React from 'react'

import { IIcon } from '@interfaces/core'

const ExplorerErrorIcon: React.FC<IIcon> = ({ fill = 'white', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="23"
      height="23"
      rx="11.5"
      fill="#A04C4C"
      fillOpacity="0.35"
    />
    <g clipPath="url(#clip0_60_145)">
      <path
        d="M17.25 7.8075L16.1925 6.75L12 10.9425L7.8075 6.75L6.75 7.8075L10.9425 12L6.75 16.1925L7.8075 17.25L12 13.0575L16.1925 17.25L17.25 16.1925L13.0575 12L17.25 7.8075Z"
        fill={fill}
        {...rest}
      />
    </g>
    <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#FF0000" />
    <defs>
      <clipPath id="clip0_60_145">
        <rect width="18" height="18" fill="white" transform="translate(3 3)" />
      </clipPath>
    </defs>
  </svg>
)

export default ExplorerErrorIcon
