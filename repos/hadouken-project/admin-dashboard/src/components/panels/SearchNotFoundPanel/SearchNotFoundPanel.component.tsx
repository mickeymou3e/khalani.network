import React from 'react'

import { SearchNotFound } from '@hadouken-project/ui'
import { alpha, Box } from '@mui/material'
import colors from '@styles/colors'

import { SearchNotFoundPanelProps } from './SearchNotFoundPanel.types'

export const SearchNotFoundPanel: React.FC<SearchNotFoundPanelProps> = ({
  searchText,
}) => (
  <Box p={2} bgcolor={alpha(colors.black, 0.5)}>
    <SearchNotFound searchPhrase={searchText} />
  </Box>
)
