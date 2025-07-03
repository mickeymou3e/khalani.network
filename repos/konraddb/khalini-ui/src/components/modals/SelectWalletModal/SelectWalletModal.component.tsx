import React from 'react'

import Button from '@components/buttons/Button'
import ButtonLayout from '@components/buttons/ButtonLayout'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { testIds } from '@utils/dataTestIds'

import { messages } from './SelectWalletModal.messages'
import { ISelectWalletModalProps } from './SelectWalletModal.types'

const SelectWalletModal: React.FC<ISelectWalletModalProps> = ({
  open,
  title = messages.TITLE,
  description = messages.DESCRIPTION,
  handleClose,
  metaMaskSelected,
}) => (
  <Modal open={open} handleClose={handleClose}>
    <ModalHeader title={title} />
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <Box
        height="100%"
        justifyContent="center"
        display="flex"
        flexDirection="column"
      >
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

      <ButtonLayout mt={{ xs: 'auto', md: 3 }}>
        <Button
          onClick={handleClose}
          sx={{ width: '100%' }}
          variant="text"
          size="medium"
          text={messages.DISMISS}
        />
        <Button
          data-testid={testIds.CONNECT_METAMASK}
          sx={{ width: '100%' }}
          variant="contained"
          size="medium"
          text="MetaMask"
          onClick={metaMaskSelected}
        />
      </ButtonLayout>
    </Box>
  </Modal>
)

export default SelectWalletModal
