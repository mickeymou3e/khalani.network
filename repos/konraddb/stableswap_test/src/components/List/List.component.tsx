import React from 'react'

import { Box, Typography } from '@mui/material'

import { IListProps } from './List.types'

const List: React.FC<IListProps> = ({
  items,
  selectedItem,
  onSelect,
  itemRenderer,
}) => {
  return (
    <Box>
      <Box marginTop={2}>
        {items.map((item) => {
          const selected = item.id === selectedItem.id

          return (
            <Box
              key={item.id}
              display="flex"
              alignItems="center"
              marginY={1}
              padding={1}
              onClick={() => onSelect?.(item)}
            >
              {itemRenderer ? (
                itemRenderer(item, selected)
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>
                    <b>{item.text}</b>
                  </Typography>
                  <Typography>{item.description}</Typography>
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default List
