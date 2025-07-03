import React from 'react'

import { InputAdornment } from '@mui/material'

import { TextFieldStyled } from './TextField.styled'
import { ITextFieldProps } from './TextField.types'

const TextField: React.FC<ITextFieldProps> = (props) => {
  const { endAdornmentSymbol, placeholder, startAdornment, onChange } = props

  return (
    <TextFieldStyled
      variant="filled"
      InputProps={{
        startAdornment: (
          <InputAdornment position="end" sx={{ mr: startAdornment ? 1 : 0 }}>
            {startAdornment}
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">{endAdornmentSymbol}</InputAdornment>
        ),
      }}
      placeholder={placeholder}
      onChange={onChange}
      focused
      fullWidth
    />
  )
}

export default TextField
