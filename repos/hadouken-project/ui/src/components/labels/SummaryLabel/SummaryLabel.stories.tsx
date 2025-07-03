import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { StoryObj } from '@storybook/react'

import SummaryLabel from './SummaryLabel.component'

export default {
  title: 'Components/labels/SummaryLabel',
  description: '',
  component: SummaryLabel,
}

type Story = StoryObj<ComponentProps<typeof SummaryLabel>>

const Template: Story = {
  render: (args) => (
    <Box p={2}>
      <SummaryLabel {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  label: 'test message 123 345 567',
  value: 'test',
  disabled: false,
}

export const WithBorder = { ...Template }

WithBorder.args = {
  label: 'test message 123 345 567',
  value: 'test',
  showTopBorder: true,
  disabled: false,
}

export const WithBoxItem = { ...Template }

WithBoxItem.args = {
  label: 'todo asd asd asd asd ',
  value: <Box height={55}> TEST</Box>,
  showTopBorder: true,
  disabled: false,
}
