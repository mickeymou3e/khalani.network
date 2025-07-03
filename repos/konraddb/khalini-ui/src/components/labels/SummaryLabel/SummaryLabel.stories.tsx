import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import SummaryLabel from './SummaryLabel.component'

export default {
  title: 'Components/labels/SummaryLabel',
  description: '',
  component: SummaryLabel,
}

const Template: Story<ComponentProps<typeof SummaryLabel>> = (args) => (
  <Box p={2}>
    <SummaryLabel {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'test message 123 345 567',
  value: 'test',
}

export const WithBorder = Template.bind({})

WithBorder.args = {
  label: 'test message 123 345 567',
  value: 'test',
  showTopBorder: true,
}

export const WithBoxItem = Template.bind({})

WithBoxItem.args = {
  label: 'todo asd asd asd asd ',
  value: <Box height={55}> TEST</Box>,
  showTopBorder: true,
}
