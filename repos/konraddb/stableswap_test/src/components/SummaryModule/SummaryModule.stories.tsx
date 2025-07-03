import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'
import { tokens } from '@tests//tokens'

import SummaryModule from './SummaryModule.component'

export default {
  title: 'Components/SummaryModule',
  description: '',
  component: SummaryModule,
}

const Template: Story<ComponentProps<typeof SummaryModule>> = (args) => (
  <Box height={1000}>
    <SummaryModule {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  title: 'Deposit summary:',
  description: 'Presented values have slippage applied.',
  sendLabel: 'You deposit',
  receiveLabel: 'Your share',
  sendTokens: [
    {
      id: tokens[0].id,
      symbol: tokens[0].symbol,
      displayValue: '10.52',
    },
    {
      id: tokens[1].id,
      symbol: tokens[1].symbol,
      displayValue: '321.12',
    },
  ],
  receiveTokens: [
    {
      id: tokens[2].id,
      symbol: tokens[2].symbol,
      displayValue: '5.23',
    },
  ],
  sendAdditionalLabel: 'The maximum slippage for the operation is 0.5%.',
}
