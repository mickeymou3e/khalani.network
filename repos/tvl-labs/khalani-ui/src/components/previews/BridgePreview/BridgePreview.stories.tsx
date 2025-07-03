import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react'

import BridgePreview from './BridgePreview.component'

export default {
  title: 'Components/Previews/BridgePreview',
  description: '',
  component: BridgePreview,
}

const Template: Story<ComponentProps<typeof BridgePreview>> = (args) => (
  <Paper sx={{ p: 2, m: 2 }} elevation={2}>
    <BridgePreview {...args} />
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  tokens: [
    { symbol: 'USDT.Avax', amount: '1.23', amountUSD: '1.24', chainId: '0x1' },
    {
      symbol: 'USDC.sepolia',
      amount: '1.23',
      amountUSD: '1.24',
      chainId: '0x1',
    },
  ],
}
