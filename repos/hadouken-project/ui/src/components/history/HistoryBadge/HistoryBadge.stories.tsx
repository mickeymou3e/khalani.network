import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import HistoryBadge from './HistoryBadge.component'

export default {
  title: 'Components/History/HistoryBadge',
  description: '',
  component: HistoryBadge,
}

type Story = StoryObj<ComponentProps<typeof HistoryBadge>>

const Template: Story = {
  render: (args) => (
    <Box p={2}>
      <HistoryBadge {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  operationsInProgress: 5,
}
