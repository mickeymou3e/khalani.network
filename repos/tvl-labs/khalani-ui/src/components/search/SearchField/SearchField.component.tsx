import React from 'react'

import SearchIcon from '@components/icons/business/Search'
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'

import { CustomizedSearchField, SearchButton } from './SearchField.styled'
import { ISearchFieldProps } from './SearchField.types'

const SearchField: React.FC<ISearchFieldProps> = (props) => {
  const {
    handleSearchClick,
    loading,
    notFound,
    valueChangeHandler,
    ...rest
  } = props
  const theme = useTheme()

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => valueChangeHandler?.(event.target.value)

  return (
    <>
      <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            borderColor: (theme) =>
              notFound
                ? theme.palette.error.main
                : theme.palette.elevation.light,
          }}
        >
          <CustomizedSearchField
            inputProps={{ 'aria-label': 'search' }}
            onChange={onChangeHandler}
            endAdornment={
              <SearchButton onClick={handleSearchClick} disabled={loading}>
                {loading ? (
                  <CircularProgress size={25} color="secondary" />
                ) : (
                  <SearchIcon fill={theme.palette.text.primary} />
                )}
              </SearchButton>
            }
            disableUnderline
            size="small"
            {...rest}
          />
        </Paper>
      </Paper>
      {notFound ? (
        <Typography variant="button" color="error">
          This is an invalid search string. Please check your input or try
          another search.
        </Typography>
      ) : (
        <Box height={24}></Box>
      )}
    </>
  )
}

export default SearchField
