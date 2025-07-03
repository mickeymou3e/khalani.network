import React, { ComponentProps } from 'react'

import { decimalValue } from '@constants/balances'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import MarketInfoBox from './MarketInfoBox.component'

export default {
  title: 'Components/lending/MarketInfoBox',
  description: '',
  component: MarketInfoBox,
}

const Template: Story<ComponentProps<typeof MarketInfoBox>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Paper sx={{ p: 2, width: 400 }}>
      <MarketInfoBox {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tokenSymbol: 'stkBUSD',
  collateral: BigInt(3000) * decimalValue,
  currentDebt: BigInt(2500) * decimalValue,
  ltv: BigInt(25) * decimalValue,
  tokenPrice: BigInt(1) * decimalValue,
  availableToBorrow: BigInt(12) * decimalValue,
  decimals: 18,
}

export const NoLoan = Template.bind({})

NoLoan.args = {
  tokenSymbol: 'stkUSDT',
  ltv: BigInt(0),
  tokenPrice: BigInt(1) * decimalValue,
  availableToBorrow: BigInt(12) * decimalValue,
  decimals: 18,
}
