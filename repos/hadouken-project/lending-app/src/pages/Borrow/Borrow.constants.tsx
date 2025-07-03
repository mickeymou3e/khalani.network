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
    name: 'balance',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Available to borrow
      </Typography>
    ),
    width: '30%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'VariableAPY',
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Variable APY
      </Typography>
    ),
    width: '25%',
    align: 'left',
    isSortable: false,
  },
  // TODO-HDK-652 bring back stable borrow
  // {
  //   name: 'StableAPY',
  //   value: (
  //     <Typography
  //       variant="paragraphSmall"
  //       color={(theme) => theme.palette.text.secondary}
  //     >
  //       Stable APY
  //     </Typography>
  //   ),
  //   width: '25%',
  //   align: 'left',
  //   isSortable: false,
  // },
]
