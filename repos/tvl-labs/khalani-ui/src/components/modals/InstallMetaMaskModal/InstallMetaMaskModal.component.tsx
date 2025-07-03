import React from 'react'

import Button from '@components/buttons/Button'
import ButtonLayout from '@components/buttons/ButtonLayout/ButtonLayout.component'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { messages } from './InstallMetaMaskModal.messages'
import { IInstallMetaMaskModalProps } from './InstallMetaMaskModal.types'

const InstallMetaMaskModal: React.FC<IInstallMetaMaskModalProps> = ({
  open,
  title = messages.TITLE,
  handleGoBack,
  handleInstallMetaMask,
  handleClose,
}) => {
  const texts = [
    `You'll need to install MetaMask to continue. Once you have it installed, go ahead and`,

    `refresh the page.`,
  ]

  return (
    <Modal open={open} handleClose={handleClose}>
      <ModalHeader title={title} handleClose={handleClose} />
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        <Box
          height="100%"
          alignItems="start"
          display="flex"
          flexDirection="column"
        >
          <Typography
            textAlign="start"
            variant="body2"
            color={(theme) => theme.palette.text.secondary}
          >
            {texts[0]}
          </Typography>
          <Typography
            variant="body2"
            onClick={() => window.location.reload()}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
              textDecoration: 'underline',
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {texts[1]}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <ButtonLayout ml="auto">
          <Button
            text={messages.BACK}
            onClick={handleGoBack}
            variant="contained"
            color="secondary"
            size="large"
          />
          <Button
            text={messages.INSTALL_METAMASK}
            onClick={handleInstallMetaMask}
            variant="contained"
            size="large"
          />
        </ButtonLayout>
      </Box>
    </Modal>
  )
}

export default InstallMetaMaskModal
