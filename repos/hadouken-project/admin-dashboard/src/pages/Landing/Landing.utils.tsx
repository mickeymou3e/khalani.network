import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

export const DEFAULT_SORT_COLUMN = 'healthFactor'

export const balancesColumns: IColumn[] = [
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        ASSET
      </Typography>
    ),
    name: 'symbol',
    width: '50%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        AMOUNT
      </Typography>
    ),
    name: 'amount',
    width: '50%',
    align: 'left',
    isSortable: false,
  },
]

export const usersColumns: IColumn[] = [
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        WALLET ADDRESS
      </Typography>
    ),
    name: 'user',
    width: '10%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        LOAN VALUE
      </Typography>
    ),
    name: 'debtTokens',
    width: '40%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        COLLATERAL VALUE
      </Typography>
    ),
    name: 'collateralTokens',
    width: '40%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        HEALTH FACTOR
      </Typography>
    ),
    name: 'healthFactor',
    width: '10%',
    align: 'left',
    isSortable: true,
  },
]

export const liquidationsColumns: IColumn[] = [
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        WALLET ADDRESS
      </Typography>
    ),
    name: 'user',
    width: '10%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        LIQUIDATOR
      </Typography>
    ),
    name: 'liquidator',
    width: '10%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        LOAN VALUE
      </Typography>
    ),
    name: 'debtToken',
    width: '40%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        COLLATERAL VALUE
      </Typography>
    ),
    name: 'collateralToken',
    width: '40%',
    align: 'left',
    isSortable: false,
  },
]
