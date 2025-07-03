import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import { ActionInProgress } from '@constants/Action'
import { Story } from '@storybook/react/types-6-0'

import LimitBanner from './LimitBanner.component'

export default {
  title: 'Components/Banners/LimitBanner',
  description: '',
  component: LimitBanner,
}

const Template: Story<ComponentProps<typeof LimitBanner>> = (args) => (
  <LimitBanner {...args} />
)

export const limitReached = Template.bind({})

limitReached.args = {
  display: true,
  action: ActionInProgress.Deposit,
  limit: BigNumber.from(100000000),
  userLimit: BigNumber.from(0),
  decimals: 3,
  displayDecimals: 3,
}

export const limit = Template.bind({})

limit.args = {
  display: true,
  action: ActionInProgress.Deposit,
  limit: BigNumber.from(100000000),
  userLimit: BigNumber.from(10000000),
  decimals: 6,
  displayDecimals: 3,
}
