import React from 'react'

import { Box, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { alpha } from '@mui/system'

import { SearchBox } from '../SearchBox'
import SearchNotFound from '../SearchNotFound'
import { useSearch } from './SearchList.hooks'
import { messages } from './SearchList.messages'
import { ISearchListProps } from './SearchList.types'

const SearchList: React.FC<ISearchListProps> = ({
  items,
  selectedItem,
  onSelect,
  itemRenderer,
  inputPlaceholder = messages.INPUT_PLACEHOLDER,
  isSearchBoxVisible = true,
}) => {
  const { items: searched, setSearchText, searchText } = useSearch({ items })

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(event.target.value)

  return (
    <Box>
      {isSearchBoxVisible && (
        <Box>
          <SearchBox
            autoFocus
            placeholder={inputPlaceholder}
            onChange={onInputChange}
          />
        </Box>
      )}

      <List sx={{ paddingBottom: 0, paddingTop: isSearchBoxVisible ? 2 : 0 }}>
        {searched.map((item) => {
          const selected = item.id === selectedItem?.id
          return (
            <ListItem
              key={item.id}
              selected={selected}
              onClick={() => onSelect?.(item)}
            >
              {itemRenderer ? (
                itemRenderer(item, selected)
              ) : (
                <ListItemButton selected={selected}>
                  <Box
                    width="100%"
                    sx={{
                      color: (theme) =>
                        selected
                          ? theme.palette.common.black
                          : alpha(theme.palette.text.secondary, 0.7),
                      '&:hover': {
                        color: (theme) => theme.palette.text.secondary,
                      },
                    }}
                  >
                    <Typography variant="h5">
                      <b>{item.text}</b>
                    </Typography>
                    <Typography variant="h5">{item.description}</Typography>
                  </Box>
                </ListItemButton>
              )}
            </ListItem>
          )
        })}
        {searched.length === 0 && (
          <Box pt={3.5}>
            <SearchNotFound searchPhrase={searchText} />
          </Box>
        )}
      </List>
    </Box>
  )
}

export default SearchList
