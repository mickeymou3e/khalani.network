import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { alpha, Box, Divider, IconButton, Typography } from '@mui/material'
import { getTokenIconComponent } from '@utils/icons'

import { ITokenListProps } from '.'
import { messages } from './TokenList.messages'

const TokenList: React.FC<ITokenListProps> = ({
  handlePopularTokenList,
  popularTokensList,
  handleSelectedTokenList,
  selectedTokenList,
}) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" px={1} py={3}>
      <Box display="flex" flexDirection="row" gap={1}>
        {selectedTokenList?.map((token) => {
          const SelectedTokenIcon = getTokenIconComponent(token?.symbol)

          return (
            <IconButton
              key={token.id}
              onClick={() => handleSelectedTokenList?.(token.id)}
              sx={{
                borderRadius: 0,
                paddingTop: 0.75,
                paddingBottom: 0.75,
                backgroundColor: (theme) => theme.palette.background.default,
              }}
            >
              <SelectedTokenIcon height={20} width={20} />
              <Box display="flex" justifyContent="center" px={1}>
                <Typography
                  variant="caption"
                  color={(theme) => theme.palette.text.primary}
                >
                  {token.symbol.toUpperCase()}
                </Typography>
              </Box>
              <CloseIcon
                sx={{
                  height: 12,
                  width: 12,
                  color: (theme) => alpha(theme.palette.text.primary, 0.7),
                }}
              />
            </IconButton>
          )
        })}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        mx={selectedTokenList && selectedTokenList.length > 0 ? 2 : 0}
      >
        <Typography
          variant="breadCrumbs"
          color={(theme) => alpha(theme.palette.text.darkGray, 0.7)}
        >
          {messages.POPULAR}
        </Typography>
      </Box>
      <Divider orientation="vertical" />
      <Box display="flex" flexDirection="row" mx={2} gap={1}>
        {popularTokensList?.map((token) => {
          const PopularTokenIcon = getTokenIconComponent(token?.symbol)

          return (
            <IconButton
              key={token.id}
              onClick={() => handlePopularTokenList?.(token.id)}
              sx={{
                padding: 0.5,
                borderRadius: 5,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.background.default,
                },
              }}
            >
              <PopularTokenIcon height={32} width={32} />
            </IconButton>
          )
        })}
      </Box>
    </Box>
  )
}

export default TokenList
