import React, { ComponentProps } from 'react'

import { Box, Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import NetworkSelectorBox from './NetworkSelectorBox.component'

export default {
  title: 'Components/Buttons/Selector/NetworkSelectorBox',
  description: '',
  component: NetworkSelectorBox,
}

const Template: Story<ComponentProps<typeof NetworkSelectorBox>> = (args) => {
  return <NetworkSelectorBox {...args} />
}

const TemplateModal: Story<ComponentProps<typeof NetworkSelectorBox>> = (
  args,
) => {
  return (
    <Paper>
      <Box width={300}>
        <NetworkSelectorBox {...args} />
      </Box>
    </Paper>
  )
}

export const Basic = Template.bind({})
export const LongChainName = TemplateModal.bind({})

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
