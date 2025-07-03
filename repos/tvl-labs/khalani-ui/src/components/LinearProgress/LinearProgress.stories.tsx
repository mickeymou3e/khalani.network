import React, { ComponentProps } from 'react'

import { decimalValue } from '@constants/balances'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import LinearProgress from './LinearProgress.component'

export default {
  title: 'Components/LinearProgress',
  description: '',
}

const Template: Story<ComponentProps<typeof LinearProgress>> = (args) => (
  <Container sx={{ mt: 5, width: 500 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <LinearProgress {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  value: BigInt(50) * decimalValue,
  decimals: 18,
}

export const WithRisk = Template.bind({})

WithRisk.args = {
  value: BigInt(80) * decimalValue,
  decimals: 18,
}
