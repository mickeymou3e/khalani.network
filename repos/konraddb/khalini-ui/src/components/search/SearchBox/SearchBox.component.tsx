import React from 'react'

import SearchIcon from '@components/icons/business/Search'
import { InputAdornment, useTheme } from '@mui/material'

import Input from '../../inputs/Input'
import { ISearchBoxProps } from './SearchBox.types'

const SearchBox: React.FC<ISearchBoxProps> = (props) => {
  const { valueChangeHandler, ...rest } = props
  const onChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => valueChangeHandler?.(event.target.value)
  const theme = useTheme()

  return (
    <Input
      placeholder="Search token…"
      inputProps={{ 'aria-label': 'search' }}
      onChange={onChangeHandler}
      sx={{
        paddingX: (theme) => theme.spacing(1.5),
        paddingY: (theme) => theme.spacing(1),
        height: 48,
        borderRadius: 3,
        '& .MuiInput-input': {
          ...theme.typography.body1,
        },
      }}
      startAdornment={
        <InputAdornment
          position="start"
          sx={{ margin: 'auto', paddingRight: 1 }}
        >
          <SearchIcon fill={theme.palette.text.primary} />
        </InputAdornment>
      }
      {...rest}
    />
  )
}

export default SearchBox
