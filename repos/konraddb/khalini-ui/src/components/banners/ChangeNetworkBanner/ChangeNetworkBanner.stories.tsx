import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import ChangeNetworkBanner from './ChangeNetworkBanner.component'

export default {
  title: 'Components/Banners/ChangeNetworkBanner',
  description: '',
  component: ChangeNetworkBanner,
}

const Template: Story<ComponentProps<typeof ChangeNetworkBanner>> = (args) => (
  <Box>
    <ChangeNetworkBanner {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {}
