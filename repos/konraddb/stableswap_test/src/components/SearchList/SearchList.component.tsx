import React from 'react'

import { Input } from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'

import { useSearch } from './SearchList.hooks'
import { messages } from './SearchList.messages'
import { ISearchListProps } from './SearchList.types'

const SearchList: React.FC<ISearchListProps> = ({
  items,
  selectedItem,
  onSelect,
  itemRenderer,
}) => {
  const [searched, setSearchText] = useSearch({ items })

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(event.target.value)

  return (
    <Box>
      <Input
        autoFocus
        placeholder={messages.INPUT_PLACEHOLDER}
        onChange={onInputChange}
      />
      <Box marginTop={2}>
        {searched.map((item) => {
          const selected = item.id === selectedItem?.id

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
                >
                  <Typography variant="h4Bold">
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

export default SearchList
