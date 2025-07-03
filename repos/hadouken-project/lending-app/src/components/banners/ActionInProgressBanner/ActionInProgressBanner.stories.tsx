import React, { ComponentProps } from 'react'

import { ActionInProgress } from '@constants/Action'
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

export const differentActions = Template.bind({})

differentActions.args = {
  actionInProgress: ActionInProgress.Borrow,
  currentAction: ActionInProgress.CollateralSwitch,
}

export const noActionInProgress = Template.bind({})

noActionInProgress.args = {
  actionInProgress: undefined,
  currentAction: ActionInProgress.Borrow,
}
