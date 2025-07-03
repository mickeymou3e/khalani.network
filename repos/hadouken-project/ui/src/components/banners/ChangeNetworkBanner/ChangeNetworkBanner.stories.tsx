import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import ChangeNetworkBanner from './ChangeNetworkBanner.component'

export default {
  title: 'Components/Banners/ChangeNetworkBanner',
  description: '',
  component: ChangeNetworkBanner,
}

type Story = StoryObj<ComponentProps<typeof ChangeNetworkBanner>>

const Template: Story = {
  render: (args) => (
    <Box>
      <ChangeNetworkBanner {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {}
