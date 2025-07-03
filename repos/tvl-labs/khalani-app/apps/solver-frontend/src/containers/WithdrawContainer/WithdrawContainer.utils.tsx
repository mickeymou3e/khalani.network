import React from 'react'

import { Stack } from '@mui/material'
import { Typography } from '@tvl-labs/khalani-ui'

export const createItem = (
  id: number,
  label: string,
  iconComponent: JSX.Element,
  textContent: string,
) => {
  return {
    id,
    label,
    value: (
      <Stack direction="row" alignItems="center" gap={0.5}>
        {iconComponent}
        <Typography
          variant="caption"
          fontWeight={label === 'Fees' ? 500 : 700}
          color="text.secondary"
          lineHeight={'normal'}
          text={textContent}
        ></Typography>
      </Stack>
    ),
  }
}
