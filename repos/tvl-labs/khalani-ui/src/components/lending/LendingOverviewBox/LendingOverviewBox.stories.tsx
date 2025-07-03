import React, { ComponentProps } from 'react'

import { decimalValue } from '@constants/balances'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import LendingOverviewBox from './LendingOverviewBox.component'

export default {
  title: 'Components/lending/LendingOverviewBox',
  description: '',
  component: LendingOverviewBox,
}

const Template: Story<ComponentProps<typeof LendingOverviewBox>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <LendingOverviewBox {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'Total Value Locked',
  value: BigInt(5054) * decimalValue,
  decimals: 18,
}

export const WithKaiIcon = Template.bind({})

WithKaiIcon.args = {
  label: 'Total Debt',
  value: BigInt(5054) * decimalValue,
  decimals: 18,
  kaiIconVisible: true,
  darkTheme: true,
}

export const DarkTheme = Template.bind({})

DarkTheme.args = {
  label: 'My Collateral',
  value: BigInt(5054) * decimalValue,
  decimals: 18,
  darkTheme: true,
}
