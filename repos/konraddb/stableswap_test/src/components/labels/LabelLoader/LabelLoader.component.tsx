import React from 'react'

import { Skeleton, Typography } from '@mui/material'

import { ILabelLoaderProps } from './LabelLoader.types'

const LabelLoader: React.FC<ILabelLoaderProps> = ({
  isFetching,
  text,
  style,
  ...rest
}) => (
  <>
    {isFetching || !text ? (
      <Skeleton width={50} />
    ) : (
      <Typography
        color={(theme) => theme.palette.text.secondary}
        sx={{
          fontSize: '10px',
          fontWeight: 600,
          ...style,
        }}
        {...rest}
      >
        {text}
      </Typography>
    )}
  </>
)

export default LabelLoader
