import React from 'react'

import { IIcon } from '@interfaces/core'

const StkUsdtIcon: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_0_236)">
      <mask
        id="mask0_0_236"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="40"
        height="40"
      >
        <path d="M0 0H40V39.9999H0V0Z" fill={fill} />
      </mask>
      <g mask="url(#mask0_0_236)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 0C31.0458 0 40 8.9541 40 20.0001C40 31.0451 31.0458 40.0001 20 40.0001C8.95408 40.0001 0 31.0451 0 20.0001C0 8.9541 8.95408 0 20 0Z"
          fill="url(#paint0_linear_0_236)"
        />
        <path d="M30 9H9V14.2636H16.9651V22H22.035V14.2636H30V9Z" fill={fill} />
        <path
          d="M19.5001 22.049C12.8602 22.049 7.47704 20.984 7.47704 19.6704C7.47704 18.3568 12.86 17.2919 19.5001 17.2919C26.1401 17.2919 31.523 18.3568 31.523 19.6704C31.523 20.984 26.1401 22.049 19.5001 22.049ZM33 20.067C33 18.373 26.956 17 19.5001 17C12.0445 17 6 18.373 6 20.067C6 21.5587 10.6868 22.8014 16.8973 23.0768V34H22.0058V23.0811C28.2643 22.8145 33 21.5663 33 20.067Z"
          fill={fill}
        />
      </g>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_0_236"
        x1="20"
        y1="0"
        x2="20"
        y2="40.0001"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9F1BA2" />
        <stop offset="1" stopColor="#1499FA" />
      </linearGradient>
      <clipPath id="clip0_0_236">
        <rect width="40" height="40" fill={fill} />
      </clipPath>
    </defs>
  </svg>
)

export default StkUsdtIcon
