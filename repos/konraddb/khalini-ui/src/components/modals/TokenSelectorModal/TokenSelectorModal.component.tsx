import React from 'react'

import ValueLabel from '@components/labels/ValueLabel'
import SearchList from '@components/search/SearchList'
import { IListItem } from '@components/search/SearchList/SearchList.types'
import { alpha, Box, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { getTokenIconComponent } from '@utils/icons'
import { bigNumberToString, truncateToSpecificDecimals } from '@utils/text'

import Modal from '../Modal/Modal.component'
import ModalHeader from '../ModalHeader/ModalHeader.component'
import { messages } from './TokenSelectorModal.messages'
import { ITokenSelectorModalProps } from './TokenSelectorModal.types'

const TokenSelectorModal: React.FC<ITokenSelectorModalProps> = ({
  tokens,
  selectedToken,
  onTokenSelect,
  onClose,
  open,
  isFetching,
}) => {
  const handleTokenSelect = (item: IListItem) => {
    const token = tokens.find((token) => token.id === item.id)
    if (token) {
      onTokenSelect?.(token)
    }

    onClose()
  }

  return (
    <Modal open={open} handleClose={onClose}>
      <Box width={{ xs: '100%', md: 385 }}>
        <ModalHeader title={messages.SELECT_TOKEN} />

        <Box pt={2}>
          <SearchList
            items={tokens.map((token) => ({
              id: token.id,
              text: token.name,
              symbol: token.symbol,
              description: token.name,
            }))}
            selectedItem={
              selectedToken && {
                id: selectedToken.id,
                text: selectedToken.name,
                description: selectedToken.name,
              }
            }
            onSelect={handleTokenSelect}
            itemRenderer={(item) => {
              const token = tokens.find((token) => token.id === item.id)
              const TokenIcon = getTokenIconComponent(token?.symbol)

              if (!token) return

              const balance =
                token?.balance &&
                bigNumberToString(token.balance, token.decimals)

              const selected = selectedToken && selectedToken.id === item?.id

              return (
                <Box
                  width="100%"
                  display="flex"
                  px={3}
                  py={1}
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    background: selected
                      ? (theme) => theme.palette.secondary.dark
                      : 'none',
                    '&:hover': {
                      background: (theme) =>
                        selected
                          ? theme.palette.secondary.light
                          : alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {token?.icon ? (
                      token.icon
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
                      {item.symbol}
                    </Typography>
                    <Typography
                      variant="paragraphTiny"
                      color={(theme) => theme.palette.text.darkGray}
                      textAlign="start"
                      width="100%"
                      noWrap
                    >
                      {item.text ? item.text : <Skeleton variant="text" />}
                    </Typography>
                  </Box>
                  {balance && !token.hideBalance && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-end"
                      marginLeft={2}
                      overflow="visible"
                      sx={{
                        textTransform: 'uppercase',
                      }}
                    >
                      <Box
                        sx={{
                          color: (theme) =>
                            selected
                              ? theme.palette.common.white
                              : alpha(theme.palette.common.white, 0.7),
                        }}
                      >
                        <Typography variant="caption">
                          {messages.BALANCE_LABEL}
                        </Typography>
                      </Box>
                      <Box maxWidth={200}>
                        {!isFetching ? (
                          <ValueLabel
                            value={truncateToSpecificDecimals(balance, 4)}
                          />
                        ) : (
                          <Skeleton width={50} />
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            }}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default TokenSelectorModal
