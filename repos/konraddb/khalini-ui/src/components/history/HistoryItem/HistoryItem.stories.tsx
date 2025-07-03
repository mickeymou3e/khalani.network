import React, { ComponentProps } from 'react'

import { OperationStatus } from '@interfaces/core'
import Paper from '@mui/material/Paper'
import { Story } from '@storybook/react/types-6-0'

import HistoryItem from './HistoryItem.component'

export default {
  title: 'Components/History/HistoryItem',
  description: '',
  component: History,
}

const Template: Story<ComponentProps<typeof HistoryItem>> = (args) => (
  <Paper>
    <HistoryItem {...args} />
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  title: 'Approve token transfer',
  description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
  status: OperationStatus.Success,
}
