import React from 'react'

import { NoSearchResultIcon } from '@components/icons'
import { Box, Typography, useTheme } from '@mui/material'

import { messages } from './SearchNotFound.messages'
import { ISearchNotFoundProps } from './SearchNotFound.types'

const SearchNotFound: React.FC<ISearchNotFoundProps> = ({
  searchPhrase,
  tryAgainText,
}) => {
  const theme = useTheme()
  return (
    <Box>
      <NoSearchResultIcon style={{ display: 'flex', margin: 'auto' }} />

      <Box display="flex" justifyContent="center" pt={1.75}>
        <Box textAlign="center" maxWidth={{ xs: 190, md: 270, lg: 400 }}>
          <Box display="flex" justifyContent="center">
            <Typography
              variant="paragraphMedium"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: { xs: 190, md: 270 },
              }}
            >
              {messages.SEARCH_NOT_FOUND}
              <b
                style={{
                  marginLeft: 8,
                  color: theme.palette.text.secondary,
                }}
              >
                {searchPhrase}
              </b>
            </Typography>
          </Box>

          {tryAgainText && (
            <Typography
              sx={{ pt: 1 }}
              color={(theme) => theme.palette.text.gray}
              variant="caption"
            >
              {tryAgainText}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SearchNotFound
