import React, { ComponentProps } from 'react'

import { OperationStatus } from '@interfaces/core'
import Paper from '@mui/material/Paper'
import { StoryObj } from '@storybook/react'

import HistoryItem from './HistoryItem.component'

export default {
  title: 'Components/History/HistoryItem',
  description: '',
  component: History,
}

type Story = StoryObj<ComponentProps<typeof HistoryItem>>

const Template: Story = {
  render: (args) => (
    <Paper>
      <HistoryItem {...args} />
    </Paper>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  title: 'Approve token transfer',
  description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
  status: OperationStatus.Success,
}
