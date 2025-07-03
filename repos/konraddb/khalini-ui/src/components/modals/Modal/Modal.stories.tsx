import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import Modal from './'

export default {
  title: 'Components/Modals/Modal',
  description: '',
  component: Modal,
}

const Template: Story<ComponentProps<typeof Modal>> = (args) => (
  <Box>
    <Modal {...args}>
      <Box textAlign="center" height={500} width={500} p={3}>
        <h2>Header</h2>
        <p>Paragraph.</p>
      </Box>
    </Modal>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  open: true,
}
