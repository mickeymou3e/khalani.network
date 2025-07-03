import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import Modal from './'

export default {
  title: 'Components/Modals/Modal',
  description: '',
  component: Modal,
}

type Story = StoryObj<ComponentProps<typeof Modal>>

const Template: Story = {
  render: (args) => (
    <Box>
      <Modal {...args}>
        <Box textAlign="center" height={500} width={500} p={3}>
          <h2>Header</h2>
          <p>Paragraph.</p>
        </Box>
      </Modal>
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  open: true,
}
