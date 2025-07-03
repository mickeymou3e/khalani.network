import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Paragraph from './Paragraph.component'

export default {
  title: 'Components/Paragraph',
  description: '',
  component: Paragraph,
}

type Story = StoryObj<ComponentProps<typeof Paragraph>>

const Template: Story = {
  render: (args) => (
    <Paper>
      <Paragraph title="123" {...args} />
    </Paper>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  title: `Example title`,
  description: `Example description`,
}
