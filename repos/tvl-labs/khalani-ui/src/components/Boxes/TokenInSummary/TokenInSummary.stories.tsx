import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react'

import TokenInSummary from './TokenInSummary.component'

export default {
  title: 'Components/Boxes/TokenInSummary',
  description: '',
  component: TokenInSummary,
}

const Template: Story<ComponentProps<typeof TokenInSummary>> = (args) => (
  <Container sx={{ mt: 5, width: 500 }}>
    <TokenInSummary {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  symbol: 'USDT.Avax',
  amount: '512.12',
  amountUSD: '512.12',
  hideUSDValues: false,
}
