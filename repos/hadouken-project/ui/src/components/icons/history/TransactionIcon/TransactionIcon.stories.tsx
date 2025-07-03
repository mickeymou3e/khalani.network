import React, { ComponentProps } from 'react'

import { TransactionStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import TransactionIcon from './TransactionIcon.component'

export default {
  title: 'Components/Icons/TransactionIcon',
  description: '',
  component: TransactionIcon,
}

type Story = StoryObj<ComponentProps<typeof TransactionIcon>>

const Template: Story = {
  render: (args) => (
    <Box p={2} width={250}>
      <TransactionIcon {...args} />
    </Box>
  ),
}

export const Pending = { ...Template }

Pending.args = {
  status: TransactionStatus.Pending,
}

export const Fail = { ...Template }

Fail.args = {
  status: TransactionStatus.Fail,
}

export const Success = { ...Template }

Success.args = {
  status: TransactionStatus.Success,
}
