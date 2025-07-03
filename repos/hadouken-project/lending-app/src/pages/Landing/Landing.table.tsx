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
    width: '16%',
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
    width: '16%',
    align: 'left',
    isSortable: true,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Total borrowed
      </Typography>
    ),
    name: 'borrowed',
    width: '16%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Deposit APY
      </Typography>
    ),
    name: 'apy',
    width: '16%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Variable borrow APY
      </Typography>
    ),
    name: 'variableBorrow',
    width: '16%',
    align: 'left',
    isSortable: false,
  },
  // TODO-HDK-652 bring back stable borrow
  // {
  //   value: (
  //     <Typography
  //       variant="paragraphSmall"
  //       color={(theme) => theme.palette.text.secondary}
  //     >
  //       Stable borrow APY
  //     </Typography>
  //   ),
  //   name: 'stableBorrow',
  //   width: '16%',
  //   align: 'left',
  //   isSortable: false,
  // },
]
