import React, { ComponentProps } from 'react'

import { TransactionStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import TransactionIcon from './TransactionIcon.component'

export default {
  title: 'Components/Icons/TransactionIcon',
  description: '',
  component: TransactionIcon,
}

const Template: Story<ComponentProps<typeof TransactionIcon>> = (args) => (
  <Box p={2} width={250}>
    <TransactionIcon {...args} />
  </Box>
)

export const Pending = Template.bind({})

Pending.args = {
  status: TransactionStatus.Pending,
}

export const Fail = Template.bind({})

Fail.args = {
  status: TransactionStatus.Fail,
}

export const Success = Template.bind({})

Success.args = {
  status: TransactionStatus.Success,
}
