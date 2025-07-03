import React, { ComponentProps } from 'react'

import { StoryObj } from '@storybook/react'

import ActionInProgressBanner from './ActionInProgressBanner.component'

export default {
  title: 'Components/Banners/ActionInProgressBanner',
  description: '',
  component: ActionInProgressBanner,
}

type Story = StoryObj<ComponentProps<typeof ActionInProgressBanner>>

const Template: Story = {
  render: (args) => <ActionInProgressBanner {...args} />,
}

export const Basic = { ...Template }

Basic.args = {
  inProgress: true,
  actionName: 'Deposit',
}
