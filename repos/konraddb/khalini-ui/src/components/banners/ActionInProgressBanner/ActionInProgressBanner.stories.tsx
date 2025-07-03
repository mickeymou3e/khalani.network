import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import ActionInProgressBanner from './ActionInProgressBanner.component'

export default {
  title: 'Components/Banners/ActionInProgressBanner',
  description: '',
  component: ActionInProgressBanner,
}

const Template: Story<ComponentProps<typeof ActionInProgressBanner>> = (
  args,
) => <ActionInProgressBanner {...args} />

export const Basic = Template.bind({})

Basic.args = {
  inProgress: true,
  actionName: 'Deposit',
}
