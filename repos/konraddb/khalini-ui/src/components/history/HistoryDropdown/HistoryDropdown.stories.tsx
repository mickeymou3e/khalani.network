import React, { ComponentProps } from 'react'

import { OperationStatus, TransactionStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import HistoryDropdown from './HistoryDropdown.component'

export default {
  title: 'Components/History/HistoryDropdown',
  description: '',
  component: History,
}

const Template: Story<ComponentProps<typeof HistoryDropdown>> = (args) => (
  <Box width={420}>
    <HistoryDropdown {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  title: 'Deposit',
  status: TransactionStatus.Pending,
  date: new Date(Date.now()),
  open: true,
  operations: [
    {
      id: '1',
      title: 'Approve token transfer',
      description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
      status: OperationStatus.Success,
    },
    {
      id: '2',
      title: 'Approve token transfer',
      status: OperationStatus.Pending,
      description:
        'The operation allow contract to transfer 1.00 USDT tokens to 3pool contract',
    },
    {
      id: '3',
      title: 'Approve token transfer',
      status: OperationStatus.Waiting,
      description:
        'The operation allow contract to transfer 1.00 USDT tokens to 3pool contract',
    },

    {
      id: '4',
      title: 'Aborted',
      status: OperationStatus.Aborted,
      description:
        'The operation allow contract to transfer 1.00 USDT tokens to 3pool contract',
    },

    {
      id: '5',
      title: 'Fail',
      status: OperationStatus.Fail,
      description:
        'The operation allow contract to transfer 1.00 USDT tokens to 3pool contract',
    },
  ],
}
