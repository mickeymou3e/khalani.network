import React, { ComponentProps, useState } from 'react'

import Button from '@components/buttons/Button'
import { balances } from '@constants/balances'
import { Box, Paper, Typography } from '@mui/material'
import { Story } from '@storybook/react'

import TokenSelectorDialog from './TokenSelectorModal.component'

export default {
  title: 'Components/Modals/TokenSelectorModal',
  description: '',
  component: TokenSelectorDialog,
}

const Template: Story<ComponentProps<typeof TokenSelectorDialog>> = (args) => {
  const [open, setOpen] = useState(true)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const [token, setToken] = useState(args.tokens[1])

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <TokenSelectorDialog
          open={open}
          onClose={handleClose}
          tokens={args.tokens}
          balances={args.balances}
          onTokenSelect={setToken}
          selectedToken={token}
          hideBalances={args.hideBalances}
        />
      </Paper>
      <Box>
        <Button onClick={handleClickOpen} text="open" />
        <Typography>{token.name}</Typography>
      </Box>
    </>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tokens: [
    {
      id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF420',
      symbol: 'usdc',
      name: 'usdc',
      decimals: 6,
      address: '',
      balance: BigInt('1000000'),
      chainId: '0x5',
    },
    {
      id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
      symbol: 'dai',
      name: 'dai',
      decimals: 18,
      address: '',
      balance: BigInt('1000000000000000000'),
      chainId: '0x5',
    },
    {
      id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
      symbol: 'usdt',
      name: 'usdt',
      decimals: 18,
      address: '',
      balance: BigInt('1000000000000000000'),
    },
  ],
  balances,
  hideBalances: true,
}
