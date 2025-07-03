import React, { ComponentProps, useState } from 'react'

import { transactions } from '@components/TransactionHistory/TransactionHistory.stories'
import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import UserAddressesModal from './UserAddressesModal.component'
import { tokenBalancesAcrossChains } from './UserAddressesModal.constants'

export default {
  title: 'Components/Modals/UserAddressesModal',
  description: '',
  component: UserAddressesModal,
}

const Template: Story<ComponentProps<typeof UserAddressesModal>> = (args) => {
  const [open, setOpen] = useState(true)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box>
      <Button text="Open" onClick={handleClickOpen} />
      <UserAddressesModal
        title="Account"
        {...args}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  open: true,
  handleDisconnectWallet: () => true,
  accountAddress: '0x40c965c7C7AAb323D322EA3f953B6894481A66f7',
  accountBalance: BigInt(55000000),
  tokenBalancesAcrossChains,
  isFetchingBalances: true,
  transactions,
  onClick: () => true,
}
