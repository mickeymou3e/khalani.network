import React from 'react'

import { IColumn } from '@hadouken-project/ui'
import { Typography } from '@mui/material'

import { FIELD_NAME } from './PoolLiquidity.constants'
import { MESSAGES } from './PoolLiquidity.messages'

const ACTION_COLUMN: IColumn = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      {MESSAGES.COLUMN_ACTION}
    </Typography>
  ),
  name: FIELD_NAME.ACTION,
  width: '25%',
  align: 'left',
  isSortable: false,
}

export const TOKENS_COLUMN: IColumn = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      {MESSAGES.COLUMN_TOKENS}
    </Typography>
  ),
  name: FIELD_NAME.TOKENS,
  width: '35%',
  align: 'left',
  isSortable: false,
}

export const TIME_COLUMN: IColumn = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      {MESSAGES.COLUMN_TIME}
    </Typography>
  ),
  name: FIELD_NAME.TIME,
  width: '20%',
  align: 'left',
  isSortable: false,
}

export const COLUMNS = [ACTION_COLUMN, TOKENS_COLUMN, TIME_COLUMN]
