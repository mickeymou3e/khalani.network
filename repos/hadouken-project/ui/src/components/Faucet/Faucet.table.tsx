import React from 'react'

import { IColumn } from '@components/Table'
import { Typography } from '@mui/material'

export const columns: IColumn[] = [
  {
    name: 'assets',
    value: (
      <Typography
        variant="caption"
        color={(theme) => theme.palette.text.secondary}
      >
        ASSET
      </Typography>
    ),
    width: '100%',
    align: 'left',
    isSortable: false,
  },
]
