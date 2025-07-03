import React from 'react'

import { ArrowDownIcon } from '@components/icons'
import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import { Box, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'

import { CustomizedTokenButton } from './TokenButton.styled'
import { ITokenButtonProps } from './TokenButton.types'

const TokenButton: React.FC<ITokenButtonProps> = ({
  select,
  name,
  symbol,
  isStkToken,
  ...overrideProps
}) => {
  return (
    <CustomizedTokenButton variant="contained" {...overrideProps}>
      <Box display="flex">
        {symbol ? (
          <TokenWithNetwork tokenSymbol={symbol} isStkToken={isStkToken} />
        ) : (
          <Skeleton variant="circular" width={24} height={24} />
        )}
      </Box>
      <Box>
        <Typography
          variant="button"
          color="text.secondary"
          textTransform="initial"
        >
          {symbol}
        </Typography>
        {name && (
          <Typography
            variant="body1"
            color={(theme) => theme.palette.text.secondary}
            textAlign="start"
            width="100%"
            noWrap
            sx={{ mt: 0.5 }}
          >
            {name ? name : <Skeleton variant="text" />}
          </Typography>
        )}
      </Box>
      {select && (
        <Box display="flex">
          <ArrowDownIcon />
        </Box>
      )}
    </CustomizedTokenButton>
  )
}

export default TokenButton
