import React from 'react'

import { IIcon } from '@interfaces/core'

const KaiIcon: React.FC<IIcon> = ({ fill = '#ffffff', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 86 86"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M0 43C0 19.2518 19.2518 0 43 0C66.7482 0 86 19.2518 86 43C86 66.7482 66.7482 86 43 86C19.2518 86 0 66.7482 0 43Z"
      fill="url(#paint0_linear_713_168)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 43C5 63.9868 22.0132 81 43 81C63.9868 81 81 63.9868 81 43C81 22.0132 63.9868 5 43 5C22.0132 5 5 22.0132 5 43ZM43 0C19.2518 0 0 19.2518 0 43C0 66.7482 19.2518 86 43 86C66.7482 86 86 66.7482 86 43C86 19.2518 66.7482 0 43 0Z"
      fill="url(#paint1_linear_713_168)"
    />
    <path
      d="M27.625 49V63.0002H38.6818V52.5002L41.3653 49H27.625Z"
      fill={fill}
    />
    <path
      d="M27.625 45H53.4747L50.6136 40.4093L50.9242 40H27.625V45Z"
      fill={fill}
    />
    <path d="M27.625 36H38.6818V22.2729H27.625V36Z" fill={fill} />
    <path
      d="M41.2762 36H53.9593L64.375 22.2729H51.4886L41.2762 36Z"
      fill={fill}
    />
    <path
      d="M55.9677 49H43.1031L51.4886 63.0002H64.6932L55.9677 49Z"
      fill={fill}
    />
    <defs>
      <linearGradient
        id="paint0_linear_713_168"
        x1="50.5"
        y1="62"
        x2="50.5"
        y2="3"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#000F2D" />
        <stop offset="1" stopColor="#004CA6" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_713_168"
        x1="43"
        y1="0"
        x2="43"
        y2="86"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4192F7" />
        <stop offset="1" stopColor="#4192F7" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)

export default KaiIcon
