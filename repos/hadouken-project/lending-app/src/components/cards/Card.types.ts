import React from 'react'

import { IRow } from '@hadouken-project/ui'

export interface ICardProps {
  row: IRow
  onRowClick?: (id: string) => void
}

export interface CardListProps {
  rows: IRow[]
  Component: React.FC<ICardProps>
  onRowClick?: (id: string) => void
}
