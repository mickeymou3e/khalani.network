import React, { ComponentProps } from 'react'

import { ETransactionStatus as TransactionStatusEnum } from '@interfaces/core'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TransactionStatus from './TransactionStatus.component'

export default {
  title: 'Components/Boxes/TransactionStatus',
  description: '',
  component: TransactionStatus,
}

const Template: Story<ComponentProps<typeof TransactionStatus>> = (args) => (
  <Container sx={{ mt: 5, width: 500 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <TransactionStatus {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  status: TransactionStatusEnum.Success,
  progress: 50n,
  statusText: 'Success',
}

export const Pending = Template.bind({})

Pending.args = {
  status: TransactionStatusEnum.Pending,
  progress: 50n,
  statusText: 'Pending',
}

export const PendingWithTooltip = Template.bind({})

PendingWithTooltip.args = {
  status: TransactionStatusEnum.Pending,
  progress: 50n,
  statusText: 'Pending',
  isTooltipVisible: true,
}

export const Fail = Template.bind({})

Fail.args = {
  status: TransactionStatusEnum.Fail,
  progress: 50n,
  statusText: 'Failed',
  errorMessage: 'Error message',
}
