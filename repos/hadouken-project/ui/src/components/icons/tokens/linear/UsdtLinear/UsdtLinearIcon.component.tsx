import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

export const UsdtLinearIcon: React.FC<IIcon> = ({
  fill = '#FFFFFF',
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 40 40"
    sx={{ fill: 'none', width: '24px', height: '24px', ...sx }}
    {...rest}
  >
    <g clipPath="url(#clip0_117_277)">
      <g filter="url(#filter0_i_117_277)">
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_117_277)" />
      </g>
      <path
        d="M17.5082 0C14.4644 0.383701 11.5492 1.46521 8.98834 3.16085C6.42744 4.8565 4.28941 7.12083 2.73966 9.77869C1.18991 12.4365 0.269972 15.4167 0.0510117 18.4885C-0.167949 21.5604 0.319938 24.6417 1.47693 27.494L3.33525 26.7343C2.29434 24.1681 1.8554 21.396 2.05239 18.6323C2.24938 15.8686 3.07703 13.1875 4.4713 10.7963C5.86558 8.40507 7.7891 6.3679 10.0931 4.84237C12.3971 3.31684 15.0197 2.34384 17.7582 1.99863L17.5082 0Z"
        fill={fill}
      />
      <path
        d="M38.4313 27.7163C39.6222 24.8781 40.1468 21.8029 39.9645 18.7286C39.7822 15.6543 38.8978 12.6634 37.3799 9.98707C35.8619 7.31078 33.7511 5.02091 31.2106 3.29461C28.6701 1.56831 25.7681 0.451846 22.729 0.0315916L22.4552 2.02707C25.1894 2.40517 27.8002 3.40962 30.0859 4.96273C32.3715 6.51584 34.2706 8.57598 35.6362 10.9838C37.0019 13.3916 37.7975 16.0825 37.9615 18.8483C38.1256 21.6142 37.6536 24.3808 36.5821 26.9343L38.4313 27.7163Z"
        fill={fill}
      />
      <path
        d="M4.06009 32.0491C5.91302 34.5036 8.30355 36.4973 11.0468 37.8759C13.79 39.2546 16.8123 39.9812 19.88 39.9996C22.9477 40.0181 25.9785 39.3278 28.738 37.9822C31.4975 36.6367 33.9116 34.6719 35.7937 32.2398L34.2091 31.004C32.5159 33.1921 30.344 34.9598 27.8613 36.1703C25.3787 37.3809 22.652 38.0019 19.892 37.9854C17.1321 37.9688 14.413 37.315 11.945 36.0747C9.47697 34.8344 7.32626 33.0407 5.65923 30.8325L4.06009 32.0491Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.0355 22.0978V22.0978C21.9218 22.1063 21.3348 22.1414 20.0252 22.1414C18.9836 22.1414 18.2441 22.1101 17.9846 22.0978V22.0978C13.9594 21.9208 10.9549 21.2201 10.9549 20.3813C10.9549 19.5424 13.9594 18.8428 17.9846 18.6629V21.4C18.2479 21.419 19.0016 21.4635 20.0432 21.4635C21.2931 21.4635 21.919 21.4114 22.0317 21.401V18.6648C26.0484 18.8437 29.0463 19.5443 29.0463 20.3813C29.0463 21.2182 26.0493 21.9189 22.0317 22.0969V22.0969L22.0355 22.0978ZM22.0356 18.3817V15.9323H27.6412V12.1973H12.3791V15.9323H17.9838V18.3807C13.4283 18.59 10.0024 19.4923 10.0024 20.5735C10.0024 21.6547 13.4283 22.5561 17.9838 22.7663V30.6151H22.0346V22.7634C26.5797 22.5542 29.9999 21.6528 29.9999 20.5725C29.9999 19.4923 26.5826 18.5909 22.0346 18.3807V18.3807L22.0356 18.3817Z"
        fill={fill}
      />
    </g>
    <defs>
      <filter
        id="filter0_i_117_277"
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
          result="effect1_innerShadow_117_277"
        />
        <feOffset />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0823529 0 0 0 0 0.109804 0 0 0 0 0.321569 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_117_277"
        />
      </filter>
      <linearGradient
        id="paint0_linear_117_277"
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
      <clipPath id="clip0_117_277">
        <rect width="40" height="40" fill={fill} />
      </clipPath>
    </defs>
  </SvgIcon>
)
