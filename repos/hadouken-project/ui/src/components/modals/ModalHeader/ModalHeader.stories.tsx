import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import ModalHeader from './'

export default {
  title: 'Components/Modals/ModalHeader',
  description: '',
  component: ModalHeader,
}

type Story = StoryObj<ComponentProps<typeof ModalHeader>>

const Template: Story = {
  render: (args) => (
    <Box width={500} height={300} p={2}>
      <ModalHeader {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  title: `Example title`,
}
