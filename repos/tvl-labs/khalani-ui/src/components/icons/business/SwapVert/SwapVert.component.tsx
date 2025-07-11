import React from 'react'

import { IIcon } from '@interfaces/core'

const SwapVertIcon: React.FC<IIcon> = ({ fill = '#ffffff', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_249_2050)">
      <path
        d="M11 1L11 12.6L9.7 11.3C9.3 10.9 8.7 10.9 8.3 11.3C8.1 11.5 8 11.7 8 12C8 12.3 8.1 12.5 8.3 12.7L11.3 15.7C11.7 16.1 12.3 16.1 12.7 15.7L15.7 12.7C16.1 12.3 16.1 11.7 15.7 11.3C15.3 10.9 14.7 10.9 14.3 11.3L13 12.6L13 1C13 0.4 12.6 -1.48619e-07 12 -1.74846e-07C11.4 -2.01072e-07 11 0.4 11 1Z"
        fill={fill}
      />
      <path
        d="M5 15L5 3.4L6.3 4.7C6.7 5.1 7.3 5.1 7.7 4.7C8.1 4.3 8.1 3.7 7.7 3.3L4.7 0.3C4.3 -0.1 3.7 -0.1 3.3 0.3L0.3 3.3C0.1 3.5 -1.61732e-07 3.7 -1.74846e-07 4C-1.87959e-07 4.3 0.1 4.5 0.3 4.7C0.7 5.1 1.3 5.1 1.7 4.7L3 3.4L3 15C3 15.6 3.4 16 4 16C4.6 16 5 15.6 5 15Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_249_2050">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(16) rotate(90)"
        />
      </clipPath>
    </defs>
  </svg>
)

export default SwapVertIcon
