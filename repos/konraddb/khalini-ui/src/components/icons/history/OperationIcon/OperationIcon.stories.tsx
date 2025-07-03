import React, { ComponentProps } from 'react'

import { OperationStatus } from '@interfaces/core'
import Paper from '@mui/material/Paper'
import { Story } from '@storybook/react/types-6-0'

import OperationIcon from './OperationIcon.component'

export default {
  title: 'Components/Icons/OperationIcon',
  description: '',
  component: OperationIcon,
}

const Template: Story<ComponentProps<typeof OperationIcon>> = (args) => (
  <Paper>
    <OperationIcon {...args} />
  </Paper>
)

export const Waiting = Template.bind({})

Waiting.args = {
  status: OperationStatus.Waiting,
}

export const Aborted = Template.bind({})

Aborted.args = {
  status: OperationStatus.Aborted,
}

export const Fail = Template.bind({})

Fail.args = {
  status: OperationStatus.Fail,
}

export const Success = Template.bind({})

Success.args = {
  status: OperationStatus.Success,
}

export const Pending = Template.bind({})

Pending.args = {
  status: OperationStatus.Pending,
}
