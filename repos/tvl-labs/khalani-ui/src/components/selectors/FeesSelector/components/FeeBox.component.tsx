import React from 'react'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Stack, Typography } from '@mui/material'

import { FeeBoxStyled } from './FeeBox.styled'
import { IFeeBoxProps } from './FeeBox.types'

const FeeBox: React.FC<IFeeBoxProps> = (props) => {
  const { value, selected, onClick } = props

  return (
    <FeeBoxStyled className={selected ? 'selected' : ''} onClick={onClick}>
      <Stack direction="row" alignItems="center" gap={0.5}>
        {selected && (
          <CheckCircleOutlineIcon style={{ height: 16, width: 16 }} />
        )}
        <Typography
          variant="button"
          color={selected ? 'text.primary' : 'text.secondary'}
        >
          {Number(value) * 100}%
        </Typography>
      </Stack>
    </FeeBoxStyled>
  )
}

export default FeeBox
