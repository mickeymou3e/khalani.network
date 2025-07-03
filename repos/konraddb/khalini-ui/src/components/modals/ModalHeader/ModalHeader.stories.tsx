import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import ModalHeader from './'

export default {
  title: 'Components/Modals/ModalHeader',
  description: '',
  component: ModalHeader,
}

const Template: Story<ComponentProps<typeof ModalHeader>> = (args) => (
  <Box width={500} height={300} p={2}>
    <ModalHeader {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  title: `Example title`,
}
