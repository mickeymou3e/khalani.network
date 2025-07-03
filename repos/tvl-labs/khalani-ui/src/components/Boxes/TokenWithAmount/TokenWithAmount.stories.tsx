import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TokenWithAmount from './TokenWithAmount.component'

export default {
  title: 'Components/Boxes/TokenWithAmount',
  description: '',
  component: TokenWithAmount,
}

const Template: Story<ComponentProps<typeof TokenWithAmount>> = (args) => (
  <Container sx={{ mt: 5, width: 500 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <TokenWithAmount {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  symbol: 'USDT',
  balance: '512.12',
}

export const TooltipVisible = Template.bind({})

TooltipVisible.args = {
  symbol: 'USDT',
  balance: '512.12',
  isTooltipVisible: true,
}
