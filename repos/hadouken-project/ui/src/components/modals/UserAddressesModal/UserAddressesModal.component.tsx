import React from 'react'

import { ExplorerBox } from '@components/account/ExplorerBox'
import ButtonLayout from '@components/buttons/ButtonLayout'
import { CloseIcon } from '@components/icons'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { Button, Divider, IconButton } from '@mui/material'
import Box from '@mui/material/Box'

import { messages } from './UserAddressesModal.messages'
import { IUserAddressesModal } from './UserAddressesModal.types'

const UserAddressesModal: React.FC<IUserAddressesModal> = ({
  open,
  title = messages.TITLE,
  addresses,
  handleClose,
  onLogout,
}) => (
  <Modal open={open} handleClose={handleClose}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <ModalHeader title={title} />
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    <Box minWidth={200}>
      <Box pt={3}>
        {addresses.map((item, index) => (
          <Box width={{ xs: 'auto', md: 368 }} key={index}>
            <ExplorerBox
              address={item.address}
              networkName={item.networkName}
              explorers={item.explorers}
            />
            <Divider />
          </Box>
        ))}
      </Box>
    </Box>
    <ButtonLayout mt={{ xs: 'auto', md: 1 }}>
      <Button fullWidth onClick={handleClose} variant="outlined" size="medium">
        Close window
      </Button>
      <Button fullWidth onClick={onLogout} variant="contained" size="medium">
        Logout
      </Button>
    </ButtonLayout>
  </Modal>
)

export default UserAddressesModal
