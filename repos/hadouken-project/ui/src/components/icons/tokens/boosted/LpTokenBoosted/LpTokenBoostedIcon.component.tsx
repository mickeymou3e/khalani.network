import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const LpTokenBoostedIcon: React.FC<IIcon> = ({
  style,
  fill = '#FFFFFF',
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 40 40"
    sx={{ fill: 'none', width: '24px', height: '24px', ...sx }}
    style={style}
    {...rest}
  >
    <g clipPath="url(#clip0_120_323)">
      <g filter="url(#filter0_i_120_323)">
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_120_323)" />
      </g>
      <mask
        id="mask0_120_323"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="40"
        height="40"
      >
        <path d="M40 0H0V40H40V0Z" fill={fill} />
      </mask>
      <g mask="url(#mask0_120_323)">
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
          d="M26 24.2406C26 21.0457 24.1194 19.9502 20.3582 19.4939C17.6716 19.1287 17.1343 18.3985 17.1343 17.1203C17.1343 15.8422 18.0299 15.0208 19.8209 15.0208C21.4328 15.0208 22.3284 15.5685 22.7761 16.9378C22.8657 17.2117 23.1344 17.3942 23.403 17.3942H24.8357C25.194 17.3942 25.4627 17.1203 25.4627 16.7553V16.664C25.1044 14.6556 23.4924 13.1038 21.4328 12.9213V8.73043C21.4328 8.36522 21.1641 8.09136 20.7165 8H19.3732C19.0149 8 18.7462 8.27386 18.6566 8.73043V12.8299C15.97 13.1952 14.2687 15.0208 14.2687 17.303C14.2687 20.3155 16.0596 21.502 19.8209 21.9586C22.3284 22.415 23.1344 22.9627 23.1344 24.4233C23.1344 25.884 21.8805 26.8881 20.1791 26.8881C17.8506 26.8881 17.0447 25.8838 16.776 24.5145C16.6866 24.1495 16.4179 23.9668 16.1493 23.9668H14.6267C14.2687 23.9668 14 24.2406 14 24.6058V24.6972C14.3581 26.9792 15.791 28.6223 18.7462 29.0789V31.2698C18.7462 31.6348 19.0149 31.9086 19.4626 32H20.8059C21.1641 32 21.4328 31.7261 21.5224 31.2698V29.0789C24.209 28.6223 26 26.7053 26 24.2406Z"
          fill={fill}
        />
        <path
          d="M16.5 10.603L20.1027 7.05164L23.7059 10.6032"
          stroke="white"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_i_120_323"
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
          result="effect1_innerShadow_120_323"
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
          result="effect1_innerShadow_120_323"
        />
      </filter>
      <linearGradient
        id="paint0_linear_120_323"
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
      <clipPath id="clip0_120_323">
        <rect width="40" height="40" fill={fill} />
      </clipPath>
    </defs>
  </SvgIcon>
)

export default LpTokenBoostedIcon
