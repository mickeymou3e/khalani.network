import React, { ComponentProps } from 'react'

import { Box } from '@mui/system'
import { Story } from '@storybook/react/types-6-0'

import ExternalLink from './ExternalLink.component'

export default {
  title: 'Components/ExternalLink',
  description: '',
  component: ExternalLink,
}

const Template: Story<ComponentProps<typeof ExternalLink>> = (args) => (
  <Box p={3}>
    <ExternalLink {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  destination: 'https://v1.betanet.gwscan.com',
  hash: '0xf969d129cca24ddfdddf99901cd990476f217230f83822c7bb36d73ca01db9e3',
  type: 'tx',
}
