import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const EthIcon: React.FC<IIcon> = ({ fill = '#EDF0F4', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 120 120"
    sx={{ fill: 'none', width: '24px', height: '24px', ...sx }}
    {...rest}
  >
    <circle cx="60" cy="60" r="60" fill={fill} />
    <path
      d="M59.8362 24L59.3589 25.6213V72.663L59.8362 73.1392L81.672 60.2318L59.8362 24Z"
      fill="#343434"
    />
    <path
      d="M59.8364 24L38 60.2318L59.8364 73.1392V50.3064V24Z"
      fill="#8C8C8C"
    />
    <path
      d="M59.8364 77.2734L59.5674 77.6015V94.3585L59.8364 95.1438L81.6856 64.3728L59.8364 77.2734Z"
      fill="#3C3C3B"
    />
    <path
      d="M59.8364 95.1438V77.2734L38 64.3728L59.8364 95.1438Z"
      fill="#8C8C8C"
    />
    <path
      d="M59.8364 73.1391L81.6722 60.2318L59.8364 50.3064V73.1391Z"
      fill="#141414"
    />
    <path d="M38 60.2318L59.8364 73.1391V50.3064L38 60.2318Z" fill="#393939" />
  </SvgIcon>
)

export default EthIcon
