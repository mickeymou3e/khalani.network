import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import Button from '@components/buttons/Button'
import { Box, Paper, Typography } from '@mui/material'
import { StoryObj } from '@storybook/react'

import TokenSelectorDialog from './TokenSelectorModal.component'

export default {
  title: 'Components/Modals/TokenSelectorModal',
  description: '',
  component: TokenSelectorDialog,
}

type Story = StoryObj<ComponentProps<typeof TokenSelectorDialog>>

const Template: Story = {
  render: (args) => {
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
            onTokenSelect={setToken}
            selectedToken={token}
          />
        </Paper>
        <Box>
          <Button onClick={handleClickOpen} text="open" />
          <Typography>{token.displayName}</Typography>
        </Box>
      </>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {
  tokens: [
    {
      id: '1',
      symbol: 'usdc',
      name: 'usdc',
      decimals: 6,
      address: '',
      balance: BigNumber.from('1000000'),
      displayName: 'USDC',
      source: 'ce',
    },
    {
      id: '2',
      symbol: 'dai',
      name: 'dai',
      decimals: 18,
      address: '',
      balance: BigNumber.from('1000000000000000000'),
      displayName: 'DAI',
      source: 'bsc',
    },
    {
      id: '3',
      symbol: 'usdt',
      name: 'usdt',
      decimals: 18,
      address: '',
      balance: BigNumber.from('1000000000000000000'),
      displayName: 'USDT',
      source: 'eth',
    },
    {
      id: '4',
      symbol: 'usdt',
      name: 'usdt',
      decimals: 18,
      address: '',
      balance: BigNumber.from('1000000000000000000'),
      displayName: 'ceUSDT',
      source: 'ce',
    },
  ],
}
