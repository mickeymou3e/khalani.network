import React from 'react'

import SearchIcon from '@components/icons/business/Search'
import { InputAdornment, Paper, useTheme } from '@mui/material'

import Input from '../../inputs/Input'
import { messages } from './SearchBox.messages'
import { ISearchBoxProps } from './SearchBox.types'

const SearchBox: React.FC<ISearchBoxProps> = (props) => {
  const { valueChangeHandler, ...rest } = props
  const onChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => valueChangeHandler?.(event.target.value)
  const theme = useTheme()

  return (
    <Paper elevation={1}>
      <Input
        placeholder={messages.INPUT_PLACEHOLDER}
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChangeHandler}
        sx={{
          paddingX: (theme) => theme.spacing(1.5),
          paddingY: (theme) => theme.spacing(1),
          height: 48,
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
    </Paper>
  )
}

export default SearchBox
