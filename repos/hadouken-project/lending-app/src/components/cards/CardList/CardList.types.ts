import React from 'react'

import { IRow } from '@hadouken-project/ui'
import { CardProps } from '@mui/material'

export interface CustomCardProps extends CardProps {
  row: IRow
  onRowClick?: (id: string) => void
}

export interface CardListProps {
  rows: IRow[]
  Component: React.FC<CustomCardProps>
  onRowClick?: (id: string) => void
}
