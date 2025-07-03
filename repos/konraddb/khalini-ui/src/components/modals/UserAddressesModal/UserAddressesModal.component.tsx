import React from 'react'

import { ExplorerBox } from '@components/account/ExplorerBox'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box'

import { messages } from './UserAddressesModal.messages'
import { IUserAddressesModal } from './UserAddressesModal.types'

const UserAddressesModal: React.FC<IUserAddressesModal> = ({
  open,
  title = messages.TITLE,
  addresses,
  handleClose,
}) => (
  <Modal open={open} handleClose={handleClose}>
    <ModalHeader title={title} />
    <Box minWidth={200} pb={2}>
      <Box pt={3}>
        {addresses.map((item) => (
          <Box width={{ xs: 'auto', md: 368 }} pb={1} key={item.address}>
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
    <Button fullWidth onClick={handleClose} variant="contained" size="medium">
      Close window
    </Button>
  </Modal>
)

export default UserAddressesModal
