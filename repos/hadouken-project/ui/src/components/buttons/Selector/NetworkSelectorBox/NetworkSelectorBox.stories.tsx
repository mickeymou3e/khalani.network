import React, { ComponentProps } from 'react'

import { Box, Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import NetworkSelectorBox from './NetworkSelectorBox.component'

export default {
  title: 'Components/Buttons/Selector/NetworkSelectorBox',
  description: '',
  component: NetworkSelectorBox,
}

type Story = StoryObj<ComponentProps<typeof NetworkSelectorBox>>

const Template: Story = {
  render: (args) => {
    return <NetworkSelectorBox {...args} />
  },
}

const TemplateModal: Story = {
  render: (args) => {
    return (
      <Paper>
        <Box width={300}>
          <NetworkSelectorBox {...args} />
        </Box>
      </Paper>
    )
  },
}

export const Basic = { ...Template }
export const LongChainName = { ...TemplateModal }

Basic.args = {
  from: 'Ethereum',
  to: 'Godwoken',
  description: 'PW bridge',
}

LongChainName.args = {
  from: 'Binance Smart Chain',
  to: 'Godwoken',
  description: 'PW bridge',
}
