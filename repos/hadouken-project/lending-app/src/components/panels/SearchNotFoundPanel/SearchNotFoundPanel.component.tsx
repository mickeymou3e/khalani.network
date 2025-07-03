import React from 'react'

import { SearchNotFound } from '@hadouken-project/ui'
import { Box, Divider } from '@mui/material'

import { SearchNotFoundPanelProps } from './SearchNotFoundPanel.types'

export const SearchNotFoundPanel: React.FC<SearchNotFoundPanelProps> = ({
  searchText,
}) => (
  <Box p={2} pt={4}>
    <SearchNotFound searchPhrase={searchText} />
    <Divider />
  </Box>
)
