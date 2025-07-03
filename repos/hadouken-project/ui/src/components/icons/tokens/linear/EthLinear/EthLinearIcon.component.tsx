import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

export const EthLinearIcon: React.FC<IIcon> = ({
  fill = '#FFFFFF',
  style,
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 40 40"
    sx={{ fill: 'none', width: '24px', height: '24px', ...sx }}
    style={style}
    {...rest}
  >
    <g clipPath="url(#clip0_24_47)">
      <g filter="url(#filter0_i_24_47)">
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_24_47)" />
      </g>
      <mask
        id="mask0_24_47"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="40"
        height="40"
      >
        <path d="M40 0H0V40H40V0Z" fill={fill} />
      </mask>
      <g mask="url(#mask0_24_47)">
        <path
          d="M17.5082 0C14.4644 0.383701 11.5492 1.46521 8.98834 3.16085C6.42744 4.8565 4.28941 7.12083 2.73966 9.77869C1.18991 12.4365 0.269972 15.4167 0.0510118 18.4885C-0.167949 21.5604 0.319938 24.6417 1.47693 27.494L3.33525 26.7343C2.29434 24.1681 1.8554 21.396 2.05239 18.6323C2.24938 15.8686 3.07703 13.1875 4.4713 10.7963C5.86558 8.40507 7.7891 6.3679 10.0931 4.84237C12.3971 3.31684 15.0197 2.34384 17.7582 1.99863L17.5082 0Z"
          fill={fill}
        />
        <path
          d="M38.4313 27.7163C39.6222 24.8781 40.1468 21.8029 39.9645 18.7286C39.7822 15.6543 38.8978 12.6634 37.3799 9.98706C35.8619 7.31077 33.7511 5.0209 31.2106 3.2946C28.6701 1.5683 25.7681 0.45184 22.729 0.0315857L22.4552 2.02706C25.1894 2.40516 27.8002 3.40961 30.0859 4.96272C32.3715 6.51583 34.2706 8.57597 35.6362 10.9838C37.0019 13.3916 37.7975 16.0825 37.9615 18.8483C38.1256 21.6142 37.6536 24.3808 36.5821 26.9343L38.4313 27.7163Z"
          fill={fill}
        />
        <path
          d="M4.06009 32.0491C5.91302 34.5036 8.30355 36.4973 11.0468 37.8759C13.79 39.2546 16.8123 39.9812 19.88 39.9996C22.9477 40.0181 25.9785 39.3278 28.738 37.9822C31.4975 36.6367 33.9116 34.6719 35.7937 32.2398L34.2091 31.004C32.5159 33.1921 30.344 34.9598 27.8613 36.1703C25.3787 37.3809 22.652 38.0019 19.892 37.9854C17.1321 37.9688 14.413 37.315 11.945 36.0747C9.47697 34.8344 7.32626 33.0407 5.65923 30.8325L4.06009 32.0491Z"
          fill={fill}
        />
        <path
          d="M19.9454 8L19.7863 8.54043V24.221L19.9454 24.3797L27.224 20.0773L19.9454 8Z"
          fill={fill}
        />
        <path
          d="M19.9453 8L12.6665 20.0773L19.9453 24.3797V16.7688V8Z"
          fill={fill}
        />
        <path
          d="M19.9455 25.7577L19.8558 25.8671V31.4527L19.9455 31.7145L27.2285 21.4575L19.9455 25.7577Z"
          fill={fill}
        />
        <path
          d="M19.9455 31.7145V25.7577L12.6667 21.4575L19.9455 31.7145Z"
          fill={fill}
        />
        <path
          d="M19.9455 24.3798L27.2241 20.0774L19.9455 16.7689V24.3798Z"
          fill={fill}
        />
        <path
          d="M12.6667 20.0774L19.9455 24.3798V16.7689L12.6667 20.0774Z"
          fill={fill}
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_i_24_47"
        x="0"
        y="0"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect1_innerShadow_24_47"
        />
        <feOffset />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0823529 0 0 0 0 0.109804 0 0 0 0 0.321569 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_47" />
      </filter>
      <linearGradient
        id="paint0_linear_24_47"
        x1="20"
        y1="0"
        x2="20"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0260417" stopColor="#0B0A09" />
        <stop offset="0.4375" stopColor="#F74141" />
        <stop offset="0.692708" stopColor="#3455A9" />
        <stop offset="1" stopColor="#22285A" />
      </linearGradient>
      <clipPath id="clip0_24_47">
        <rect width="40" height="40" fill={fill} />
      </clipPath>
    </defs>
  </SvgIcon>
)
