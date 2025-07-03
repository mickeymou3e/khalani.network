import React from 'react'

import { IIcon } from '@interfaces/core'

export const WalletConnectIcon: React.FC<IIcon> = ({
  style,
  fill = '#3396FF',
}) => {
  return (
    <svg width="20" height="20" viewBox="0 0 2497 2497" style={style}>
      <g id="Layer_x0020_1">
        <g id="_2806050136896">
          <circle
            fill={fill}
            stroke="#66b1ff"
            strokeWidth={3}
            strokeMiterlimit={22}
            cx="1249"
            cy="1249"
            r="1247"
          ></circle>
          <path
            fill="#ffffff"
            d="M764,930c267-261,701-261,969,0l32,31c13,13,13,34,0,47l-110,107c-7,7-18,7-24,0l-44-43    c-187-182-489-182-676,0l-47,46c-7,7-18,7-24,0l-110-107c-13-13-13-34,0-47l35-34H764z M1960,1152l98,96c13,13,13,34,0,47    l-442,431c-13,13-35,13-48,0l-314-306c-3-3-9-3-12,0l-314,306c-13,13-35,13-48,0l-442-431c-13-13-13-34,0-47l98-96    c13-13,35-13,48,0l314,306c3,3,9,3,12,0l314-306c13-13,35-13,48,0l314,306c3,3,9,3,12,0l314-306C1925,1139,1947,1139,1960,1152    L1960,1152z"
          ></path>
        </g>
      </g>
    </svg>
  )
}
