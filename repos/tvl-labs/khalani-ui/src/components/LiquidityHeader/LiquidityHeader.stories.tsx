import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import LiquidityHeader from './LiquidityHeader.component'

export default {
  title: 'Components/LiquidityHeader',
  description: '',
  component: LiquidityHeader,
}

const Template: Story<ComponentProps<typeof LiquidityHeader>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Paper
      elevation={1}
      sx={{ p: 2, display: 'flex', justifyContent: 'center' }}
    >
      <LiquidityHeader {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tokenSymbols: ['USDC'],
  chainId: 11155111,
}

export const CALP = Template.bind({})

CALP.args = {
  tokenSymbols: ['USDC', 'USDT', 'KAI'],
  chainId: 11155111,
}
