import React from 'react'

import { ArrowDownIcon } from '@components/icons'
import { alpha, Box, Typography } from '@mui/material'
import MUIButton from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import { getTokenIconComponent } from '@utils/icons'

import { ITokenButtonProps } from './TokenButton.types'

const TokenButton: React.FC<ITokenButtonProps> = ({
  select,
  name,
  symbol,
  customIcon,
  ...overrideProps
}) => {
  const TokenIcon = getTokenIconComponent(symbol)

  return (
    <MUIButton
      variant="text"
      sx={{
        height: '100%',
        padding: 0,
        textTransform: 'none',
        '&:hover': {
          border: (theme) => `1px solid ${theme.palette.text.gray}`,
        },
        border: (theme) =>
          `1px solid ${theme.palette.background.backgroundBorder}`,
      }}
      fullWidth
      {...overrideProps}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingRight={3}
        paddingLeft={2}
        py={{ md: 0.75, xs: 1.84 }}
        width="100%"
      >
        <Box display="flex">
          {customIcon ? (
            customIcon
          ) : TokenIcon ? (
            <TokenIcon width={32} height={32} />
          ) : (
            <Skeleton variant="circular" width={32} height={32} />
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          width="100%"
          overflow="hidden"
          ml={2}
        >
          <Typography
            variant="paragraphSmall"
            color={(theme) => alpha(theme.palette.common.white, 0.7)}
          >
            {symbol}
          </Typography>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.darkGray}
            textAlign="start"
            width="100%"
            noWrap
          >
            {name ? name : <Skeleton variant="text" />}
          </Typography>
        </Box>
        {select && <ArrowDownIcon style={{ overflow: 'visible' }} />}
      </Box>
    </MUIButton>
  )
}

export default TokenButton
