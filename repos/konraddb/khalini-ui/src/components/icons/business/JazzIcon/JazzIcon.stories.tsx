import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import JazzIcon from './JazzIcon.component'

export default {
  title: 'Components/Icons/JazzIcon',
  description: '',
  component: JazzIcon,
}

const Template: Story<ComponentProps<typeof JazzIcon>> = (args) => (
  <Box p={2}>
    <JazzIcon {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  address: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
}
