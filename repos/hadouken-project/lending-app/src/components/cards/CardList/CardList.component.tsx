import React from 'react'

import { List } from '@mui/material'

import { CardListProps } from './CardList.types'

const CardList: React.FC<CardListProps> = ({ rows, onRowClick, Component }) => {
  return (
    <List sx={{ padding: 0 }}>
      {rows.map((row, index) => (
        <Component
          row={row}
          key={row.id}
          onRowClick={onRowClick}
          sx={{
            marginTop: '1px',
            borderRadius: index === rows.length - 1 ? '0 0 3px 3px' : '0',
          }}
        />
      ))}
    </List>
  )
}

export default CardList
