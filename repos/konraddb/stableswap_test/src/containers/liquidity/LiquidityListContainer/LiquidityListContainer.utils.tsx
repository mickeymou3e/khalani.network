import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

export const tabs = [
  { label: 'Your TVL', value: 0 },
  { label: 'Available', value: 1 },
]

const tableColumns = [
  { label: 'Token', value: 'tokenSymbol' },
  { label: 'Network', value: 'chainName' },
  { label: 'TVL', value: 'tvl' },
  { label: 'Volume (24h)', value: 'volume' },
]

export const columns: IColumn[] = tableColumns.map((column) => ({
  value: (
    <Typography
      variant="paragraphSmall"
      color={(theme) => theme.palette.text.secondary}
    >
      {column.label}
    </Typography>
  ),
  name: column.value,
  width: '25%',
  align: 'left',
  isSortable: false,
}))
