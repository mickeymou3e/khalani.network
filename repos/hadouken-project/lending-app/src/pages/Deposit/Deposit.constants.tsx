import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

export const columns: IColumn[] = [
  {
    name: 'assets',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Asset
      </Typography>
    ),
    width: '20%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'canBeCollateral',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Can be collateral
      </Typography>
    ),
    width: '20%',
    align: 'center',
    isSortable: false,
  },
  {
    name: 'balance',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Your wallet balance
      </Typography>
    ),
    width: '35%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'APY',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        APY
      </Typography>
    ),
    width: '25%',
    align: 'left',
    isSortable: false,
  },
]
