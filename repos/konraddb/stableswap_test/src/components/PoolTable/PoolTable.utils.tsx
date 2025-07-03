import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

export const columns: IColumn[] = [
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Assets
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
        Composition
      </Typography>
    ),
    name: 'composition',
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
        Pool Value
      </Typography>
    ),
    name: 'tvl',
    width: '20%',
    align: 'center',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Volume (24h)
      </Typography>
    ),
    name: 'volume',
    width: '20%',
    align: 'center',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        APR
      </Typography>
    ),
    name: 'apy',
    width: '20%',
    align: 'center',
    isSortable: false,
  },
]
