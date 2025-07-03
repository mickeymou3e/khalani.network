import React from 'react'

import Button from '@components/buttons/Button'
import ButtonLayout from '@components/buttons/ButtonLayout/ButtonLayout.component'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
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
      <ModalHeader title={title} />
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        <Box
          height="100%"
          alignItems="start"
          display="flex"
          flexDirection="column"
        >
          <Box mt={2}>
            <Typography
              textAlign="start"
              variant="caption"
              color={(theme) => theme.palette.text.gray}
            >
              {texts[0]}
            </Typography>
            <Typography
              variant="caption"
              onClick={() => window.location.reload()}
              sx={{
                '&:hover': {
                  textDecoration: 'underline',
                  cursor: 'pointer',
                },
                fontWeight: 'bold',
                color: (theme) => theme.palette.text.quaternary,

                margin: (theme) => theme.spacing(0, 0.5),
              }}
            >
              {texts[1]}
            </Typography>
          </Box>
        </Box>
        <ButtonLayout mt={{ xs: 'auto', md: 3 }}>
          <Button
            text={messages.BACK}
            sx={{ width: '100%' }}
            onClick={handleGoBack}
            variant="outlined"
            size="medium"
          />
          <Button
            text={messages.INSTALL_METAMASK}
            sx={{ width: '100%' }}
            onClick={handleInstallMetaMask}
            variant="contained"
            size="medium"
          />
        </ButtonLayout>
      </Box>
    </Modal>
  )
}

export default InstallMetaMaskModal
