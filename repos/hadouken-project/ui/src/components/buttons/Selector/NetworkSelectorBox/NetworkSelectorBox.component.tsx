import React from 'react'

import SwapIcon from '@components/icons/business/Swap'
import { Box, Typography, useTheme } from '@mui/material'

import { INetworkSelectorBoxProps } from './NetworkSelectorBox.types'

const NetworkSelectorBox: React.FC<INetworkSelectorBoxProps> = ({
  from,
  to,
  selected,
  description,
}) => {
  const theme = useTheme()

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={0.5}
      paddingTop={2.375}
      paddingBottom={0.5}
      marginBottom={1}
      width="100%"
      sx={{
        background: (theme) =>
          selected ? theme.palette.secondary.dark : 'none',

        '&:hover': {
          color: (theme) => theme.palette.common.black,
          backgroundColor: (theme) => theme.palette.secondary.light,
        },
      }}
    >
      <Box width="100%" display="flex" justifyContent="space-between">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexBasis="40%"
        >
          <Typography
            color="textPrimary"
            variant="paragraphSmall"
            textAlign="center"
          >
            {from}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexBasis="20%"
          color={(theme) => theme.palette.secondary.main}
        >
          <SwapIcon fill={theme.palette.text.primary} />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexBasis="40%"
        >
          <Typography
            color="textPrimary"
            variant="paragraphSmall"
            textAlign="center"
          >
            {to}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography
          color={(theme) => theme.palette.text.gray}
          variant="paragraphTiny"
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

export default NetworkSelectorBox
