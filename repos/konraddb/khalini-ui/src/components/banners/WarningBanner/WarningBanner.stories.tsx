import React, { ComponentProps } from 'react'

import InformationIcon from '@components/icons/business/Information'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import WarningBanner from './WarningBanner.component'

export default {
  title: 'Components/Banners/WarningBanner',
  description: '',
  component: WarningBanner,
}

const Template: Story<ComponentProps<typeof WarningBanner>> = (args) => (
  <Box>
    <WarningBanner {...args}></WarningBanner>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  title: 'High price impact',
  description: 'This swap is significantly moving the market price.',
}

const SmallerSize: Story<ComponentProps<typeof WarningBanner>> = (args) => (
  <Box maxWidth={400}>
    <WarningBanner {...args}></WarningBanner>
  </Box>
)

export const Small = SmallerSize.bind({})

Small.args = {
  title: 'High price impact',
  description: 'This swap is significantly moving the market price.',
}

const Icon: Story<ComponentProps<typeof WarningBanner>> = (args) => (
  <Box>
    <WarningBanner {...args}></WarningBanner>
  </Box>
)

export const WithIcon = Icon.bind({})

WithIcon.args = {
  title: 'High price impact',
  description: 'This swap is significantly moving the market price.',
  icon: <InformationIcon />,
}
