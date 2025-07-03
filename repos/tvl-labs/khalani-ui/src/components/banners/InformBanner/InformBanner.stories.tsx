import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import InformBanner from './InformBanner.component'

export default {
  title: 'Components/Banners/InformBanner',
  description: '',
  component: InformBanner,
}

const Template: Story<ComponentProps<typeof InformBanner>> = (args) => (
  <Box>
    <InformBanner {...args}></InformBanner>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  text: 'Please change network before proceeding',
}
