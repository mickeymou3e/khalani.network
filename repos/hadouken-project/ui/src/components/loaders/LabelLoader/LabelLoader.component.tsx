import React from 'react'

import { Tooltip } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { ILabelLoaderProps } from './LabelLoader.types'

const LabelLoader: React.FC<ILabelLoaderProps> = ({
  isFetching,
  text,
  style,
  tooltipText,
  color,
  ...rest
}) => (
  <>
    {isFetching || !text ? (
      <Skeleton style={{ ...style }} width={50} />
    ) : (
      <Tooltip title={tooltipText} placement="bottom">
        <Typography
          style={{
            ...style,
          }}
          color={color}
          {...rest}
        >
          {text}
        </Typography>
      </Tooltip>
    )}
  </>
)

export default LabelLoader
