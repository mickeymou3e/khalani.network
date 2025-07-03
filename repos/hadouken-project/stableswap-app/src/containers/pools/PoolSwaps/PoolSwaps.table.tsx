import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

import {
  TIME_COLUMN,
  TOKENS_COLUMN,
} from '../PoolLiquidity/PoolLiquidity.table'
import { FIELD_NAME } from './PoolSwaps.constants'

const VALUE_COLUMN: IColumn = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      Value
    </Typography>
  ),
  name: FIELD_NAME.VALUE,
  width: '25%',
  align: 'left',
  isSortable: false,
}

export const COLUMNS = [VALUE_COLUMN, TOKENS_COLUMN, TIME_COLUMN]
