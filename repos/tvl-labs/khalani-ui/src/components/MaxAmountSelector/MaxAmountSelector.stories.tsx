import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import MaxAmountSelector from './'

export default {
  title: 'Components/MaxAmountSelector',
  description: '',
  component: MaxAmountSelector,
}

const Template: Story<ComponentProps<typeof MaxAmountSelector>> = (args) => (
  <Container sx={{ width: 500, mt: 4 }}>
    <Paper elevation={2} sx={{ py: 5, px: 2 }}>
      <MaxAmountSelector {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  decimals: 18,
  maxAmount: BigInt('10000050567540000000000053'),
  isFetchingMaxAmount: false,
  symbol: 'USDC',
}
