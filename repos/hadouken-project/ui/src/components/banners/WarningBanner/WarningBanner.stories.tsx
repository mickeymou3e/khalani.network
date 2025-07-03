import React, { ComponentProps } from 'react'

import InformationIcon from '@components/icons/business/Information'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import WarningBanner from './WarningBanner.component'

export default {
  title: 'Components/Banners/WarningBanner',
  description: '',
  component: WarningBanner,
}

type Story = StoryObj<ComponentProps<typeof WarningBanner>>

const Template: Story = {
  render: (args) => (
    <Box>
      <WarningBanner {...args}></WarningBanner>
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  title: 'High price impact',
  description: 'This swap is significantly moving the market price.',
}

const Link: Story = {
  render: (args) => (
    <Box>
      <WarningBanner {...args}></WarningBanner>
    </Box>
  ),
}

export const WithLink = Link

const VULNERABILITY_TITLE =
  'A vulnerability has been discovered that effects this pool.'
const VULNERABILITY_DESCRIPTION =
  'Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.'
const VULNERABILITY_LINK_TEXT = 'Read more'
const VULNERABILITY_LINK =
  'https://twitter.com/Balancer/status/1694014645378724280'

WithLink.args = {
  title: VULNERABILITY_TITLE,
  description: (
    <>
      {VULNERABILITY_DESCRIPTION}
      <a href={VULNERABILITY_LINK}>{VULNERABILITY_LINK_TEXT}</a>
    </>
  ),
}

const SmallerSize: Story = {
  render: (args) => (
    <Box maxWidth={400}>
      <WarningBanner {...args}></WarningBanner>
    </Box>
  ),
}

export const Small = { ...SmallerSize }

Small.args = {
  title: 'High price impact',
  description: 'This swap is significantly moving the market price.',
}

const Icon: Story = {
  render: (args) => (
    <Box>
      <WarningBanner {...args}></WarningBanner>
    </Box>
  ),
}

export const WithIcon = { ...Icon }

WithIcon.args = {
  title: 'High price impact',
  description: 'This swap is significantly moving the market price.',
  icon: <InformationIcon />,
}
