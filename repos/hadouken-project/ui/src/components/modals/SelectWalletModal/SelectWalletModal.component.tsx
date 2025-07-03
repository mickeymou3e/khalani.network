import React from 'react'

import Button from '@components/buttons/Button'
import { CloseIcon, MetamaskIcon, WalletConnectIcon } from '@components/icons'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { IconButton, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { messages } from './SelectWalletModal.messages'
import { ISelectWalletModalProps } from './SelectWalletModal.types'

const SelectWalletModal: React.FC<ISelectWalletModalProps> = ({
  open,
  title = messages.TITLE,
  description = messages.DESCRIPTION,
  handleClose,
  onMetaMaskSelect,
  onWalletConnectSelect,
  disableMetamask,
  disableWalletConnect,
}) => {
  const theme = useTheme()

  return (
    <Modal open={open} handleClose={handleClose}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ModalHeader title={title} />
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        <Box justifyContent="center" display="flex" flexDirection="column">
          <Box
            paddingTop={2}
            maxWidth={{ xs: 'none', md: 350 }}
            textAlign="start"
          >
            <Typography
              textAlign="start"
              variant="caption"
              color={(theme) => theme.palette.text.gray}
            >
              {description}
            </Typography>
          </Box>
        </Box>

        <Box mt={4}>
          <Box>
            <Button
              variant="text"
              text="MetaMask"
              size="medium"
              onClick={onMetaMaskSelect}
              fullWidth
              disabled={disableMetamask}
              startIcon={
                <Box
                  width={30}
                  height={30}
                  borderRadius="100%"
                  bgcolor={(theme) => theme.palette.common.white}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginRight={1}
                >
                  <MetamaskIcon />
                </Box>
              }
              sx={{ justifyContent: 'flex-start', cursor: 'pointer' }}
            />
          </Box>
          <Box mt={2}>
            <Button
              variant="text"
              text="WalletConnect"
              size="medium"
              onClick={onWalletConnectSelect}
              disabled={disableWalletConnect}
              fullWidth
              startIcon={
                <WalletConnectIcon
                  style={{ width: 30, height: 30, marginRight: 8 }}
                  fill={
                    disableWalletConnect
                      ? theme.palette.text.darkGray
                      : undefined
                  }
                />
              }
              sx={(theme) => ({
                justifyContent: 'flex-start',
                cursor: 'pointer',
                '&:disabled': {
                  color: theme.palette.text.darkGray,
                },
              })}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default SelectWalletModal
