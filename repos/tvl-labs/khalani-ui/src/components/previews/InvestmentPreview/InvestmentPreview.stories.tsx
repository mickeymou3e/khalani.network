import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react'

import InvestmentPreview from './InvestmentPreview.component'

export default {
  title: 'Components/Previews/InvestmentPreview',
  description: '',
  component: InvestmentPreview,
}

const Template: Story<ComponentProps<typeof InvestmentPreview>> = (args) => (
  <Paper sx={{ p: 2, m: 2 }} elevation={2}>
    <InvestmentPreview {...args} />
  </Paper>
)

export const investmentPreviewProps = {
  title: 'Confirm providing liquidity',
  label: 'You are providing:',
  tokenSymbols: ['USDC.Avax'],
  poolShare: '0.0031',
  outputAmount: '1.25',
  tokens: [
    { symbol: 'USDT.Avax', amount: '1.23', amountUSD: '1.24', chainId: '0x1' },
  ],
}

export const Basic = Template.bind({})

Basic.args = {
  ...investmentPreviewProps,
}
