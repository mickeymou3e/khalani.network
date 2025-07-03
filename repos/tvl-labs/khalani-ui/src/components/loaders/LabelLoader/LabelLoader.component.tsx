import React from 'react'

import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { ILabelLoaderProps } from './LabelLoader.types'

const LabelLoader: React.FC<ILabelLoaderProps> = ({
  isFetching,
  text,
  style,
  color,
  ...rest
}) => (
  <>
    {isFetching || !text ? (
      <Skeleton style={{ ...style }} width={50} />
    ) : (
      <Typography
        style={{
          ...style,
        }}
        color={color}
        {...rest}
      >
        {text}
      </Typography>
    )}
  </>
)

export default LabelLoader
