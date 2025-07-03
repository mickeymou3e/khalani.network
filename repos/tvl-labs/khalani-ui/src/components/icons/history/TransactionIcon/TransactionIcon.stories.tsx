import React, { ComponentProps } from 'react'

import { ETransactionStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import TransactionIcon from './TransactionIcon.component'

// export default {
//   title: 'Components/Icons/TransactionIcon',
//   description: '',
//   component: TransactionIcon,
// }

export default { component: TransactionIcon }
const Template: Story<ComponentProps<typeof TransactionIcon>> = (args) => (
  <Box p={2} width={250}>
    <TransactionIcon {...args} />
  </Box>
)

export const Pending = Template.bind({})

Pending.args = {
  status: ETransactionStatus.Pending,
}

export const Fail = Template.bind({})

Fail.args = {
  status: ETransactionStatus.Fail,
}

export const Success = Template.bind({})

Success.args = {
  status: ETransactionStatus.Success,
}
