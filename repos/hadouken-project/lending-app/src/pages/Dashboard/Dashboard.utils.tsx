import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

export const depositColumns: IColumn[] = [
  {
    name: 'assets',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Your deposits
      </Typography>
    ),
    width: '15%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'balance',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Current balance
      </Typography>
    ),
    width: '25%',
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
    width: '10%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'collateral',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Collateral
      </Typography>
    ),
    width: '20%',
    align: 'center',
    isSortable: false,
  },
  {
    name: 'button',
    value: '',
    width: '25%',
    align: 'center',
    isSortable: false,
  },
]
export const borrowColumns: IColumn[] = [
  {
    name: 'assets',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Your Borrows
      </Typography>
    ),
    width: '15%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'borrowed',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Borrowed
      </Typography>
    ),
    width: '25%',
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
        Variable APY
      </Typography>
    ),
    width: '30%',
    align: 'left',
    isSortable: false,
  },
  // {
  //   name: 'APYType',
  //   value: (
  //     <Typography
  //       variant="paragraphSmall"
  //       color={(theme) => theme.palette.text.secondary}
  //     >
  //       APY Type
  //     </Typography>
  //   ),
  //   width: '20%',
  //   align: 'center',
  //   isSortable: false,
  // },
  {
    name: 'button',
    value: '',
    width: '25%',
    align: 'center',
    isSortable: false,
  },
]
