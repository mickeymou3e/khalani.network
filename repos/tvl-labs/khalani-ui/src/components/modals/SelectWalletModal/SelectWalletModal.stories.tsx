import React, { ComponentProps, useState } from 'react'

import Button from '@components/buttons/Button'
import { WalletType } from '@interfaces/wallet'
import { Box, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import SelectWalletModal from './SelectWalletModal.component'

export default {
  title: 'Components/Modals/SelectWalletModal',
  description: '',
  component: SelectWalletModal,
}

const Template: Story<ComponentProps<typeof SelectWalletModal>> = (args) => {
  const [open, setOpen] = useState(true)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChainSelect = (type: WalletType) => console.log(type)

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <SelectWalletModal
          open={open}
          onClose={handleClose}
          wallets={args.wallets}
          onWalletSelect={handleChainSelect}
        />
      </Paper>
      <Box>
        <Button onClick={handleClickOpen} text="open" />
      </Box>
    </>
  )
}

const wallets = [
  { id: 1, name: 'MetaMask', type: WalletType.METAMASK },
  { id: 2, name: 'WalletConnect', type: WalletType.WALLETCONNECT },
]

export const Basic = Template.bind({})

Basic.args = {
  wallets,
}
