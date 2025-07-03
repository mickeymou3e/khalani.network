import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import JazzIcon from './JazzIcon.component'

export default {
  title: 'Components/Icons/JazzIcon',
  description: '',
  component: JazzIcon,
}

type Story = StoryObj<ComponentProps<typeof JazzIcon>>

const Template: Story = {
  render: (args) => (
    <Box p={2}>
      <JazzIcon {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  address: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
}
