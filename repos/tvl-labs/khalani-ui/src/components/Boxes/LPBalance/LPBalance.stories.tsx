import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import LPBalance from './LPBalance.component'

export default {
  title: 'Components/Boxes/LPBalance',
  description: '',
  component: LPBalance,
}

const Template: Story<ComponentProps<typeof LPBalance>> = (args) => (
  <Container sx={{ mt: 5, width: 500 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <LPBalance {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  gasPayment: BigInt(1053350000),
  label: 'Your new LP Balance:',
  balance: '451.21',
  tokenSymbols: ['USDC.Avax', 'KAI'],
  poolShare: '0.0031',
  isPoolShare: true,
  isLoading: false,
}
