import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import HistoryBadge from './HistoryBadge.component'

export default {
  title: 'Components/History/HistoryBadge',
  description: '',
  component: HistoryBadge,
}

const Template: Story<ComponentProps<typeof HistoryBadge>> = (args) => (
  <Box p={2}>
    <HistoryBadge {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  operationsInProgress: 5,
}
