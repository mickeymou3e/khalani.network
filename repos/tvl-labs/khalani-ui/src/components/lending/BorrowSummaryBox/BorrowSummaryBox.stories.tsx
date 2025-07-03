import React, { ComponentProps } from 'react'

import { decimalValue } from '@constants/balances'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import BorrowSummaryBox from './BorrowSummaryBox.component'

export default {
  title: 'Components/lending/BorrowSummaryBox',
  description: '',
  component: BorrowSummaryBox,
}

const Template: Story<ComponentProps<typeof BorrowSummaryBox>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Paper elevation={2} sx={{ p: 2, width: 400 }}>
      <BorrowSummaryBox {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  loan: BigInt(10) * decimalValue,
  newLoan: BigInt(50) * decimalValue,
  totalDebt: BigInt(1220) * decimalValue,
  newTotalDebt: BigInt(1520) * decimalValue,
  liquidationPrice: BigInt(5) * decimalValue,
  newLiquidationPrice: BigInt(7) * decimalValue,
  fee: BigInt(10) * decimalValue,
  decimals: 18,
}

export const UndefinedValues = Template.bind({})

UndefinedValues.args = {
  decimals: 18,
}

export const WithoutNewValues = Template.bind({})

WithoutNewValues.args = {
  loan: BigInt(10) * decimalValue,
  totalDebt: BigInt(1220) * decimalValue,
  liquidationPrice: BigInt(5) * decimalValue,
  fee: BigInt(10) * decimalValue,
  decimals: 18,
}
