import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

export const backstopColumns: IColumn[] = [
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Asset
      </Typography>
    ),
    name: 'assets',
    width: '20%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Market size
      </Typography>
    ),
    name: 'market',
    width: '20%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        APY
      </Typography>
    ),
    name: 'apy',
    width: '20%',
    align: 'left',
    isSortable: false,
  },
  {
    value: '',
    name: 'actions',
    width: '20%',
    align: 'left',
    isSortable: false,
  },
]
