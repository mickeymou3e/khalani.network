import React from 'react'

import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { List, ListItem, alpha } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { getNetworkIconComponent } from '../../../utils'
import { CloseIcon } from '../../icons'
import { messages } from './SelectNetworkModal.messages'
import { ISelectNetworkModalProps } from './SelectNetworkModal.types'

const SelectNetworkModal: React.FC<ISelectNetworkModalProps> = ({
  open,
  title = messages.TITLE,
  handleClose,
  networks,
  currentNetwork,
  onSelect,
  shouldBeAlwaysOpen,
}) => {
  return (
    <Modal open={open} handleClose={handleClose}>
      <Box width={{ xs: '100%', md: '360px' }}>
        <Box display="flex" width="100%">
          <ModalHeader title={title} />
          {!shouldBeAlwaysOpen && (
            <CloseIcon
              onClick={handleClose}
              sx={{
                marginLeft: 'auto',
              }}
            />
          )}
        </Box>
        <Box width="100%" display="flex" flexDirection="column">
          <Box justifyContent="center" display="flex" flexDirection="column">
            <List sx={{ paddingTop: 2 }}>
              {networks.map(({ name, chainId }) => {
                const selected = chainId === currentNetwork

                return (
                  <ListItem key={chainId}>
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      onClick={() => {
                        onSelect?.(chainId)
                        handleClose?.()
                      }}
                      p={2}
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
                      <Box
                        display="flex"
                        alignItems="left"
                        position="relative"
                        mr={1}
                      >
                        {getNetworkIconComponent(chainId)}
                      </Box>

                      <Typography
                        variant="paragraphSmall"
                        color={(theme) =>
                          alpha(theme.palette.common.white, 0.7)
                        }
                      >
                        {name}
                      </Typography>
                    </Box>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default SelectNetworkModal
