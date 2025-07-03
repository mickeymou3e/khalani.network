import React, { ComponentProps } from 'react'

import { decimalValue } from '@constants/balances'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import LendingTokenBox from './LendingTokenBox.component'

export default {
  title: 'Components/lending/LendingTokenBox',
  description: '',
  component: LendingTokenBox,
}

const Template: Story<ComponentProps<typeof LendingTokenBox>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Paper elevation={2} sx={{ p: 2, width: 350 }}>
      <LendingTokenBox {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tokenSymbol: 'stkBUSD',
  mintCap: BigInt(101) * decimalValue,
  minDebt: BigInt(2000) * decimalValue,
  oneTimeFee: BigInt(1) * decimalValue,
  collateral: BigInt(3000) * decimalValue,
  currentDebt: BigInt(2500) * decimalValue,
  ltv: BigInt(25) * decimalValue,
  decimals: 18,
  onClick: (tokenSymbol: string) => console.log(tokenSymbol),
}

export const NoLoan = Template.bind({})

NoLoan.args = {
  tokenSymbol: 'stkUSDT',
  mintCap: BigInt(101) * decimalValue,
  minDebt: BigInt(2000) * decimalValue,
  oneTimeFee: BigInt(4) * BigInt(10) ** BigInt(16),
  ltv: BigInt(0),
  decimals: 18,
  onClick: (tokenSymbol: string) => console.log(tokenSymbol),
}
