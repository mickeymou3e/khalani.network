import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TransactionHistory from './TransactionHistory.component'
import { TransactionType } from './TransactionHistory.types'

export default {
  title: 'Components/TransactionHistory',
  description: '',
  component: TransactionHistory,
}

const onClick = (transactionHash: string) => {
  console.log(transactionHash)
}

const Template: Story<ComponentProps<typeof TransactionHistory>> = (args) => (
  <Container
    maxWidth="md"
    sx={{ mt: 5, position: 'relative', width: 500, height: 400 }}
  >
    <Paper elevation={2} sx={{ px: 2, py: 4 }}>
      <TransactionHistory {...args}></TransactionHistory>
    </Paper>
  </Container>
)

export const transactions = [
  {
    id: '1',
    type: TransactionType.BRIDGE,
    time: '3h',
    sourceTokens: [{ symbol: 'USDC', network: '0x61' }],
    amounts: [BigInt(243000066)],
    destinationToken: { symbol: 'USDT', network: '0x61' },
    hash: '0x',
  },
  {
    id: '2',
    type: TransactionType.APPROVE,
    time: '1d',
    sourceTokens: [{ symbol: 'USDC', network: '0x61' }],
    amounts: [BigInt(245000066)],
    hash: '0x',
  },
  {
    id: '3',
    type: TransactionType.PROVIDE_LIQUIDITY,
    time: '3h',
    sourceTokens: [
      { symbol: 'USDC', network: '0x61' },
      { symbol: 'USDT', network: '0x61' },
    ],
    amounts: [BigInt(243000066), BigInt(243000066)],
    hash: '0x',
  },
]

export const Basic = Template.bind({})

Basic.args = {
  transactions,
  onClick,
}
