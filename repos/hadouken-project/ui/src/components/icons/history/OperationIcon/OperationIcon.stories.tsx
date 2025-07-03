import React, { ComponentProps } from 'react'

import { OperationStatus } from '@interfaces/core'
import Paper from '@mui/material/Paper'
import { StoryObj } from '@storybook/react'

import OperationIcon from './OperationIcon.component'

export default {
  title: 'Components/Icons/OperationIcon',
  description: '',
  component: OperationIcon,
}

type Story = StoryObj<ComponentProps<typeof OperationIcon>>

const Template: Story = {
  render: (args) => (
    <Paper>
      <OperationIcon {...args} />
    </Paper>
  ),
}

export const Waiting = { ...Template }

Waiting.args = {
  status: OperationStatus.Waiting,
}

export const Aborted = { ...Template }

Aborted.args = {
  status: OperationStatus.Aborted,
}

export const Fail = { ...Template }

Fail.args = {
  status: OperationStatus.Fail,
}

export const Success = { ...Template }

Success.args = {
  status: OperationStatus.Success,
}

export const Pending = { ...Template }

Pending.args = {
  status: OperationStatus.Pending,
}
