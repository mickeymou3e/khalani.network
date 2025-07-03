import React from 'react'

import MUIInput from '@mui/material/Input'
import Skeleton from '@mui/material/Skeleton'

import { IInputProps } from './Input.types'

const InputSkeleton = React.forwardRef(() => (
  <div style={{ width: '100%', display: 'flex' }}>
    <Skeleton variant="rectangular" width={100} />
  </div>
))

const Input: React.FC<IInputProps> = (props) => {
  const { disabled, loading, inputProps, ...overrideProps } = props

  return (
    <>
      <MUIInput
        disableUnderline
        fullWidth
        disabled={disabled || loading}
        inputProps={{
          ...inputProps,
          spellCheck: false,
        }}
        inputComponent={loading ? InputSkeleton : undefined}
        {...overrideProps}
      />
    </>
  )
}

export default Input
