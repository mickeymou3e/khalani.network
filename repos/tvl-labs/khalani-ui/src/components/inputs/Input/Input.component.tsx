import React, { forwardRef, Ref, useRef } from 'react'

import MUIInput from '@mui/material/Input'
import Skeleton from '@mui/material/Skeleton'

import { placeholderStyles } from './Input.styles'
import { IInputProps } from './Input.types'

const InputSkeleton = forwardRef((_, ref: Ref<HTMLInputElement>) => (
  <Skeleton ref={ref} variant="rectangular" width={100} />
))

const Input: React.FC<IInputProps> = (props) => {
  const { disabled, loading, inputProps, ...overrideProps } = props
  const inputRef = useRef<HTMLDivElement>(null)

  return (
    <MUIInput
      ref={inputRef}
      disableUnderline
      fullWidth
      disabled={disabled || loading}
      inputProps={{
        ...inputProps,
        spellCheck: false,
      }}
      inputComponent={loading ? InputSkeleton : undefined}
      {...overrideProps}
      sx={{
        ...placeholderStyles(),
      }}
    />
  )
}

export default Input
