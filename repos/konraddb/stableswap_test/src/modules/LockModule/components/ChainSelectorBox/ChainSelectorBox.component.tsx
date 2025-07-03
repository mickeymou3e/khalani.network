import React from 'react'

import { Avatar, Box, Typography } from '@mui/material'

import { IChainSelectorBoxProps } from './ChainSelectorBox.types'

const ChainSelectorBox: React.FC<IChainSelectorBoxProps> = (props) => {
  const { selected, chain, disableHover } = props

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      paddingX={2}
      sx={{
        background: (theme) =>
          selected ? theme.palette.secondary.dark : 'none',

        ...(!disableHover && {
          '&:hover': {
            color: (theme) => theme.palette.common.black,
            backgroundColor: (theme) => theme.palette.secondary.light,
          },
        }),
      }}
    >
      <Box width="100%" display="flex" justifyContent="space-between">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1.5}
        >
          <Avatar src={chain?.logo}>N</Avatar>
          <Typography color="textPrimary" variant="paragraphSmall">
            {chain?.chainName}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ChainSelectorBox
