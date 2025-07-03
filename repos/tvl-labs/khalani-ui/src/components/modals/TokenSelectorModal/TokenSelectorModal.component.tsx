import React from 'react'

import TokenWithBackground from '@components/icons/TokenWithBackground'
import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import ValueLabel from '@components/labels/ValueLabel'
import SearchList from '@components/search/SearchList'
import { IListItem } from '@components/search/SearchList/SearchList.types'
import { alpha, Box, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { formatOutputAmount, truncateToSpecificDecimals } from '@utils/text'
import { formatTokenSymbol } from '@utils/tokens'

import Modal from '../Modal/Modal.component'
import ModalHeader from '../ModalHeader/ModalHeader.component'
import { messages } from './TokenSelectorModal.messages'
import { ITokenSelectorModalProps } from './TokenSelectorModal.types'

const TokenSelectorModal: React.FC<ITokenSelectorModalProps> = ({
  tokens,
  balances,
  selectedToken,
  onTokenSelect,
  onClose,
  open,
  hideBalances,
}) => {
  const handleTokenSelect = (item: IListItem) => {
    const token = tokens.find((token) => token.id === item.id)
    if (token) {
      onTokenSelect?.(token)
    }

    onClose()
  }

  const isFetching = balances?.length === 0

  return (
    <Modal open={open} handleClose={onClose}>
      <Box width={{ xs: '100%', md: 400 }}>
        <ModalHeader title={messages.SELECT_TOKEN} handleClose={onClose} />

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
              const foundBalance = balances.find(
                (balance) => balance.tokenId === item.id,
              )
              const selected = selectedToken && selectedToken.id === item?.id

              if (!token) return

              const balance = foundBalance
                ? formatOutputAmount(foundBalance.balance, token.decimals)
                : undefined

              return (
                <Box
                  width="100%"
                  display="flex"
                  p={2}
                  borderRadius={3}
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    background: selected
                      ? (theme) => theme.palette.elevation.dark
                      : 'none',
                    '&:hover': {
                      background: (theme) =>
                        selected
                          ? theme.palette.elevation.light
                          : alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {token.chainId ? (
                      <TokenWithNetwork
                        chainId={parseInt(token.chainId, 16)}
                        tokenSymbol={token.symbol}
                      />
                    ) : (
                      <TokenWithBackground tokenSymbol={token.symbol} />
                    )}
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                    width="100%"
                    overflow="hidden"
                    ml={1}
                  >
                    <Typography variant="subtitle2">
                      {formatTokenSymbol(item.symbol)}
                    </Typography>
                  </Box>
                  {!hideBalances && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-end"
                      marginLeft={2}
                      overflow="visible"
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
                        {!isFetching && balance ? (
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
